from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseBadRequest, \
    HttpResponseForbidden, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required

import json

from .models import Tutee, Subject, Tutor
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


def index(request):
    return app(request)


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


def logout_user(request):
    logout(request)
    return app(request)


def tutee_signup(request):
    if request.method == 'GET':
        return app(request)

    if request.method == 'POST':
        pass1 = request.POST['password']
        pass2 = request.POST['confirm_password']

        tutee_form = TuteeForm(request.POST)

        if pass1 != pass2:
            # TODO: handle this better
            return HttpResponseBadRequest('Passwords don\'t match')

        if not tutee_form.is_valid():
            # TODO: handle this better
            return HttpResponseBadRequest(json.dumps(tutee_form.errors))

        user = User.objects.create_user(username=request.POST['username'],
                                        first_name=request.POST['first_name'],
                                        last_name=request.POST['last_name'],
                                        email=request.POST['email'])

        user.set_password(pass1)
        user.save()

        tutee = tutee_form.save(commit=False)
        tutee.user = user

        tutee.save()
        tutee_form.save_m2m()  # Required b/c we used commit=False earlier

        return HttpResponse('Tutee signed up successfully')


def tutor_signup(request):
    if request.method == 'GET':
        return app(request)

    if request.method == 'POST':
        pass1 = request.POST['password']
        pass2 = request.POST['confirm_password']

        tutor_form = TutorForm(request.POST)

        if pass1 != pass2:
            # TODO: handle this better
            return HttpResponseBadRequest('Passwords don\'t match')

        if not tutor_form.is_valid():
            # TODO: handle this better
            return HttpResponseBadRequest(json.dumps(tutee_form.errors))

        user = User.objects.create_user(username=request.POST['username'],
                                        first_name=request.POST['first_name'],
                                        last_name=request.POST['last_name'],
                                        email=request.POST['email'])

        user.set_password(pass1)
        user.save()

        tutor = tutor_form.save(commit=False)
        tutor.user = user

        tutor.save()
        tutor_form.save_m2m()  # Required b/c we used commit=False earlier

        return HttpResponse('Tutor signed up successfully')


def get_subjects(request):
    return HttpResponse(
        json.dumps([model_to_dict(sub) for sub in Subject.objects.all()], cls=DjangoJSONEncoder),
        content_type='application/json'
    )


def get_tutee_info(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden()

    tutee = Tutee.objects.get(user=request.user)
    tutee_dict = model_to_dict(tutee)

    tutee_dict = chase_users(tutee_dict)
    tutee_dict = chase_subjects(tutee_dict)

    return HttpResponse(
        json.dumps(
            tutee_dict,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


def get_tutor_info(request):
    if not request.user.is_authenticated():
        return HttpResponseForbidden()

    tutor = Tutor.objects.get(user=request.user)
    tutor_dict = model_to_dict(tutor)

    tutor_dict = chase_users(tutor_dict)
    tutor_dict = chase_subjects(tutor_dict)

    return HttpResponse(
        json.dumps(
            tutor_dict,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


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


def chase_users(obj):
    if type(obj) == list:
        for u_obj in obj:
            replace_user(u_obj)
    elif type(obj) == dict:
        replace_user(obj)
    return obj


def replace_user(obj):
    obj['user'] = model_to_dict(
        User.objects.get(id=obj['user']),
        fields=['username', 'email', 'first_name', 'last_name']
    )


def get_all_tutors(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutors = Tutor.objects.all()
    tutors_list = [model_to_dict(tutor) for tutor in tutors]

    tutors_list = chase_subjects(tutors_list)
    tutors_list = chase_users(tutors_list)

    return HttpResponse(
        json.dumps(
            tutors_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


def get_all_tutees(request):
    if not (request.user.is_authenticated() and request.user.is_staff):
        return HttpResponseForbidden()

    tutees = Tutee.objects.all()
    tutees_list = [model_to_dict(tutee) for tutee in tutees]

    tutees_list = chase_subjects(tutees_list)
    tutees_list = chase_users(tutees_list)

    return HttpResponse(
        json.dumps(
            tutees_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


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

    return HttpResponse(
        json.dumps(
            admins_list,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )


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


    # TODO update user object related fields as well
    user = tutor.user
    user.first_name = request.POST['first_name']
    user.last_name = request.POST['last_name']
    user.save()

    return HttpResponse()


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