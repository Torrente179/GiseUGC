import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

type MediaSessionContextValue = {
  theaterActive: boolean;
  acquireTheater: () => () => void;
};

const MediaSessionContext = createContext<MediaSessionContextValue | null>(null);

export const MediaSessionProvider = ({ children }: PropsWithChildren) => {
  const theaterOwners = useRef(0);
  const [theaterActive, setTheaterActive] = useState(false);

  const acquireTheater = useCallback(() => {
    theaterOwners.current += 1;
    setTheaterActive(true);

    let released = false;
    return () => {
      if (released) return;
      released = true;
      theaterOwners.current = Math.max(0, theaterOwners.current - 1);
      if (theaterOwners.current === 0) setTheaterActive(false);
    };
  }, []);

  const value = useMemo(
    () => ({ theaterActive, acquireTheater }),
    [acquireTheater, theaterActive],
  );

  return (
    <MediaSessionContext.Provider value={value}>
      {children}
    </MediaSessionContext.Provider>
  );
};

export const useMediaSession = () => useContext(MediaSessionContext);
