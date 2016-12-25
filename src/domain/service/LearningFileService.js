import fs from 'fs';
import config from '../../../config/main';
import LearningDataModel from '../model/LearningDataModel';

const PREFIX = 'learning_';

export default class LearningFileService {
  saveData(userId, learningDataModel) {
    const dirName = config.dir.learning;
    fs.writeFileSync(dirName + PREFIX + userId + 'preflop.csv', learningDataModel.getData('preflop'));
    fs.writeFileSync(dirName + PREFIX + userId + 'flop.csv', learningDataModel.getData('flop'));
    fs.writeFileSync(dirName + PREFIX + userId + 'turn.csv', learningDataModel.getData('turn'));
    fs.writeFileSync(dirName + PREFIX + userId + 'river.csv', learningDataModel.getData('river'));
  }

  loadData(userId) {
    const dirName = config.dir.learning;
    const preflop = fs.readFileSync(dirName + PREFIX + userId + 'preflop.csv', 'utf-8');
    const flop = fs.readFileSync(dirName + PREFIX + userId + 'flop.csv', 'utf-8');
    const turn = fs.readFileSync(dirName + PREFIX + userId + 'turn.csv', 'utf-8');
    const river = fs.readFileSync(dirName + PREFIX + userId + 'river.csv', 'utf-8');
    return new LearningDataModel(preflop, flop, turn, river);
  }
}
