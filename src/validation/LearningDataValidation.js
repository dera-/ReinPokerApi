import ValidationBase from './ValidationBase';
import * as ValidationType from './ValidationType.js';
import config from '../../config/main';

const IS_PRE_FLOP_DATA = 'is_pre_flop_data';
const IS_FLOP_DATA = 'is_flop_data';
const IS_TURN_DATA = 'is_turn_data';
const IS_RIVER_DATA = 'is_river_data'

export default class LearningDataValidation extends ValidationBase {
  getValidationList() {
    return {
      'pre_flop':[ValidationType.IS_REQUIRED, ValidationType.IS_STRING, IS_PRE_FLOP_DATA],
      'flop':[ValidationType.IS_REQUIRED, ValidationType.IS_STRING, IS_FLOP_DATA],
      'turn':[ValidationType.IS_REQUIRED, ValidationType.IS_STRING, IS_TURN_DATA],
      'river':[ValidationType.IS_REQUIRED, ValidationType.IS_STRING, IS_RIVER_DATA],
    };
  }

  originalValidate(target, type) {
    switch(type) {
      case IS_PRE_FLOP_DATA:
        return this.isRightFormat(target, config.learning_file.count.pre_flop);
      case IS_FLOP_DATA:
        return this.isRightFormat(target, config.learning_file.count.flop);
      case IS_TURN_DATA:
        return this.isRightFormat(target, config.learning_file.count.turn);
      case IS_RIVER_DATA:
        return this.isRightFormat(target, config.learning_file.count.river);
    }
  }

  isRightFormat(data, count) {
    const dataArray = data.split("\n");
    console.log('expect:'+count);
    console.log('actual:'+dataArray.length);
    return dataArray.length === count;
  }
}
