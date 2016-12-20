import mysql from 'mysql';
import DbConnection from '../DbConnection';

export default class SerialCodeDao {
  constructor() {
    this.dbConnection = DbConnection.getConnection('game');
  }

  async getUserIdByCode(code) {
    const query = 'SELECT user_id FROM serial_code WHERE code = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [code]));
    return data.length === 0 ? null : data[0]['user_id'];
  }

  async getByCode(code) {
    const query = 'SELECT * FROM serial_code WHERE code = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [code]));
    return data.length === 0 ? {} : data[0];
  }

  async updateUserId(id, user_id) {
    const query = 'UPDATE serial_code SET user_id = ? WHERE id = ?';
    const result = await this.dbConnection.execQueryInConnection(mysql.format(query, [user_id, id]));
    return result;
  }
}
