import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Data, Route, ScreenSize } from "./context/AppContext";
import { getPage } from "./helper";

const STORAGE_KEY = "feedback_app_data";

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== "null" && saved !== "undefined") {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Failed to parse localStorage data", err);
    }
    return null;
  });

  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [route, setRoute] = useState(location.hash.substring(1) || "/");

  useEffect(() => {
    if (!data) {
      fetch("/data/feedback-data.json")
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
          } catch (err) {
            console.error("Failed to save data to localStorage", err);
          }
        })
        .catch((err) => console.error("Failed to fetch feedback data", err));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to save data to localStorage", err);
      }
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    const handleHashChange = () => setRoute(location.hash.substring(1) || "/");

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <Route.Provider value={route}>
      <Toaster position="top-center" reverseOrder={false} />
      <ScreenSize.Provider value={screenSize}>
        <Data.Provider value={{ data, setData }}>
          {data ? getPage(route) : <div style={{ padding: 40, textAlign: "center", color: "#3A4374" }}>Loading feedback...</div>}
        </Data.Provider>
      </ScreenSize.Provider>
    </Route.Provider>
  );
}
