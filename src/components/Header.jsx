import "../css/header.css";

import { useContext, useEffect, useRef, useState } from "react";

import { Data } from "../App";

export default function Header() {
  const { data } = useContext(Data);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setScreenSize(window.innerWidth));
  }, []);

  return <>{screenSize > 768 ? <HeaderTablet /> : <HeaderMobile data={data} />}</>;
}

function HeaderMobile({ data }) {
  const [hamburger, setHamburger] = useState(false);
  const dialogRef = useRef(null);

  return (
    <>
      <header className="header-mobile">
        <div className="header-mobile-left">
          <h1>Frontend Mentor</h1>
          <p>Feedback Board</p>
        </div>
        <label>
          <input type="checkbox" checked={hamburger} onChange={() => setHamburger(!hamburger)} />
          <img src={hamburger ? "/images/hamburger-icon-cross.svg" : "/images/hamburger-icon.svg"} alt="" />
        </label>
      </header>
      {hamburger && (
        <div className="hamburger-menu-container">
          <div className="hamburger-menu-contents">
            <div className="hamburger-menu-categories">
              <button className="hamburger-menu-category active">All</button>
              {data.categories.map((category, index) => (
                <button key={index} className="hamburger-menu-category">
                  {category}
                </button>
              ))}
            </div>
            <div className="hamburger-menu-roadmap">
              <div className="hamburger-menu-roadmap-header">
                <h2>Roadmap</h2>
                <a href="#">View</a>
              </div>
              <ul>
                {data.statuses.map((roadmap, index) => (
                  <li key={index}>
                    <div className="hamburger-menu-roadmap-item">
                      <span>{roadmap.name}</span>
                      <span>{roadmap.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeaderTablet() {
  return <header></header>;
}
