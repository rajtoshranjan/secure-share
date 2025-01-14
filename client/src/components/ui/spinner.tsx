import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
};
