# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LCS', '0002_tutor'),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('tutee', models.ForeignKey(related_query_name='matches', to='LCS.Tutee')),
                ('tutor', models.ForeignKey(to='LCS.Tutor', related_name='matches')),
            ],
        ),
    ]
