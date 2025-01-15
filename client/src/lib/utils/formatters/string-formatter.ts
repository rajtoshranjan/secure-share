import { camelCase, snakeCase } from 'lodash';

export class StringFormatter {
  static truncate(text: string, maxLength: number): string {
    return text.length > maxLength
      ? `${text.slice(0, maxLength / 2)}...${text.slice(-maxLength / 2)}`
      : text;
  }

  /**
   * Recursively converts keys of an object from snake case to camel case.
   * @param obj Response object whose keys we want to convert.
   * @returns Object with keys in camel case.
   */
  static convertKeysSnakeToCamelCase<ReturnType>(obj: any): ReturnType {
    if (Array.isArray(obj)) {
      return obj.map(
        StringFormatter.convertKeysSnakeToCamelCase,
      ) as unknown as ReturnType;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: Record<string, unknown>, key) => {
        const camelKey = camelCase(key);
        acc[camelKey] = StringFormatter.convertKeysSnakeToCamelCase(obj[key]);
        return acc;
      }, {}) as unknown as ReturnType;
    }
    return obj as ReturnType;
  }

  /**
   * Recursively converts keys of an object from camel case to snake case.
   * @param obj Response object whose keys we want to convert.
   * @returns Object with keys in snake case.
   */
  static convertKeysCamelCaseToSnakeCase<ReturnType>(obj: any): ReturnType {
    if (Array.isArray(obj)) {
      return obj.map(
        StringFormatter.convertKeysCamelCaseToSnakeCase,
      ) as unknown as ReturnType;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: Record<string, unknown>, key) => {
        const camelKey = snakeCase(key);
        acc[camelKey] = StringFormatter.convertKeysCamelCaseToSnakeCase(
          obj[key],
        );
        return acc;
      }, {}) as unknown as ReturnType;
    }
    return obj as ReturnType;
  }
}
