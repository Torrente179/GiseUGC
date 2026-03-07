import { useState, type ReactNode } from 'react';

interface FadeInOnMountProps {
  children: ReactNode;
  className?: string;
}

const FadeInOnMount = ({ children, className }: FadeInOnMountProps) => {
  const [done, setDone] = useState(false);

  return (
    <div
      className={`${done ? '' : 'fade-in-on-mount'} ${className ?? ''}`}
      onAnimationEnd={() => setDone(true)}
    >
      {children}
    </div>
  );
};

export default FadeInOnMount;
