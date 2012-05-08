from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gwSites.views.home', name='home'),
    # url(r'^gwSites/', include('gwSites.foo.urls')),
    url(r'^/?$', 'gwSites.influBuild.views.home', name='home'),
	url(r'^contact/$','gwSites.influBuild.views.contact', name='contact'),
    
    #this url is only to be used  for initialisation purposes, thus, it's disabeld
	url(r'^init/?$','gwSites.influBuild.views.initDb'),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
