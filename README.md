# NodeTodoAPI

## Introduction
Course project of [The Complete Node.js Developer Course (2nd Edition)](https://www.udemy.com/the-complete-nodejs-developer-course-2).
A REST APIs server that users can sign up and store and manipulate their own todo events. Build with Express.js and MangoDB. Deployed on [Heroku](https://www.heroku.com/).

## Features
- [x] User Sign up/Log in/Log out/Authentication/
- [x] Todos Create/Update/Get/Delete
- [x] User can only access and manipulate their own Todos 
- [ ] User interface (learning React)

## Instruction
The server is deployed on Heroku, url is https://afternoon-tundra-32854.herokuapp.com. This is REST APIs and I haven't finished the user interface part yet, so I recommend to use tools such as [Postman](https://www.getpostman.com/) to send request and test the application. All data format is JSON.

## API Document
### User Sign up/Log in/Log out/Authentication
#### sign up

Create a new user.
- URL: 

  `/users`
- Method: 

  `POST`
- Data Params: 

  Required:
  ```
  {
    "email": [string],
    "password": [string]
  }
  ```
  Optional:
  ```
  {
    "name": [string]
  }
  ```
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "_id": "5b7b3417ece600140033f6e5",
    "email": "dingjy94@test1.com",
    "name": "Jingyi"
  }
  ```
- Error Response:
  - Code: 400 Bad Request
  - Content: 
  ```
  {
    "code": 11000,
    "index": 0,
    "errmsg": "E11000 duplicate key error index: heroku_6hdznctz.users.$email_1 dup key: { :      \"dingjy94@test.com\" }",
    "op": {
        "email": "dingjy94@test.com",
        "name": "Jingyi",
        "password": "$2a$10$9dSOBYtOL0uzXQ909lF/ZOcrYqmVn72KxVhTn27De0W.z0QP/oQY2",
        "_id": "5b7b3376ece600140033f6e4",
        "tokens": [],
        "__v": 0
    }
  }
  ```
#### log in

User log in. If email and passworkd are correct, server generate x-auth and send that to client.
- URL: 

  `/users/login`
- Method: 

  `POST`
- Data Params: 

  Required:
  ```
  {
    "email": [string],
    "password": [string]
  }
  ```
  Optional:
  ```
  {
    "name": [string]
  }
  ```
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "_id": "5b7b3417ece600140033f6e5",
    "email": "dingjy94@test1.com",
    "name": "Jingyi"
  }
  ```
  - Header: `X-Auth` in response header.
- Error Response:
  - Code: 400 Bad Request

#### get me

Use x-auth to get current user information.
- URL: 

  `/users/me`
- Method: 

  `GET`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`

- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "_id": "5b7b3417ece600140033f6e5",
    "email": "dingjy94@test1.com",
    "name": "Jingyi"
  }
  ```
- Error Response:
  - Code: 400 Bad Request
  
#### log out

Log out, server will delete current user's x-auth from database.
- URL: 

  `/users/me/token`
- Method: 

  `DELETE`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`

- Success Response:
  - Code: 200
- Error Response:
  - Code: 401 Unauthorized

### Access and Manipulate Todos
#### create todo

Create a todo event.
- URL: 

  `/todos`
- Method: 

  `POST`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`
  `Content-Type=application/json`
  
- Data Params: 

  Required:
  ```
  {
    "text": [string]
  }
  ```

- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "__v": 0,
    "text": "Get up early",
    "_creater": "5b6925f29b24a41400bd7715",
    "_id": "5b7b71e80a5e271400edb31e",
    "completedAt": null,
    "completed": false
  }
  ```
- Error Response:
  - Code: 401 Unauthorized

#### get todos

get current user's todos list.
- URL: 

  `/todos`
- Method: 

  `GET`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`
  
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "todos": [
        {
            "_id": "5b6926ff9b24a41400bd7718",
            "text": "Get up early",
            "_creater": "5b6925f29b24a41400bd7715",
            "__v": 0,
            "completedAt": null,
            "completed": false
        },
        {
            "_id": "5b7b71e80a5e271400edb31e",
            "text": "Get up early",
            "_creater": "5b6925f29b24a41400bd7715",
            "__v": 0,
            "completedAt": null,
            "completed": false
        }
    ]
  }
  ```
- Error Response:
  - Code: 401 Unauthorized

#### get todo

Get user's todo by id.
- URL: 

  `/todos/:id`
- Method: 

  `GET`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "todo": {
        "_id": "5b6614f940336072bce67c45",
        "text": "second test",
        "completedAt": null,
        "completed": false
    }
  }
  ```
- Error Response:
  - Code: 401 Unauthorized
  - Code: 404 Not found

#### delete todo

Get user's todo by id.
- URL: 

  `/todos/:id`
- Method: 

  `DELETE`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "todo": {
        "_id": "5b7b75690a5e271400edb321",
        "text": "Get up early",
        "_creater": "5b7adf19e6734f14007576cf",
        "__v": 0,
        "completedAt": null,
        "completed": false
    }
  }
  ```
- Error Response:
  - Code: 401 Unauthorized
  - Code: 404 Not found
  
#### update todo

Update user's todo by id.
- URL: 

  `/todos/:id`
- Method: 

  `PATCH`
- URL Params:
  Required:
  `x-auth=[current user's x-auth]`
- Data Params: 

  Required:
  ```
  {
    "text": [string] 
    OR
    "completed": [boolean]
  }
  ```
- Success Response:
  - Code: 200
  - Content: 
  ```
  {
    "todo": {
        "_id": "5b7b75690a5e271400edb321",
        "text": "Get up early",
        "_creater": "5b7adf19e6734f14007576cf",
        "__v": 0,
        "completedAt": null,
        "completed": false
    }
  }
  ```
- Error Response:
  - Code: 401 Unauthorized
  - Code: 404 Not found
## Dependencies
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt.js
- body-parser
- crypto-js
- jsonwebtoken
- lodash
- validator
- Mocha(test)
