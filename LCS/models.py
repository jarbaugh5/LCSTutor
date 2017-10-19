from django.db import models
from django.contrib.auth.models import User

from datetime import datetime

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

    sat_help = models.BooleanField()
    subjects = models.ManyToManyField(Subject)
    gender = models.CharField(max_length=128)
    grade = models.CharField(max_length=128, choices=GRADES)
    parent_name = models.CharField(max_length=512)
    parent_phone = models.CharField(max_length=128)
    extra_info = models.TextField(null=True, blank=True)


class Tutor(models.Model):
    # GRADES = (
    #     ('1', '1st Grade'),
    #     ('2', '2nd Grade'),
    #     ('3', '3rd Grade'),
    #     ('4', '4th Grade'),
    #     ('5', '5th Grade'),
    #     ('6', '6th Grade'),
    #     ('7', '7th Grade'),
    #     ('8', '8th Grade'),
    #     ('9', '9th Grade'),
    #     ('10', '10th Grade'),
    #     ('11', '11th Grade'),
    #     ('12', '12th Grade'),
    # )

    user = models.ForeignKey(User)

    phone = models.CharField(max_length=128)
    sat_help = models.BooleanField()
    subjects = models.ManyToManyField(Subject)
    gender = models.CharField(max_length=128)
    # grade = models.CharField(max_length=128, choices=GRADES)
    grades15 = models.BooleanField(default=False)
    grades68 = models.BooleanField(default=False)
    grades912 = models.BooleanField(default=False)
    extra_info = models.TextField(null=True, blank=True)
    class_year = models.IntegerField(default=datetime.now().year)


class Match(models.Model):
    tutor = models.ForeignKey(Tutor, related_name='matches')
    tutee = models.ForeignKey(Tutee, related_name='matches')

    tutor_email_sent = models.BooleanField(default=False)
    tutee_email_sent = models.BooleanField(default=False)

    tutor_email_date = models.DateTimeField(null=True)
    tutee_email_date = models.DateTimeField(null=True)

    # Used for storing error reports if emails fail to send
    tutor_email_error = models.TextField(null=True)
    tutee_email_error = models.TextField(null=True)


class EmailTemplate(models.Model):
    name = models.TextField()
    template = models.TextField()
