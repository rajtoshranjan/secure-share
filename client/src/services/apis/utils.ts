import { Formatter } from '../../lib/utils';

/**
 * Converts snake_case json response to camelCase response
 */
export const apiDataResponseMapper = <T extends object, P extends object>(
  response: T,
): P => {
  return Formatter.convertKeysSnakeToCamelCase<P>(response);
};

/**
 * Converts camelCase request payload to snake_case response
 */
export const apiPayloadMapper = <T extends object, P extends object>(
  response: T,
): P => {
  return Formatter.convertKeysCamelCaseToSnakeCase<P>(response);
};
