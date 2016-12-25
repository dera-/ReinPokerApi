'use strict';
import express from 'express';
import PlayerAiController from '../controller/PlayerAiController';

export const router = express.Router();
const playerAiController = new PlayerAiController();

/* ログイン */
router.get('/random', (req, res) => {
  playerAiController.getRandom(req, res);
});

/* 戦績更新 */
router.post('/myself/results', (req, res) => {
  playerAiController.updateResults(req, res);
});
