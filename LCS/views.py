from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseBadRequest, \
    HttpResponseForbidden, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict

import json


def app(request):
    if request.user.is_authenticated():
        reqContext = RequestContext(request, {
            'user_details': json.dumps(model_to_dict(request.user, fields=['username', 'first_name', 'last_name', 'email']))
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