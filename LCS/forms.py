from django import forms
from .models import Tutee


class TuteeForm(forms.ModelForm):
    class Meta:
        model = Tutee
        exclude = ['user']