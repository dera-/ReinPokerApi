import * as ValidationType from './ValidationType.js';

export default class PlayerAiResultsValidation {
  getValidationList() {
    return {
      'is_win':[ValidationType.IS_REQUIRED, ValidationType.IS_BOOLEAN]
    };
  }
}