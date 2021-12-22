release: python server/manage.py migrate && python server/manage.py loaddata server/fixture/fixtures_2021.json
web: gunicorn --pythonpath server tutvwebsite.wsgi
