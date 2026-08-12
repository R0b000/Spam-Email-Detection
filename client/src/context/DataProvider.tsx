import { createContext, useState, ReactNode } from 'react';
import { VIEWS } from '../constants/constant';

export const DataContext = createContext<any>(null);

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider = ({ children }: DataProviderProps) => {
  const [view, setView] = useState(VIEWS.inbox);

  return (
    <DataContext.Provider
      value={{
        view,
        setView,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;