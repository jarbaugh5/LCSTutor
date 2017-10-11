# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0010_tutor_class_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutor',
            name='class_year',
            field=models.IntegerField(default=2017),
        ),
    ]
