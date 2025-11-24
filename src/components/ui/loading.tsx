export const LoadingSpinner: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex h-[10dvh] w-full items-center justify-center">
      <div
        className={`h-12 w-12 animate-spin rounded-full border-3 border-solid border-${color} border-t-transparent`}
      ></div>
    </div>
  );
};
