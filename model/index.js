const mongoClient = require('mongodb').MongoClient; // 注意这里是大写，否则访问不到connect会报错

const DBPATH = 'mongodb://localhost:27017/blogDemo1';
const DBNAME = 'blogDemo1';

const connect = function (callFun) {
  mongoClient.connect(DBPATH, function (err, client) {
    if (err) {
      console.log('数据库连接失败', err);
    } else {
      const db = client.db(DBNAME);
      callFun && callFun(db);
      client.close();
    }
  });
}

module.exports = {
  connect
}