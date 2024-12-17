# API Design

**Prefix:** `/apis/`

### User Login:
- `/token/`: returns an access token and refresh token to authenticate the user's session
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

- `/token/refresh/`: when the access token expires, ping this for a new access token by utilizing the refresh token.
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
- `/rest/users/addUser/`: create a new user account
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
- `/rest/users/getUserInfo`: retrieve a user's info (email, phone number, etc.)
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
- `/rest/recipes/addRecipe/`: create a new user account
    - method: `POST`
    - Bearer Access Token required in headers
    - request: 
        ```json
        {
            "recipe_name": "[max length of 30]",
            "difficulty_rating": "easy" | "medium" | "hard",
            "time_to_prepare": <integer value>,
            "time_unit": "min" | "hr",
            "ingredients": [list of ingredient IDs],
            "restrictions": ["list of restrictions"],
            "allergens": ["list of allergens"],
            "rating": <1 - 5 floating point value, initialized as 0>,
            "description": "HTML formatted string"
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

- `/rest/recipes/search`: returns recipes according to the food restriction, allergens, or recipe name search query
    - method: `POST`
    - Bearer Access Token required in headers
    - request:
        ```json
        {
            "search": "chocolate cake",
            "restrictions": ["Vegan", "Gluten Free"],
            "allergens": ["Dairy", "Nuts"]
        }
    - response:
        ```json
        [
            {
                "recipe_id": 1,
                "recipe_name": "Vegan Chocolate Cake",
                "difficulty_level": "medium",
                "quickness": 45,
                "time_units": "minutes",
                "nutrition": {
                    "calories": 350,
                    "protein": "5g",
                    "carbohydrates": "50g",
                    "fat": "15g"
                },
                "ingredients": [
                    {
                        "id": 1,
                        "name": "Cocoa powder",
                        "allergens": [],
                        "restrictions": ["Vegan", "Gluten Free"]
                    },
                    {
                        "id": 2,
                        "name": "Coconut milk",
                        "allergens": [],
                        "restrictions": ["Vegan"]
                    }
                ],
                "restrictions": ["Vegan", "Gluten Free"],
                "allergens": [],
                "rating": 4.7,
                "image": "/media/recipe_images/vegan_chocolate_cake.jpg",
                "created_by": "test_user@gmail.com"
            },
        ]
        ```