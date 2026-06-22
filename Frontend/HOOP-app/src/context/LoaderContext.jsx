import { createContext, useContext, useState } from "react";

const LoaderContext = createContext({
  isLoading: false,
  setLoading: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
