import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PageId =
  | 'dashboard'
  | 'schedule'
  | 'attendance'
  | 'training'
  | 'performance'
  | 'tournaments'
  | 'achievements'
  | 'coach'
  | 'announcements'
  | 'gallery'
  | 'profile'
  | 'settings';

interface NavContextType {
  currentPage: PageId;
  setPage: (page: PageId) => void;
}

const NavContext = createContext<NavContextType>({
  currentPage: 'dashboard',
  setPage: () => {},
});

export const useNavigation = () => useContext(NavContext);

export const NavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setPage] = useState<PageId>('dashboard');
  return (
    <NavContext.Provider value={{ currentPage, setPage }}>
      {children}
    </NavContext.Provider>
  );
};
