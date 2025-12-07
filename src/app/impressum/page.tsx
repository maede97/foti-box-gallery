import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Impressum | foti-box.com`,
  description: `foti-box.com | So kannst du uns erreichen.`,
};

const ImpressumPage: React.FC = () => {
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

          <span className="text-sm tracking-wide uppercase">
            Sie haben eine Anfrage?{' '}
            <Link
              href="mailto:mieten@foti-box.com"
              target="_blank"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 underline"
            >
              info@foti-box.com <ExternalLink className="size-4" />
            </Link>
          </span>

          <span className="text-sm tracking-wide">
            Der Quellcode dieser Website ist öffentlich:
          </span>
          <Link
            className="inline-flex text-sm tracking-wide"
            href="https://github.com/maede97/foti-box-gallery"
            target="_blank"
          >
            https://github.com/maede97/foti-box-gallery <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;
