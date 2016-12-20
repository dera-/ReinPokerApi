import mysql from 'mysql';
import DbConnection from '../DbConnection';

export default class PlayerAiDao {
  constructor() {
    this.dbConnection = DbConnection.getConnection('game');
  }

  async insert(aiData) {
    const query = 'INSERT INTO player_ai (player_id, name, file_key) VALUES (?, ?, ?)';
    const result = await this.dbConnection.execQueryInConnection(mysql.format(query, [aiData.player_id, aiData.name, aiData.file_key]));
    return result;
  }

  async get(id) {
    const query = 'SELECT * FROM player_ai WHERE id = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [id]));
    return data.length === 0 ? {} : data[0];
  }
}