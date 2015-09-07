# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0003_match'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='tutee_email_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='tutee_email_error',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='tutee_email_sent',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='match',
            name='tutor_email_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='tutor_email_error',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='match',
            name='tutor_email_sent',
            field=models.BooleanField(default=False),
        ),
    ]
