# API Design

### User Login:
- `/login/`: returns an access token and refresh token to authenticate the user's session
    - method: `POST`
    - request: 
        ```json
        {
            "username": <user's username>,
            "password": <user's password>
        }
        ```
    - response:
        ```json
        {
            "access": <access bearer token>,
            "refresh": <refresh token>
        }
        ```

- `/login/refresh/`: when the access token expires, ping this for a new access token by utilizing the refresh token.
    - method: `POST`
    - request: 
        ```json
        {
            "refresh": <refresh token>
        }
        ```
    - response:
        ```json
        {
            "access": <fresh access token>
        }
        ```

### User-Related Functions:
- `/users/addUser/`: create a new user account
    - method: `POST`
    - request: 
        ```json
        {
            "username": "[max length of 30]",
            "password": <user password>,
            "first_name": <first_name>,
            "last_name": <last_name>,
            "email": "student@example.com",
            "phone_number": "14081234567",
            "address": "6 MetroTech",
            "role": "student"
        }
        ```
    - response:
        ```json
        {
            "status": 200 | 400,
            "msg": "User <username> created successfully." | "Error creating user: <error_msg>",
            "username": <username>
        }
        ```
- `/users/getUserInfo`: retrieve a user's info (email, phone number, etc.)
    - method: `POST`
    - Bearer Access Token required in headers
    - request: 
        ```json
        {
            "username": <username>
        }
        ```
    - response:
        ```json
        {
            "status": 200 | 400,
            "data": {
                "username": "[max length of 30]",
                "first_name": <first_name>,
                "last_name": <last_name>,
                "email": "student@example.com",
                "phone_number": "14081234567",
                "address": "6 MetroTech",
                "role": "student"
            }
        }
        ```

### Recipe-Related Functions:
- `/recipes/addRecipe/`: create a new user account
    - method: `POST`
    - request: 
        ```json
        {
            "recipe_name": "[max length of 30]",
            "difficulty_rating": "easy" | "medium" | "hard",
            "time_to_prepare": <integer value>,
            "time_unit": "min" | "hr",
            "ingredients": [list of ingredient IDs],
            "restrictions": "vegetarian" | "vegan" | "none",
            "rating": <1 - 5 floating point value, initialized as 0>
        }
        ```
    - response:
        ```json
        {
            "status": 200 | 400,
            "msg": "User <username> created successfully." | "Error creating user: <error_msg>",
            "username": <username>
        }
        ```
- `/users/getUserInfo`: retrieve a user's info (email, phone number, etc.)
    - method: `POST`
    - Bearer Access Token required in headers
    - request: 
        ```json
        {
            "username": <username>
        }
        ```
    - response:
        ```json
        {
            "status": 200 | 400,
            "data": {
                "username": "[max length of 30]",
                "first_name": <first_name>,
                "last_name": <last_name>,
                "email": "student@example.com",
                "phone_number": "14081234567",
                "address": "6 MetroTech",
                "role": "student"
            }
        }
        ```


    