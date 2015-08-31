from django.conf.urls import patterns, include, url
from django.contrib import admin

from LCS.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LCS.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login$', login_user),
    url(r'^logout$', logout_user),
    url(r'^tuteesignup', tutee_signup),
    url(r'^tutorsignup', tutor_signup),
    url(r'^getsubjects', get_subjects),
    url(r'^gettuteeinfo', get_tutee_info),
    url(r'^gettutorinfo', get_tutor_info),
    url(r'^getalltutors', get_all_tutors),
    url(r'', index),
)
