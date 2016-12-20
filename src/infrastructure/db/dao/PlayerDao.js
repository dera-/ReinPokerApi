import mysql from 'mysql';
import DbConnection from '../DbConnection';

export default class PlayerDao {
  constructor() {
    this.dbConnection = DbConnection.getConnection('game');
  }

  async insert(userData) {
    const query = 'INSERT INTO player (name, money, paid, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
    console.log(userData);
    const result = await this.dbConnection.execQueryInConnection(mysql.format(query, [userData.name, userData.money, userData.paid]));
    return result;
  }

  async get(id) {
    const query = 'SELECT * FROM player WHERE id = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [id]));
    return data.length === 0 ? {} : data[0];
  }
}
