import { createContext, useEffect, useState } from "react";

import { getPage } from "./helper";

export const Data = createContext(null);
export const ScreenSize = createContext(null);
export default function App() {
  const [data, setData] = useState(null);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [route, setRoute] = useState(location.hash.substring(1) || "/");

  useEffect(() => {
    fetch("/data/feedback-data.json")
      .then((response) => response.json())
      .then((json) => setData(json));

    window.addEventListener("resize", () => setScreenSize(window.innerWidth));
    window.addEventListener("hashchange", () => setRoute(location.hash.substring(1) || "/"));
  }, []);

  return (
    <ScreenSize.Provider value={screenSize}>
      <Data.Provider value={{ data, setData }}>
        {data && getPage(route)}
      </Data.Provider>
    </ScreenSize.Provider>
  );
}
