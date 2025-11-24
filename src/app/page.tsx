const HomePage: React.FC = () => {
  return (
    <div className="absolute flex size-full flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide uppercase">foti-box.com</h1>

      <span className="text-sm tracking-wide uppercase">
        Box Mieten?{' '}
        <a className="text-secondary hover:text-accent underline" href="mailto:mieten@foti-box.com">
          mieten@foti-box.com
        </a>
      </span>
    </div>
  );
};

export default HomePage;
