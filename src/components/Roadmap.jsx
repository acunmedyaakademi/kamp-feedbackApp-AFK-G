import "../css/roadmap.css";
import { Data, ScreenSize } from "../context/AppContext";
import { useContext, useState } from "react";

export default function Roadmap() {
  const screenSize = useContext(ScreenSize);
  return screenSize < 768 ? <RoadmapMobile /> : <RoadmapDesktop />;
}

function RoadmapMobile() {
  const { data } = useContext(Data);
  const [activeTab, setActiveTab] = useState("InProgress");

  const statuses = [
    { name: "Planned", label: "Planned" },
    { name: "InProgress", label: "In-Progress" },
    { name: "Live", label: "Live" },
  ];

  const getStatusCount = (statusName) => {
    return data?.feedbacks ? data.feedbacks.filter((f) => f.status === statusName).length : 0;
  };

  const getTabDescription = (tab) => {
    switch (tab) {
      case "Planned":
        return "Ideas prioritized for research";
      case "InProgress":
        return "Features currently being developed";
      case "Live":
        return "Released features";
      default:
        return "";
    }
  };

  const filteredFeedbacks = data?.feedbacks ? data.feedbacks.filter((f) => f.status === activeTab) : [];

  return (
    <div className="roadmap-container">
      <Header />
      <nav className="tabs">
        {statuses.map((st) => (
          <span
            key={st.name}
            className={activeTab === st.name ? "active" : ""}
            onClick={() => setActiveTab(st.name)}
          >
            {st.label} ({getStatusCount(st.name)})
          </span>
        ))}
      </nav>
      <div className="selected-tab">
        <h2>
          {statuses.find((s) => s.name === activeTab)?.label} ({filteredFeedbacks.length})
        </h2>
        <p>{getTabDescription(activeTab)}</p>
      </div>
      <main>
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id} feedback={feedback} />
        ))}
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className="roadmap-header">
      <div className="header-left">
        <a href="#/" className="back-btn" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L2 5L6 1" stroke="#CDD2EE" strokeWidth="2" />
          </svg>
          Go Back
        </a>
        <h1>Roadmap</h1>
      </div>
      <button className="add-feedback" onClick={() => (location.hash = "/new-feedback")}>
        + Add Feedback
      </button>
    </div>
  );
}

function Card({ feedback }) {
  const { data, setData } = useContext(Data);

  const getCommentCount = (fb) => {
    if (!fb.comments) return 0;
    return fb.comments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0);
  };

  const isUpvoted = data?.currentUser?.myUpvotes?.includes(feedback.id);

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (!data?.currentUser || !data?.feedbacks) return;
    const myUpvotes = data.currentUser.myUpvotes || [];

    const newMyUpvotes = isUpvoted
      ? myUpvotes.filter((id) => id !== feedback.id)
      : [...myUpvotes, feedback.id];

    const newFeedbacks = data.feedbacks.map((f) => {
      if (f.id === feedback.id) {
        return { ...f, upvotes: f.upvotes + (isUpvoted ? -1 : 1) };
      }
      return f;
    });

    setData({
      ...data,
      currentUser: { ...data.currentUser, myUpvotes: newMyUpvotes },
      feedbacks: newFeedbacks,
    });
  };

  return (
    <div className={"roadmap-card " + feedback.status}>
      <span className={"roadmap-status " + feedback.status}>{feedback.status}</span>
      <h3 onClick={() => (location.hash = `/feedback/${feedback.id}`)}>{feedback.title}</h3>
      <p>{feedback.description}</p>
      <span className="tag">{feedback.category}</span>
      <div className="interactions">
        <span className={"upvote" + (isUpvoted ? " active" : "")} onClick={handleUpvote}>
          <svg width="9" height="7" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6L4 2L8 6" stroke={isUpvoted ? "#fff" : "#4661E6"} strokeWidth="2" fill="none" />
          </svg>
          {feedback.upvotes}
        </span>
        <span className="comments" onClick={() => (location.hash = `/feedback/${feedback.id}`)}>
          <img src="/images/comment.svg" alt="comments" style={{ width: "18px", height: "16px" }} />
          {getCommentCount(feedback)}
        </span>
      </div>
    </div>
  );
}

function RoadmapDesktop() {
  const { data } = useContext(Data);

  const columns = [
    { name: "Planned", label: "Planned", description: "Ideas prioritized for research" },
    { name: "InProgress", label: "In-Progress", description: "Currently being developed" },
    { name: "Live", label: "Live", description: "Released features" },
  ];

  const getStatusCount = (statusName) => {
    return data?.feedbacks ? data.feedbacks.filter((f) => f.status === statusName).length : 0;
  };

  return (
    <div className="roadmap-container">
      <Header />
      <div className="roadmap-tablet-grid-group">
        {columns.map((col) => {
          const colFeedbacks = data?.feedbacks ? data.feedbacks.filter((f) => f.status === col.name) : [];
          return (
            <div key={col.name} className="roadmap-tablet-grid">
              <div className="roadmap-tablet-grid-title">
                <h2>
                  {col.label} ({getStatusCount(col.name)})
                </h2>
                <p>{col.description}</p>
              </div>
              <div className="roadmap-tablet-card-item">
                {colFeedbacks.map((feedback) => (
                  <Card key={feedback.id} feedback={feedback} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
