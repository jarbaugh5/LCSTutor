from django.conf.urls import patterns, include, url
from django.contrib import admin

from LCS.views import index, login_user, logout_user

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LCS.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login$', login_user),
    url(r'^logout$', logout_user),
    url(r'', index),
)
