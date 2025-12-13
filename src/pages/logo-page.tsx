import Image from 'next/image';

const LogoPage: React.FC<{ children }> = ({ children }) => {
  return (
    <div className="absolute flex size-full flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        <Image
          src="/foti-box.png"
          alt="Foti Box"
          width={350}
          height={350}
          className="md:border-secondary md:border-r-4 md:pr-4"
        />

        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <h1 className="mb-4 text-4xl font-semibold tracking-wide uppercase">foti-box.com</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LogoPage;
