import { camelCase, snakeCase } from 'lodash';

export const Formatter = {
  camelCaseToSnakeCase: (text: string) => {
    const result = text.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('_').toLowerCase();
  },
  /**
   * Recursively converts keys of an object from snake case to camel case.
   * @param obj Response object whose keys we want to convert.
   * @returns Object with keys in camel case.
   */
  convertKeysSnakeToCamelCase: function convertKeysSnakeToCamelCase<ReturnType>(
    obj: any,
  ): ReturnType {
    if (Array.isArray(obj)) {
      return obj.map(convertKeysSnakeToCamelCase) as unknown as ReturnType;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: Record<string, unknown>, key) => {
        const camelKey = camelCase(key);
        acc[camelKey] = convertKeysSnakeToCamelCase(obj[key]);
        return acc;
      }, {}) as unknown as ReturnType;
    }
    return obj as ReturnType;
  },

  /**
   * Recursively converts keys of an object from camel case to snake case.
   * @param obj Response object whose keys we want to convert.
   * @returns Object with keys in snake case.
   */
  convertKeysCamelCaseToSnakeCase: function convertKeysCamelCaseToSnakeCase<
    ReturnType,
  >(obj: any): ReturnType {
    if (Array.isArray(obj)) {
      return obj.map(convertKeysCamelCaseToSnakeCase) as unknown as ReturnType;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: Record<string, unknown>, key) => {
        const camelKey = snakeCase(key);
        acc[camelKey] = convertKeysCamelCaseToSnakeCase(obj[key]);
        return acc;
      }, {}) as unknown as ReturnType;
    }
    return obj as ReturnType;
  },
};
