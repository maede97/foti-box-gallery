import build from '@/build';
import LogoPage from '@/pages/logo-page';
import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Impressum | foti-box.com`,
  description: `foti-box.com | So kannst du uns erreichen.`,
};

const ImpressumPage: React.FC = () => {
  return (
    <LogoPage>
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

      <span className="text-sm tracking-wide">Der Quellcode dieser Website ist öffentlich:</span>
      <Link
        className="inline-flex text-sm tracking-wide"
        href="https://github.com/maede97/foti-box"
        target="_blank"
      >
        https://github.com/maede97/foti-box <ExternalLink className="size-4" />
      </Link>
      <span className="p-2"></span>
      <span className="text-sm tracking-wide">
        Version {build.version} vom {build.timestamp}
      </span>
      <span className="text-sm tracking-wide">
        Git Branch {build.git.branch}, Hash {build.git.hash}
      </span>
    </LogoPage>
  );
};

export default ImpressumPage;
