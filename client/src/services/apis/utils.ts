import { StringFormatter } from '../../lib/utils';

/**
 * Converts snake_case json response to camelCase response
 */
export const apiDataResponseMapper = <T extends object, P extends object>(
  response: T,
): P => {
  return StringFormatter.convertKeysSnakeToCamelCase<P>(response);
};

/**
 * Converts camelCase request payload to snake_case response
 */
export const apiPayloadMapper = <T extends object, P extends object>(
  response: T,
): P => {
  return StringFormatter.convertKeysCamelCaseToSnakeCase<P>(response);
};
