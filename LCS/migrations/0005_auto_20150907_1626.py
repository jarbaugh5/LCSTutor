# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0004_auto_20150907_1522'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='tutee',
            field=models.ForeignKey(to='LCS.Tutee', related_name='matches'),
        ),
    ]
