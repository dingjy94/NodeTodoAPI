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

log in (get X-Auth).
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

### Access and Manipulate Todos

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
