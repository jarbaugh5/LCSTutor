# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0011_tutor_spec_needs'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutee',
            name='spec_needs',
            field=models.TextField(blank=True),
        ),
    ]
