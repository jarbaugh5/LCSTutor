Take two of the LCS Tutoring site.

Run dev commands like: `foreman run -e dev.env python manage.py migrate`

Run the dev server like: `foreman start -e dev.env`

for deploy: heroku buidpacks:set https://github.com/ddollar/heroku-buildpack-multi.git

After each deploy, run manage.py collectstatic through heroku