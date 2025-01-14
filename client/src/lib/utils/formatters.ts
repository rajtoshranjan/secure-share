import { camelCase, snakeCase } from 'lodash';

export const StringFormatter = {
  truncate: (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? `${text.slice(0, maxLength / 2)}...${text.slice(-maxLength / 2)}`
      : text;
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

/**
 * Format bytes to human readable string
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date to human readable string
 * @param date - Date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string => {
  return new Date(date).toLocaleDateString('en-US', options);
};
