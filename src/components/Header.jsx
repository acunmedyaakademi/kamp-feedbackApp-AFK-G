import "../css/header.css";
import { Data, ScreenSize } from "../context/AppContext";
import { useContext, useEffect, useState } from "react";

export default function Header({ selectedCategory, setSelectedCategory }) {
  const screenSize = useContext(ScreenSize);

  return (
    <>
      {screenSize >= 768 ? (
        <HeaderTablet selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      ) : (
        <HeaderMobile selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      )}
    </>
  );
}

function HeaderMobile({ selectedCategory, setSelectedCategory }) {
  const { data } = useContext(Data);
  const [hamburger, setHamburger] = useState(false);
  const [hamburgerMenuHeight, setHamburgerMenuHeight] = useState(window.innerHeight - 72.48);

  useEffect(() => {
    const handleResize = () => setHamburgerMenuHeight(window.innerHeight - 72.48);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusCount = (statusName) => {
    if (!data?.feedbacks) return 0;
    return data.feedbacks.filter((f) => f.status === statusName).length;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setHamburger(false);
  };

  return (
    <header className="header-mobile">
      <div className="header-mobile-left">
        <h1>Frontend Mentor</h1>
        <p>Feedback Board</p>
      </div>
      <label>
        <input type="checkbox" checked={hamburger} onChange={() => setHamburger(!hamburger)} />
        <img src={hamburger ? "/images/hamburger-icon-cross.svg" : "/images/hamburger-icon.svg"} alt="menu" />
      </label>
      {hamburger && (
        <div className="hamburger-menu-container" style={{ height: hamburgerMenuHeight }}>
          <div className="hamburger-menu-contents">
            <div className="hamburger-menu-categories">
              <button
                className={"hamburger-menu-category" + (selectedCategory === "" ? " active" : "")}
                onClick={() => handleCategorySelect("")}
              >
                All
              </button>
              {data?.categories?.map((category, index) => (
                <button
                  key={index}
                  className={"hamburger-menu-category" + (selectedCategory === category ? " active" : "")}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="hamburger-menu-roadmap">
              <div className="hamburger-menu-roadmap-header">
                <h2>Roadmap</h2>
                <a href="#/roadmap">View</a>
              </div>
              <ul>
                {data?.statuses?.map((roadmap, index) => (
                  <li key={index}>
                    <div className="hamburger-menu-roadmap-item">
                      <span>{roadmap.name}</span>
                      <span>{getStatusCount(roadmap.name)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderTablet({ selectedCategory, setSelectedCategory }) {
  const { data } = useContext(Data);

  const getStatusCount = (statusName) => {
    if (!data?.feedbacks) return 0;
    return data.feedbacks.filter((f) => f.status === statusName).length;
  };

  return (
    <header className="header-tablet">
      <div className="header-tablet-title-content">
        <h1>Frontend Mentor</h1>
        <p>Feedback Board</p>
      </div>
      <div className="header-tablet-categories">
        <button
          className={"header-tablet-category" + (selectedCategory === "" ? " active" : "")}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {data?.categories?.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={"header-tablet-category" + (selectedCategory === category ? " active" : "")}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="header-tablet-roadmap">
        <div className="header-tablet-roadmap-title">
          <h2>Roadmap</h2>
          <a href="#/roadmap">View</a>
        </div>
        <ul>
          {data?.statuses?.map((roadmap, index) => (
            <li key={index}>
              <div className="hamburger-menu-roadmap-item">
                <span>{roadmap.name}</span>
                <span>{getStatusCount(roadmap.name)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
