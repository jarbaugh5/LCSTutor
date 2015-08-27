from django.db import models
from django.contrib.auth.models import User


class Subject(models.Model):
    name = models.CharField(max_length=512)


class Tutee(models.Model):
    GRADES = (
        ('1', '1st Grade'),
        ('2', '2nd Grade'),
        ('3', '3rd Grade'),
        ('4', '4th Grade'),
        ('5', '5th Grade'),
        ('6', '6th Grade'),
        ('7', '7th Grade'),
        ('8', '8th Grade'),
        ('9', '9th Grade'),
        ('10', '10th Grade'),
        ('11', '11th Grade'),
        ('12', '12th Grade'),
    )

    user = models.ForeignKey(User)

    tutee_phone = models.CharField(max_length=128)
    sat_help = models.BooleanField()
    subjects = models.ManyToManyField(Subject)
    gender = models.CharField(max_length=128)
    grade = models.CharField(max_length=128, choices=GRADES)
    parent_name = models.CharField(max_length=512)
    parent_phone = models.CharField(max_length=128)
    extra_info = models.TextField()