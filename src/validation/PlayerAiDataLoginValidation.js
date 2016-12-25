import ValidationBase from './ValidationBase';
import * as ValidationType from './ValidationType.js';

export default class PlayerAiDataLoginValidation extends ValidationBase {
  getValidationList() {
    return {
      'name':[ValidationType.IS_REQUIRED, ValidationType.IS_STRING],
      'teach_count':[ValidationType.IS_REQUIRED, ValidationType.IS_NUMBER],
      'hand_count':[ValidationType.IS_REQUIRED, ValidationType.IS_NUMBER],
      'pot_get_count':[ValidationType.IS_REQUIRED, ValidationType.IS_NUMBER],
      'fold_count':[ValidationType.IS_REQUIRED, ValidationType.IS_NUMBER],
      'right_fold_count':[ValidationType.IS_REQUIRED, ValidationType.IS_NUMBER]
    };
  }
}
