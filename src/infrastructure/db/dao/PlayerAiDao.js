import mysql from 'mysql';
import DbConnection from '../DbConnection';

export default class PlayerAiDao {
  constructor() {
    this.dbConnection = DbConnection.getConnection('game');
  }

  async insert(aiData) {
    const query = 'INSERT INTO player_ai (player_id, name, teach_count, hand_count, pot_get_count, fold_count, right_fold_count) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await this.dbConnection.execQueryInConnection(mysql.format(
      query,
      [aiData.player_id, aiData.name, aiData.teach_count, aiData.hand_count, aiData.pot_get_count, aiData.fold_count, aiData.right_fold_count]
    ));
    return result.insertId;
  }

  async updateData(aiData) {
    console.log(aiData);
    const query = 'UPDATE player_ai SET name = ?, teach_count = ?, hand_count = ?, pot_get_count = ?, fold_count = ?, right_fold_count = ? WHERE player_id = ?';
    await this.dbConnection.execQueryInConnection(mysql.format(
      query,
      [aiData.name, aiData.teach_count, aiData.hand_count, aiData.pot_get_count, aiData.fold_count, aiData.right_fold_count, aiData.player_id]
    ));
  }

  async updateResults(aiData) {
    const query = 'UPDATE player_ai SET battle_count = ?, win_count = ? WHERE player_id = ?';
    await this.dbConnection.execQueryInConnection(mysql.format(
      query,
      [aiData.battle_count, aiData.win_count, aiData.player_id]
    ));
  }

  async get(id) {
    const query = 'SELECT * FROM player_ai WHERE id = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [id]));
    return data.length === 0 ? {} : data[0];
  }

  async getByPlayerId(playerId) {
    const query = 'SELECT * FROM player_ai WHERE player_id = ?';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query, [playerId]));
    return data.length === 0 ? {} : data[0];
  }

  async getMaxId() {
    const query = 'SELECT MAX(id) FROM player_ai';
    const data = await this.dbConnection.execQueryInPool(mysql.format(query));
    return data.length === 0 || false === data[0].hasOwnProperty('MAX(id)') ? 0 : data[0]['MAX(id)'];
  }
}
