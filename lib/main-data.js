import { createContext, useContext, useState, useEffect } from "react";
import { setCookies, getCookie } from "cookies-next";

const MainDataContext = createContext({
  mainData: "",
  setMainData: () => {},
});

export function MainDataProvider({ children }) {
  const [mainData, setMainData] = useState(() => {
    return typeof getCookie("mainData") !== "undefined" ? JSON.parse(getCookie("mainData")) : {};
  });

  useEffect(() => {
    setCookies("mainData", JSON.stringify(mainData));
  }, [mainData]);

  return (
    <MainDataContext.Provider value={{ mainData, setMainData }}>
      {children}
    </MainDataContext.Provider>
  );
}

export function useMainData() {
  const context = useContext(MainDataContext);

  if (!context)
    throw new Error("useMainData must be used inside a `MainDataProvider`");

  return context;
}
