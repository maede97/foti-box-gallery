'use client';
import React from 'react';

export const ErrorPage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="absolute flex size-full flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide uppercase">foti-box.com</h1>
      <span className="text-error text-center text-lg">{message}</span>
    </div>
  );
};
