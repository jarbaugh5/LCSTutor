Take two of the LCS Tutoring site.

Run dev commands like: `foreman run -e dev.env python manage.py migrate`

Run the dev server like: `foreman start -e dev.env`

Run: `heroku buildpacks:set https://github.com/heroku/heroku-buildpack-python`
if making a new heroku deployment to force heroku to use the python buildpack