import { QuestionType } from '../enums/question-type.enum';

export class ValidatorFactory {

static validate(type: QuestionType,value: any,): boolean {

    switch (type) {

      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
        return typeof value === 'string';

      case QuestionType.NUMBER:
        return typeof value === 'number';

      case QuestionType.CHECKBOX:
        return Array.isArray(value);

      case QuestionType.RADIO:
      case QuestionType.SELECT:
        return typeof value === 'string';

      case QuestionType.DATE:
        return !isNaN(Date.parse(value));

      default:
        return true;
    }

  }
}
