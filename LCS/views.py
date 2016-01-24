from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseBadRequest, \
    HttpResponseForbidden, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError

import json
import smtplib

from datetime import datetime

from .models import Tutee, Subject, Tutor, Match, EmailTemplate
from .forms import TuteeForm, TutorForm


def app(request):
    if request.user.is_authenticated():
        details = model_to_dict(request.user, fields=['username', 'first_name', 'last_name', 'email'])
        details['is_tutee'] = request.user.tutee_set.count() == 1
        details['is_staff'] = request.user.is_staff
        reqContext = RequestContext(request, {
            'user_details': json.dumps(details, cls=DjangoJSONEncoder)
        })
    else:
        reqContext = RequestContext(request, {'user_details': json.dumps(None)})

    return render_to_response(
        'index.html',
        reqContext
    )


@csrf_exempt
def index(request):
    return app(request)


@csrf_exempt
def login_user(request):
    try:
        username = request.POST['username']
        password = request.POST['password']
    except KeyError:
        return HttpResponseBadRequest()

    user = authenticate(username=username, password=password)
    if user is not None:  # If the user exists
        if user.is_active:  # And their account has not been deleted
            login(request, user)  # Log them in
            print('Authenticated')
        else:
            # User account is disabled
            pass
    else:
        print('Failed Auth')

    # No matter what, redirect to app
    # The cookie will determine login status
    return HttpResponseRedirect('/')


@csrf_exempt
def logout_user(request):
    logout(request)
    return app(request)


@csrf_exempt
def tutee_signup(request):
    if request.method == 'GET':
        return app(request)

    if request.method == 'POST':
        pass1 = request.POST['password']
        pass2 = request.POST['confirm_password']

        tutee_form = TuteeForm(request.POST)

        if pass1 != pass2:
            return HttpResponseBadRequest(json.dumps({
                'password': [
                    {
                        'message': 'The passwords do not match',
                        'code': 'invalid'
                    }
                ]
            }), content_type='application/json')

        if not tutee_form.is_valid():
            return HttpResponseBadRequest(tutee_form.errors.as_json(), content_type='application/json')

        try:
            user = User.objects.create_user(username=request.POST['username'],
                                            first_name=request.POST['first_name'],
                                            last_name=request.POST['last_name'],
                                            email=request.POST['email'])
            user.set_password(pass1)
            user.save()
        except Exception as e:
            return HttpResponseBadRequest(json.dumps({
                'user': [
                    {
                        'message': 'The username or email is already in use',
                        'code': 'invalid'
                    }
                ]
            }), content_type='application/json')



        tutee = tutee_form.save(commit=False)
        tutee.user = user

        tutee.save()
        tutee_form.save_m2m()  # Required b/c we used commit=False earlier

        return HttpResponse('Tutee signed up successfully')


@csrf_exempt
def tutor_signup(request):
    if request.method == 'GET':
        return app(request)

    if request.method == 'POST':
        pass1 = request.POST['password']
        pass2 = request.POST['confirm_password']

        tutor_form = TutorForm(request.POST)

        if pass1 != pass2:
            return HttpResponseBadRequest(json.dumps({
                'password': [
                    {
                        'message': 'The passwords do not match',
                        'code': 'invalid'
                    }
                ]
            }), content_type='application/json')

        if not tutor_form.is_valid():
            return HttpResponseBadRequest(tutor_form.errors.as_json(), content_type='application/json')

        try:
            user = User.objects.create_user(username=request.POST['username'],
                                            first_name=request.POST['first_name'],
                                            last_name=request.POST['last_name'],
                                            email=request.POST['email'])
            user.set_password(pass1)
            user.save()
        except Exception as e:
            return HttpResponseBadRequest(json.dumps({
                'user': [
                    {
                        'message': 'The username or email is already in use',
                        'code': 'invalid'
                    }
                ]
            }), content_type='application/json')

        tutor = tutor_form.save(commit=False)
        tutor.user = user

        tutor.save()
        tutor_form.save_m2m()  # Required b/c we used commit=False earlier

        return HttpResponse('Tutor signed up successfully')


@csrf_exempt
def get_subjects(request):
    return HttpResponse(
        json.dumps([model_to_dict(sub) for sub in Subject.objects.all()], cls=DjangoJSONEncoder),
        content_type='application/json'
    )


@csrf_exempt
def get_tutee_info(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden()

    tutee = Tutee.objects.get(user=request.user)
    tutee_dict = model_to_dict(tutee)

    tutee_dict = chase_users(tutee_dict)
    tutee_dict = chase_subjects(tutee_dict)
    tutee_dict = chase_matches(tutee_dict, Tutee)

    return HttpResponse(
        json.dumps(
            tutee_dict,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def get_tutor_info(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden()

    tutor = Tutor.objects.get(user=request.user)
    tutor_dict = model_to_dict(tutor)

    tutor_dict = chase_users(tutor_dict)
    tutor_dict = chase_subjects(tutor_dict)
    tutor_dict = chase_matches(tutor_dict, Tutor)

    return HttpResponse(
        json.dumps(
            tutor_dict,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def chase_subjects(tut):
    """
    Chase the subject foreign keys in dicts and replace them with Subject model dicts
    :param tut: tutee/tutor dict of list of tutee/tutor dicts
    :return:
    """
    if type(tut) == list:
        for tut_obj in tut:
            if 'subjects' in tut_obj:
                tut_obj['subjects'] = [model_to_dict(Subject.objects.get(id=sub_id)) for sub_id in tut_obj['subjects']]
    elif type(tut) == dict:
        if 'subjects' in tut:
            tut['subjects'] = [model_to_dict(Subject.objects.get(id=sub_id)) for sub_id in tut['subjects']]
    return tut


@csrf_exempt
def chase_users(obj):
    if type(obj) == list:
        for u_obj in obj:
            replace_user(u_obj)
    elif type(obj) == dict:
        replace_user(obj)
    return obj


@csrf_exempt
def chase_matches(obj, manager):
    if type(obj) == list:
        for u_obj in obj:
            u_obj['matches'] = [model_to_dict(match) for match in manager.objects.get(id=u_obj['id']).matches.all()]
    elif type(obj) == dict:
        obj['matches'] = [model_to_dict(match) for match in manager.objects.get(id=obj['id']).matches.all()]
    return obj


@csrf_exempt
def replace_user(obj):
    obj['user'] = model_to_dict(
        User.objects.get(id=obj['user']),
        fields=['username', 'email', 'first_name', 'last_name', 'date_joined']
    )
    date = obj['user']['date_joined']
    obj['user']['date_joined'] = str(date.month) + '/' + str(date.day) + '/' + str(date.year)


@csrf_exempt
def get_all_tutors(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutors = Tutor.objects.all()
    tutors_list = [model_to_dict(tutor) for tutor in tutors]

    tutors_list = chase_subjects(tutors_list)
    tutors_list = chase_users(tutors_list)
    tutors_list = chase_matches(tutors_list, Tutor)

    return HttpResponse(
        json.dumps(
            tutors_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def get_all_tutees(request):
    import time
    time.sleep(2)
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutees = Tutee.objects.all()
    tutees_list = [model_to_dict(tutee) for tutee in tutees]

    tutees_list = chase_subjects(tutees_list)
    tutees_list = chase_users(tutees_list)
    tutees_list = chase_matches(tutees_list, Tutee)

    return HttpResponse(
        json.dumps(
            tutees_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def get_all_admins(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    admins_list = User.objects.filter(is_staff=True)

    tmp_list = []
    for admin in admins_list:
        try:
            tutor = model_to_dict(Tutor.objects.get(user=admin))
        except Tutor.DoesNotExist:
            tutor = {'user': admin.id}
        tmp_list.append(tutor)
    admins_list = tmp_list

    admins_list = chase_subjects(admins_list)
    admins_list = chase_users(admins_list)
    admins_list = chase_matches(admins_list, Tutor)

    return HttpResponse(
        json.dumps(
            admins_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def update_tutor(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutor_form = TutorForm(request.POST)

    if not tutor_form.is_valid():
        return HttpResponseBadRequest()

    # Should only be one, but this allows the update method
    matches = Tutor.objects.filter(id=request.POST['id'])

    matches.update(**{
        'extra_info': tutor_form.cleaned_data['extra_info'],
        'gender': tutor_form.cleaned_data['gender'],
        'phone': tutor_form.cleaned_data['phone'],
        'sat_help': tutor_form.cleaned_data['sat_help']
    })  # Can't just unpack the cleaned data b/c subjects is a m2m field :/

    tutor = Tutor.objects.get(id=request.POST['id'])

    curr_subjects = tutor.subjects
    for subject in curr_subjects.all():
        if subject not in tutor_form.cleaned_data['subjects']:
            tutor.subjects.remove(subject)

    for subject in tutor_form.cleaned_data['subjects']:
        tutor.subjects.add(subject)

    user = tutor.user
    user_data = json.loads(request.POST['user'])
    user.first_name = user_data['first_name']
    user.last_name = user_data['last_name']
    user.save()

    return HttpResponse()

@csrf_exempt
def update_tutee(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutee_form = TuteeForm(request.POST)

    if not tutee_form.is_valid():
        return HttpResponseBadRequest(tutee_form.errors.as_json())

    # Should only be one, but this allows the update method
    matches = Tutee.objects.filter(id=request.POST['id'])

    matches.update(**{
        'extra_info': tutee_form.cleaned_data['extra_info'],
        'gender': tutee_form.cleaned_data['gender'],
        'parent_phone': tutee_form.cleaned_data['parent_phone'],
        'parent_name': tutee_form.cleaned_data['parent_name'],
        'sat_help': tutee_form.cleaned_data['sat_help']
    })  # Can't just unpack the cleaned data b/c subjects is a m2m field :/

    tutee = Tutee.objects.get(id=request.POST['id'])

    curr_subjects = tutee.subjects
    for subject in curr_subjects.all():
        if subject not in tutee_form.cleaned_data['subjects']:
            tutee.subjects.remove(subject)

    for subject in tutee_form.cleaned_data['subjects']:
        tutee.subjects.add(subject)

    user = tutee.user
    user_data = json.loads(request.POST['user'])
    user.first_name = user_data['first_name']
    user.last_name = user_data['last_name']
    user.save()

    return HttpResponse()


@csrf_exempt
def revoke_admin(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        tutor_id = int(request.POST['id'])
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('No valid user ID provided')

    try:
        tutor_to_revoke = Tutor.objects.get(id=tutor_id)
    except Tutor.DoesNotExist:
        return HttpResponseBadRequest('User does not exist')

    user_to_revoke = tutor_to_revoke.user

    if user_to_revoke.is_superuser:
        return HttpResponseBadRequest('User\'s privileges can not be revoked')

    user_to_revoke.is_staff = False
    user_to_revoke.save()

    return HttpResponse()


@csrf_exempt
def delete_tutee(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        tutee_id = int(request.POST['id'])
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('No valid user ID provided')

    try:
        tutee_to_delete = Tutee.objects.get(id=tutee_id)
    except Tutor.DoesNotExist:
        return HttpResponseBadRequest('User does not exist')

    tutee_to_delete.delete()

    return HttpResponse()


@csrf_exempt
def delete_tutor(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        tutor_id = int(request.POST['id'])
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('No valid user ID provided')

    try:
        tutor_to_delete = Tutor.objects.get(id=tutor_id)
    except Tutor.DoesNotExist:
        return HttpResponseBadRequest('User does not exist')

    tutor_to_delete.delete()

    return HttpResponse()


@csrf_exempt
def add_admin(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        tutor_id = int(request.POST['id'])
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('No valid user ID provided')

    try:
        tutor_to_promote = Tutor.objects.get(id=tutor_id)
    except Tutor.DoesNotExist:
        return HttpResponseBadRequest('User does not exist')

    user_to_promote = tutor_to_promote.user

    user_to_promote.is_staff = True
    user_to_promote.save()

    return HttpResponse()


@csrf_exempt
def make_match(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        tutor_id = int(request.POST['tutorId'])
        tutee_id = int(request.POST['tuteeId'])

        tutor_email = request.POST['tutorEmail']
        tutee_email = request.POST['tuteeEmail']
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest()

    tutor = Tutor.objects.get(id=tutor_id)
    tutee = Tutee.objects.get(id=tutee_id)

    match, _ = Match.objects.get_or_create(tutor=tutor, tutee=tutee)

    try:
        send_mail('LCS Tutoring Match', tutor_email, 'lcstutoringtech@gmail.com', [tutor.user.email], fail_silently=False)
        match.tutor_email_sent = True
        match.tutor_email_date = datetime.now()
        match.tutor_email_error = None
    except smtplib.SMTPException as e:
        match.tutor_email_error = str(e)

    try:
        send_mail('LCS Tutoring Match', tutee_email, 'lcstutoringtech@gmail.com', [tutee.user.email], fail_silently=False)
        match.tutee_email_sent = True
        match.tutee_email_date = datetime.now()
        match.tutee_email_error = None
    except smtplib.SMTPException as e:
        match.tutee_email_error = str(e)

    match.save()

    return HttpResponse(
        json.dumps(
            model_to_dict(match),
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


@csrf_exempt
def get_matches(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    matches = Match.objects.all()

    matches_list = []
    for match in matches:
        match_dict = model_to_dict(match)
        match_dict['tutor'] = chase_users(model_to_dict(match.tutor))
        match_dict['tutee'] = chase_users(model_to_dict(match.tutee))
        matches_list.append(match_dict)

    return HttpResponse(
        json.dumps(
            matches_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )

@csrf_exempt
def delete_match(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        match_id = int(request.POST['id'])
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('No valid match ID provided')

    try:
        match_to_delete = Match.objects.get(id=match_id)
    except Match.DoesNotExist:
        return HttpResponseBadRequest('Match does not exist')

    match_to_delete.delete()

    return HttpResponse()

@csrf_exempt
def get_all_email_templates(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    return HttpResponse(
        json.dumps(
            [model_to_dict(tmpl) for tmpl in EmailTemplate.objects.all()],
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )

@csrf_exempt
def create_email_template(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        name = request.POST['name']
        template = request.POST['template']
    except KeyError as e:
        return HttpResponseBadRequest('No name or template provided')

    EmailTemplate.objects.create(name=name, template=template)

    return HttpResponse()

@csrf_exempt
def modify_email_template(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    try:
        id = int(request.POST['id'])
        name = request.POST['name']
        template = request.POST['template']
    except (KeyError, ValueError) as e:
        return HttpResponseBadRequest('Invalid id, name or template provided')

    try:
        emailTemplate = EmailTemplate.objects.get(id=id)
    except EmailTemplate.DoesNotExist as e:
        return HttpResponseBadRequest('Id does not exist')

    emailTemplate.name = name
    emailTemplate.template = template
    emailTemplate.save()

    return HttpResponse()