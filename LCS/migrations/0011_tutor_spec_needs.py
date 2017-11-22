# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0010_tutor_class_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutor',
            name='spec_needs',
            field=models.BooleanField(default=False),
        ),
    ]
