# Team 2 - SWE Fall '24 - Semester Project
Project Source Code for Fall 2024 CS-GY 6063: Software Engineering - Dr. Sameri - Team 2

### Local Development
##### React Front End
Run the React front-end using:
```sh
$ cd frontend
$ npm install
$ npm start
```

The front-end should be running on port 3000.

##### Django Back End
Run the Django back-end server using:
```sh
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py runserver
```

The server will be running on port 8000.

##### PostgreSQL Database Setup
Follow these instructions to run PostgreSQL locally on MacOS. 

1. Install PostgreSQL using the following:
```sh
$ brew install postgresql@17
```
2. Make sure PostgreSQL CLI commands can be utilized by adding them to your `PATH` variable.
```sh
$ echo 'export PATH=/opt/homebrew/Cellar/postgresql@17/17.0_1/bin:$PATH"' >> ~/.zshrc
```
3. Create a user.
```sh
$ createuser admin
```
4. Create the local database.
```sh
$ createdb campus_grocery_app_db
```
5. Add a password for the user and assign the user as the owner of the database with the following commands.
```sh
$ psql
<local>=# alter user admin with password 'admin123';
<local>=# grant all privileges on database campus_grocery_app_db to admin;
<local>=# alter database campus_grocery_app_db owner to admin;
```
6. Make sure the appropriate fields exist in your `.env` file. Refer to the `.env.example` file to create your own environment variables accordingly.