# Team 2 - SWE Fall '24 - Semester Project
Project Source Code for Fall 2024 CS-GY 6063: Software Engineering - Dr. Saremi - Team 2

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

##### UI Screenshots
##### Screenshot of Landing Page

![image](https://github.com/user-attachments/assets/ab124e65-049f-43b2-8e02-6c57371db876)

##### Screenshots of Login and SignUp Page (only accepts emails ending with @nyu.edu)

![image](https://github.com/user-attachments/assets/ad7d0f51-3933-421f-bdca-fd65302075a5)
![image](https://github.com/user-attachments/assets/a03e9e86-6e74-4edc-a34b-0b4bd9d1c44b)

##### Home Page (shows rating, saving, user made recipes and saved recipes view, delete functionality)
![image](https://github.com/user-attachments/assets/0ce7ad27-8f86-4b10-995d-288baae14a5e)

##### Adding recipe
![image](https://github.com/user-attachments/assets/08cd89f7-3630-474d-9acb-a31c6229d3d9)
![image](https://github.com/user-attachments/assets/d17acec3-31dd-4f0c-93f1-e137c781de39)
![image](https://github.com/user-attachments/assets/cd53b942-aaab-410d-97d5-72d293d13da3)
![image](https://github.com/user-attachments/assets/d8b3d1ef-a175-4a0f-9745-a19537365dbf)
![image](https://github.com/user-attachments/assets/f74b2b35-58a8-48a0-92c5-1a242cdc5acd)
![image](https://github.com/user-attachments/assets/e1af71b0-3716-43e4-8fa1-b8f96a6f74c6)
![image](https://github.com/user-attachments/assets/ffd76cf5-3067-458b-bc69-4f9b2800c70d)

##### View recipe
![image](https://github.com/user-attachments/assets/13974d71-7d82-4f8a-bd08-839c0a3a196d)

##### Search recipe
![image](https://github.com/user-attachments/assets/8f0899c6-3fce-49d5-b125-fdd2caa2770b)
![image](https://github.com/user-attachments/assets/dd90d81e-5119-4d63-8c8d-ff94767c9ddb)

##### Grocery Marketplace 
##### Adding a post
![image](https://github.com/user-attachments/assets/51e2f106-fbe5-4fce-91e7-3ec5e123a277)
![image](https://github.com/user-attachments/assets/3fdecd12-fa19-4fe4-87c3-a5e5892f86c2)
![image](https://github.com/user-attachments/assets/a28ca4fe-3a2f-401b-ac5f-26fad9f5f2d8)
![image](https://github.com/user-attachments/assets/dff8c221-8343-434c-a10f-f455cef7dd4f)
![image](https://github.com/user-attachments/assets/85fe8daf-44c6-42d0-a78d-db2a9926e562)
![image](https://github.com/user-attachments/assets/5556de70-7061-42e8-a0c7-71af1cd7081e)

##### View of all previously added posts (also contains delete functioanlity)
![image](https://github.com/user-attachments/assets/060561b0-947b-4712-994f-b7d2453e696e)

##### Search buy posts
![image](https://github.com/user-attachments/assets/6498f95f-39fc-4320-a46c-cfb6fbc68f7b)
![image](https://github.com/user-attachments/assets/59ccf067-ecd6-4a45-9077-084eadd0fb8c)
![image](https://github.com/user-attachments/assets/db968c7a-9863-4f39-99b7-cfbfbfba9de8)






















