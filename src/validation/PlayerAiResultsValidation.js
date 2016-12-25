import ValidationBase from './ValidationBase';
import * as ValidationType from './ValidationType.js';

export default class PlayerAiResultsValidation extends ValidationBase {
  getValidationList() {
    return {
      'is_win':[ValidationType.IS_REQUIRED, ValidationType.IS_BOOLEAN]
    };
  }
}