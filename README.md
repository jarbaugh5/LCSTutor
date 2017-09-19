Take two of the LCS Tutoring site.

To setup:

1. Clone repo

2. Install npm, perform `npm install`

3. Do bower install `./node_modules/bower/bin/bower -f install`. The `-f` is because the package.json is old and has warnings.

4. Create a python virtual environment and install the dependencies `pip install -r requirements.txt`

5. Activate your environment and run the migrations: `heroku local:run -e dev.env python manage.py migrate`

6. Run the dev server like: `heroku local -e dev.env`

This heroku doc is a great tutorial for heroku toolbelt stuff: https://devcenter.heroku.com/articles/heroku-local

Deployment note: This project requires two heroku buildpacks: heroku/nodejs and heroku/python.
The two buildpacks must be in that order so that the django collectstatic command runs after
all of the javascript dependencies are installed by the nodejs build.
(https://devcenter.heroku.com/articles/using-multiple-buildpacks-for-an-app)

TODO:
- automatically change the grade of each tutee each year
	- when grades change automatically, tutees in grade 13 should be removed
	  from the system
- remove the duplicate entries for the same people
- checkbox for special needs for tutee form as well as a field where parents
  can explain it
  	- checkbox for tutors to say whether or not they're comfortable tutoring
  	  kids with special needs
- include a class year field for tutors (do with Kevin)
- create an easier way to group all parent emails into an e-list