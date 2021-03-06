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
    url(r'^getalltutees', get_all_tutees),
    url(r'^getalladmins', get_all_admins),
    url(r'^updatetutor', update_tutor),
    url(r'^updatetutee', update_tutee),
    url(r'^deletetutee', delete_tutee),
    url(r'^deletetutor', delete_tutor),
    url(r'^revokeadmin', revoke_admin),
    url(r'^addadmin', add_admin),
    url(r'^makematch$', make_match),
    url(r'getmatches', get_matches),
    url(r'deletematch', delete_match),
    url(r'getemailtemplates', get_all_email_templates),
    url(r'createemailtemplate', create_email_template),
    url(r'modifyemailtemplate', modify_email_template),
    url(r'', index),
)
