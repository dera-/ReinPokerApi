import GameError from '../exception/GameError';
import * as ValidationType from './ValidationType.js';

export default class ValidationBase {
  run(data) {
    const validationList = this.getValidationList();
    const invalidList = Object.keys(validationList).filter(key => {
      return validationList[key].some(rule => false === this.validate(data[key], rule));
    });
    if (invalidList.length > 0) {
      const errorParamStr = invalidList.join(',');
      throw new GameError('パラメーターが不正です(エラー：'+ errorParamStr +')', 'BAD_REQUEST', 400);
    }
    return data;
  }

  getValidationList() {
    return {};
  }

  validate(target, type) {
    switch(type) {
      case ValidationType.IS_REQUIRED:
        return this.is_required(target);
      case ValidationType.IS_STRING:
        return this.is_string(target);
      case ValidationType.IS_NUMBER:
        return this.is_number(target);
      case ValidationType.IS_BOOLEAN:
        return this.is_boolean(target);
    }
    return this.originalValidate(target, type);
  }

  originalValidate(target, type) {
    return true;
  }

  is_required(target) {
    return target !== null && typeof target !== 'undefined';
  }

  is_string(target) {
    return typeof target === 'string';
  }

  is_number(target) {
    return typeof target === 'number';
  }

  is_boolean(target) {
    return typeof target === 'boolean';
  }
}
