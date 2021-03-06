require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/todos', authenticate,(req, res) => {
  Todo.find({
    _creater: req.user._id
  }).then(todos => {
    res.send({todos});
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', authenticate,(req, res) => {
  const id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creater: req.user._id
  }).then(todo => {
    if (todo) {
      return res.status(200).send({todo});
    }
    res.status(404).send();
  }).catch(err => {
    res.status(400).send();
  });
});

app.post('/todos', authenticate,(req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creater: req.user._id
  });

  todo.save().then(doc => {
    res.send(doc);
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.delete('/todos/:id', authenticate,(req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creater: req.user._id
  }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch(err => {
    res.status(404).send();
  });
});

app.patch('/todos/:id', authenticate,async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creater: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch(err => {
    res.status(404).send();
  });
});

//User
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'name', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/me', authenticate,(req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate,(req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch(err => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`listen to port ${port}`);
});

module.exports = {app};