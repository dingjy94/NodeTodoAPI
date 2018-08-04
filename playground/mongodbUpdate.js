// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB', err);
  }
  console.log('Connected to MongoDB successfully');

  db.collection('Users').findOneAndUpdate({ 
    _id: new ObjectID('5b650220d601bb9d868e8a57')
  }, {
    $set: {
      name: 'Ling'
    }, 
    $inc: {
      age: -3
    }
  }, {
    returnOriginal: false
  }).then(result => {
    console.log(result);
  });

  db.close();
});