import { QuestionType } from '../enums/question-type.enum';

export class QuestionFactory {

  static defaultSettings(type: QuestionType): any {

    switch (type) {

      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
        return {
          minLength: 0,
          maxLength: 500,
        };

      case QuestionType.NUMBER:
        return {
          min: null,
          max: null,
        };

      case QuestionType.DATE:
        return {
          minDate: null,
          maxDate: null,
        };

      case QuestionType.RATING:
        return {
          min: 1,
          max: 5,
        };

      case QuestionType.FILE:
        return {
          maxSize: 10,
          extensions: [],
        };

      default:
        return {};

    }

  }

}