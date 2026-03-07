import type { ReactNode } from 'react';

interface FadeInOnMountProps {
  children: ReactNode;
  className?: string;
}

const FadeInOnMount = ({ children, className }: FadeInOnMountProps) => (
  <div className={`fade-in-on-mount ${className ?? ''}`}>
    {children}
  </div>
);

export default FadeInOnMount;
