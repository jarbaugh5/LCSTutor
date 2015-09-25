# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0007_auto_20150918_1607'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutor',
            name='grades15',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tutor',
            name='grades68',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='tutor',
            name='grades912',
            field=models.BooleanField(default=False),
        ),
    ]
