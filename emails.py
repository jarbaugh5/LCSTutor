# First, run the command: heroku local:run -e dev.env python manage.py shell
#    (or for production): heroku run python manage.py shell
# Then, in the Django shell, run the command: exec(open('emails.py').read())

from LCS.models import *
import unicodedata
import csv

tutees = Tutee.objects.all()
tutors = Tutor.objects.all()

tutee_emails = []
tutee_parents = []
for tutee in tutees:
	tutee_emails.append(unicodedata.normalize('NFKD', tutee.user.email).encode('ascii','ignore'))
	tutee_parents.append(unicodedata.normalize('NFKD', tutee.parent_name).encode('ascii','ignore'))

tutor_emails = []
tutor_names = []
for tutor in tutors:
	tutor_emails.append(unicodedata.normalize('NFKD', tutor.user.email).encode('ascii','ignore'))
	name = unicodedata.normalize('NFKD', tutor.user.first_name).encode('ascii','ignore') + " " 
	     + unicodedata.normalize('NFKD', tutor.user.last_name).encode('ascii','ignore')
	tutor_names.append(name)

with open('emails.csv', 'wt') as csvfile:
    emailwriter = csv.writer(csvfile)
    for email in tutee_emails:
    	emailwriter.writerow([email])
    	print(email.decode('UTF-8'))
    for parent in tutee_parents:
    	print(parent.decode('UTF-8'))
    for email in tutor_emails:
    	print(email.decode('UTF-8'))
    for name in tutor_names:
    	print(name.decode('UTF-8'))