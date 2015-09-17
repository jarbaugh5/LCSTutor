# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0005_auto_20150907_1626'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutee',
            name='tutee_phone',
        ),
    ]
