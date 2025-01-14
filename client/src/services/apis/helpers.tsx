import lodash from 'lodash';
import { UseFormSetError } from 'react-hook-form';
import { toast } from '../../hooks';
import { history, tokenManager } from '../../lib/utils';
import { ApiErrorResponse } from './types';

export const logout = () => {
  tokenManager.removeToken();
  tokenManager.removeRefreshToken();

  history.push('/login');
};

export const getErrorMessages = (error: ApiErrorResponse) => {
  return (
    <div className="space-y-1">
      {Object.entries(error.data || {}).map(([key, errors]) => {
        if (!Array.isArray(errors)) {
          return null;
        }

        return (
          <div key={key} className="flex gap-1">
            <span className="font-medium">{key}:</span>
            <span>{errors.join(', ')}</span>
          </div>
        );
      })}
    </div>
  );
};

export const handleResponseErrorMessage = (
  error?: ApiErrorResponse | null,
  setError?: UseFormSetError<any>,
) => {
  if (error && error.meta.status_code !== 401) {
    if (setError && error.data) {
      Object.entries(error.data).forEach(([field, errors]) => {
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
