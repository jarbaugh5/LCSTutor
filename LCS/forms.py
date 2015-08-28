from django import forms
from .models import Tutee, Tutor


class TuteeForm(forms.ModelForm):
    class Meta:
        model = Tutee
        exclude = ['user']


class TutorForm(forms.ModelForm):
    class Meta:
        model = Tutor
        exclude = ['user']