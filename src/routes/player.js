'use strict';
import express from 'express';
import PlayerController from '../controller/PlayerController';

export const router = express.Router();
const playerController = new PlayerController();

/* GET */
router.get('/', (req, res) => {
  playerController.get(req, res);
});

/* POST */
router.post('/', (req, res) => {
  playerController.post(req, res);
});
