from django.contrib import admin
from .models import Subject, Tutor, Tutee


class SubjectAdmin(admin.ModelAdmin):
    pass


class TutorAdmin(admin.ModelAdmin):
    pass


class TuteeAdmin(admin.ModelAdmin):
    pass

admin.site.register(Subject, SubjectAdmin)
admin.site.register(Tutor, TutorAdmin)
admin.site.register(Tutee, TuteeAdmin)
