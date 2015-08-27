# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('name', models.CharField(max_length=512)),
            ],
        ),
        migrations.CreateModel(
            name='Tutee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('tutee_phone', models.CharField(max_length=128)),
                ('sat_help', models.BooleanField()),
                ('gender', models.CharField(max_length=128)),
                ('grade', models.CharField(max_length=128, choices=[('1', '1st Grade'), ('2', '2nd Grade'), ('3', '3rd Grade'), ('4', '4th Grade'), ('5', '5th Grade'), ('6', '6th Grade'), ('7', '7th Grade'), ('8', '8th Grade'), ('9', '9th Grade'), ('10', '10th Grade'), ('11', '11th Grade'), ('12', '12th Grade')])),
                ('parent_name', models.CharField(max_length=512)),
                ('parent_phone', models.CharField(max_length=128)),
                ('extra_info', models.TextField()),
                ('subjects', models.ManyToManyField(to='LCS.Subject')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
