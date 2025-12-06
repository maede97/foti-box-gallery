import { LoadingSpinner } from '@/components/ui/loading';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="absolute flex size-full items-center justify-center">
      <LoadingSpinner color={'secondary'} />
    </div>
  );
};

export default Loading;
