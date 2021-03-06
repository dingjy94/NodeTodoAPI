const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {app} = require('./../server');
const {dummy, populateTodos, users, populateUsers} = require('./seeds/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'todo text test';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(err => done(err));
      });
  });

  it('should return error if invalid data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('Get /todos', () => {
  it('should return todos list', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('Get /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummy[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummy[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${(new ObjectID()).toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid todo id', done => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not return todo doc created by other', (done) => {
    request(app)
      .get(`/todos/${dummy[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo doc', (done) => {
    const hexId = dummy[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then(doc => {
          expect(doc).toNotExist();
          done();
        }).catch(err => done(err));
      });
  });

  it('should not remove todo doc', (done) => {
    const hexId = dummy[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then(doc => {
          expect(doc).toExist();
          done();
        }).catch(err => done(err));
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .delete(`/todos/${(new ObjectID()).toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid todo id', done => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const id = dummy[0]._id.toHexString();
    const text = 'patch test';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text, 
        completed: true
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should not update other todo', (done) => {
    const id = dummy[0]._id.toHexString();
    const text = 'patch test';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt if todo is not completed', (done) => {
    const id = dummy[1]._id.toHexString();
    const text = 'patch test';

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.name).toBe(users[0].name);
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('Post /users', () => {
  it('should create a user', (done) => {
    const email = 'example@exampl.com';
    const name = 'example';
    const password = '123456';

    request(app)
      .post('/users')
      .send({
        email,
        name,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.name).toBe(name);
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch(err => done(err));
      });
  });

  it('should return validation error if request invalid', (done) => {
    const email = 'example@exampl.com';

    request(app)
      .post('/users')
      .send(email)
      .expect(400)
      .end(done);
  });

  it('should not create new user if exist', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123456'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login users and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        name: users[1].name,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch(err => done(err));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        name: users[1].name,
        password: '000000'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove token when logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[0]._id).then(user => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(err => done(err));
      })
  });
});