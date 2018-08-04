// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB', err);
  }
  console.log('Connected to MongoDB successfully');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'Jingyi',
    age: 24,
    location: 'Florida'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert users', err);
    }

    console.log(result.ops);
  });

  db.close();
});