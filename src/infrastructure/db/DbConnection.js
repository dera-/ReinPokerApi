import dbConfig from '../../../config/db';
import mysql from 'mysql';
let env = process.env.NODE_ENV || 'default';
const DbConnections = new Map();

export default class DbConnection {
  constructor(dbNameKey) {
    this.connection = mysql.createConnection({
      host     : dbConfig[env].host, //接続先ホスト
      user     : dbConfig[env].user,      //ユーザー名
      password : dbConfig[env].password,  //パスワード
      database : dbConfig[env]['db_names'][dbNameKey]    //DB名
    });
    this.pool = mysql.createPool({
      connectionLimit : 10,
      host            : dbConfig[env].host,
      user            : dbConfig[env].user,
      password        : dbConfig[env].password,
      database        : dbConfig[env]['db_names'][dbNameKey]    //DB名
    });
  }

  static getConnection(dbName) {
    if (!DbConnections.has(dbName)) {
      DbConnections.set(dbName, new DbConnection(dbName))
    }
    return DbConnections.get(dbName);
  }

  execQueryInPool(query) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  execQueryInConnection(query) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (error, result) => {
        if (error) {
          console.log('できない。。');
          console.log(error);
          reject(error);
        }
        console.log('できた');
        console.log(result);
        resolve(result);
      });
    });
  }

  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  commit() {
    return new Promise((resolve, reject) => {
      this.connection.commit((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  rollback() {
    this.connection.rollback();
  }
}
