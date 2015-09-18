# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0006_remove_tutee_tutee_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutee',
            name='extra_info',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='tutor',
            name='extra_info',
            field=models.TextField(blank=True, null=True),
        ),
    ]
