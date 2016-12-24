'use strict';
import express from 'express';
import PlayerController from '../controller/PlayerController';

export const router = express.Router();
const playerController = new PlayerController();

/* ログイン */
router.post('/login', (req, res) => {
  playerController.login(req, res);
});

/* 新規登録 */
router.post('/', (req, res) => {
  playerController.register(req, res);
});
