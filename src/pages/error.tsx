'use client';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ErrorPage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="absolute flex size-full flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        <Image
          src="/foti-box.png"
          alt="Foti Box"
          width={350}
          height={350}
          className="border-secondary border-r-4 pr-4"
        />

        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <h1 className="mb-4 text-4xl font-semibold tracking-wide uppercase">foti-box.com</h1>

          <span className="text-error text-center text-lg">Fehler {message}</span>

          <span className="text-sm tracking-wide uppercase">
            Brauchen Sie hilfe?{' '}
            <Link
              href="mailto:mieten@foti-box.com"
              target="_blank"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 underline"
            >
              hilfe@foti-box.com <ExternalLink className="size-4" />
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
