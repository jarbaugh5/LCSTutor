Take two of the LCS Tutoring site.

To setup:

1. Clone repo

2. Install npm, perform `npm install`

3. Do bower install `./node_modules/bower/bin/bower -f install`. The `-f` is because the package.json is old and has warnings.

4. Create a python virtual environment and install the dependencies `pip install -r requirements.txt`

5. Activate your environment and run the migrations: `heroku local:run -e dev.env python manage.py migrate`

6. Run the dev server like: `heroku local -e dev.env`

This heroku doc is a great tutorial for heroku toolbelt stuff: https://devcenter.heroku.com/articles/heroku-local

For deploy: heroku buidpacks:set https://github.com/ddollar/heroku-buildpack-multi.git