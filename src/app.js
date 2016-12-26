import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import 'babel-polyfill';

import {router as player} from './routes/Player';
import {router as playerai} from './routes/PlayerAi';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit:'50mb',extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/player', player);
app.use('/player-ai', playerai);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500);
  res.json({'error': err});
});

module.exports = app;
