import lodash from 'lodash';
import { UseFormSetError } from 'react-hook-form';
import { toast } from '../../hooks';
import { history, tokenManager } from '../../utils';
import { ApiErrorResponse } from './types';

export const logout = () => {
  tokenManager.removeToken();
  tokenManager.removeRefreshToken();

  history.push('/');
};

export const getErrorMessages = (error: ApiErrorResponse) => {
  const messages = (
    <>
      {Object.entries(error.meta.details || {}).map(([key, errors]) => {
        if (!Array.isArray(errors)) {
          return null;
        }

        return (
          <div key={key}>
            <b>{key}</b>: {errors.join(', ')}
            <br />
          </div>
        );
      })}
    </>
  );
  return messages;
};

export const handleResponseErrorMessage = (
  isError: boolean,
  error?: ApiErrorResponse | null,
  setError?: UseFormSetError<any>,
) => {
  if (isError && error && error.meta.status_code !== 401) {
    if (setError && error.meta.details) {
      Object.entries(error.meta.details).forEach(([field, errors]) => {
        if (Array.isArray(errors) && errors.length > 0) {
          const camelCaseField = lodash.camelCase(field);
          setError(camelCaseField, {
            type: 'manual',
            message: errors[0],
          });
        }
      });
    } else {
      toast({
        title: error.meta?.message,
        description: getErrorMessages(error),
      });
    }
  }
};
