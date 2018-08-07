// need config file config.json
// config format like:
// {
//   "test": {
//   "PORT": 3000,
//   "MONGODB_URI": "mongodb://127.0.0.1:27017/TodoAppTest",
//   "JWT_SECRET": "12345678test"
// }

const env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
// }