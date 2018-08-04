// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB', err);
  }
  console.log('Connected to MongoDB successfully');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'dinner'}).then((result) => {
  //   console.log(result);
  // });

  //findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
    console.log(result);
  });

  db.close();
});