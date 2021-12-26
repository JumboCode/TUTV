# Django Migrations and Fixtures

## Migrations

Migrations are Django’s way of propagating changes you make to your models
(adding a field, deleting a model, etc.) into your database schema. Migration
operations are specified in files in the `migrations` directory.

If changes are made to models, new migrations files will need to be generated.
Do this using the command `./manage.py makemigrations`. Migrations are
incremental and doing this will generated a new file in the `migrations`
directory.

To apply the migration (i.e. propagate it to the database), use the command
`./manage.py migrate`.

### Squashing Migrations

If there are too many migration files and you want to clean them up, you
can use the `squashmigrations` command. For example, you can do
`./manage.py squashmigrations api <highest migration ID>`.

### Resetting Migrations

If you don't care about the data in your database much, you can do the following
to completely reset migrations while retaining data:

1. Export fixtures following the instructions below.
2. Drop the database. If using SQLite, simply delete db.sqlite3.
3. Run `./manage.py makemigrations`.
4. Run `./manage.py migrate`.

This site has some really good info on other options as well:
https://simpleisbetterthancomplex.com/tutorial/2016/07/26/how-to-reset-migrations.html

## Fixtures

Fixtures are django's way to import data into/export data from a database.
When importing a fixture file, it must be in the correct format that
matches the existing django models (and thus the database after migrations
and completed)

The file `fixtures_2021.json` contains fixtures that has been
converted from the TUTV json data ripped from the old TUTV website into one
that is in the format of the current django models on this branch.

### Exporting Fixtures

Fixtures can be exported from the database using the command

```
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > dump.json
```

The additional arguments help prevent some errors when loading the fixtures. For
more information, see this page:
https://www.coderedcorp.com/blog/how-to-dump-your-django-database-and-load-it-into-/

### Importing Fixtures

To populate an empty database with the fixture data, first run a migration
to setup the appropriate tables in the database. The migration file has
already been generated in this branch (there is a single migration). To
apply the migration, use the command `./manage.py migrate`.

Then, to populate the database with fixture data, run the command
`./manage.py loaddata fixture/fixtures_2021.json`.

Things become a lot trickier when the database has already been
prepopulated with data from a previous model. You might need to delete that
database file and create a new one in order for this to work properly.
There're a lot of resources on Google about this.

## Generating Fixtures for the TUTV App

The `fixtures_to_import.json` is generated from the `tutv_unformatted.json`
file by running the python script `generate_fixtures.py`. If you need to
change the django models and require a different format for the fixtures,
modify and rerun this script to produce a valid fixture file. Then you can
follow the instructions above to apply those fixtures.
