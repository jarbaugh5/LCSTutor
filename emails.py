# First, run the command: heroku local:run -e dev.env python manage.py shell
# Then, in the Django shell, run the command: execfile('emails.py')

from LCS.models import *
import unicodedata
import csv

tutors = Tutor.objects.all()

emails = []
for tutor in tutors:
	emails.append(unicodedata.normalize('NFKD', tutor.user.email).encode('ascii','ignore'))

with open('emails.csv', 'wb') as csvfile:
    emailwriter = csv.writer(csvfile)
    for email in emails:
    	emailwriter.writerow([email])