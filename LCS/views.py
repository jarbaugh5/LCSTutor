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

from .models import Tutee, Subject
from .forms import TuteeForm


def app(request):
    if request.user.is_authenticated():
        details = model_to_dict(request.user, fields=['username', 'first_name', 'last_name', 'email'])
        details['is_tutee'] = request.user.tutee_set.count() == 1
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

    # Chase user foreign key
    tutee_dict['user'] = model_to_dict(request.user, fields=['first_name', 'last_name', 'username', 'email'])

    # Chase subjects foreign keys
    subjects = []
    for sub_id in tutee_dict['subjects']:
        subjects.append(model_to_dict(Subject.objects.get(id=sub_id)))
    tutee_dict['subjects'] = subjects

    return HttpResponse(
        json.dumps(
            tutee_dict,
            cls=DjangoJSONEncoder
        ),
        content_type='application/json'
    )