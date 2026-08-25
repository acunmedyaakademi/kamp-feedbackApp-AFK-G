import "../css/suggestions.css";
import { Data, ScreenSize } from "../context/AppContext";
import { useContext, useMemo, useState } from "react";
import Header from "./Header";

export default function Suggestions() {
  const { data, setData } = useContext(Data);
  const screenSize = useContext(ScreenSize);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("Most Upvotes");
  const [sortDropdownMenu, setSortDropdownMenu] = useState(false);

  const getCommentCount = (feedback) => {
    if (!feedback.comments) return 0;
    return feedback.comments.reduce((acc, comment) => {
      const repliesCount = comment.replies ? comment.replies.length : 0;
      return acc + 1 + repliesCount;
    }, 0);
  };

  const processedSuggestions = useMemo(() => {
    if (!data?.feedbacks) return [];

    let filtered = data.feedbacks;
    if (selectedCategory && selectedCategory.trim() !== "") {
      filtered = filtered.filter(
        (item) => item.category && item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    const result = [...filtered];
    switch (sortBy) {
      case "Most Upvotes":
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "Least Upvotes":
        result.sort((a, b) => a.upvotes - b.upvotes);
        break;
      case "Most Comments":
        result.sort((a, b) => getCommentCount(b) - getCommentCount(a));
        break;
      case "Least Comments":
        result.sort((a, b) => getCommentCount(a) - getCommentCount(b));
        break;
      default:
        break;
    }

    return result;
  }, [data?.feedbacks, selectedCategory, sortBy]);

  const handleUpvote = (e, feedbackId) => {
    e.stopPropagation();
    if (!data?.currentUser || !data?.feedbacks) return;

    const myUpvotes = data.currentUser.myUpvotes || [];
    const isUpvoted = myUpvotes.includes(feedbackId);

    const newMyUpvotes = isUpvoted
      ? myUpvotes.filter((id) => id !== feedbackId)
      : [...myUpvotes, feedbackId];

    const newFeedbacks = data.feedbacks.map((f) => {
      if (f.id === feedbackId) {
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
    <div className="suggestions-container">
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="suggestions-contents">
        <div className="select-feedback">
          {screenSize >= 768 && (
            <div className="suggestions-length">
              <img src="/images/light.svg" alt="light icon" />
              <span>{processedSuggestions.length} Suggestions</span>
            </div>
          )}
          <div className="sort-by-wrapper" style={{ position: "relative" }}>
            <button
              className="sort-by-btn"
              type="button"
              onClick={() => setSortDropdownMenu(!sortDropdownMenu)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "bold" }}
            >
              <span style={{ fontWeight: "normal", color: "#F2F4FE" }}>Sort by :</span>
              {sortBy || "Most Upvotes"}
              {sortDropdownMenu ? (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6L4 2L8 6" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              ) : (
                <svg width="10" height="7" viewBox="0 0 10 7" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              )}
            </button>
            {sortDropdownMenu && (
              <div className="sort-dropdownMenu">
                {["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortDropdownMenu(false);
                    }}
                  >
                    {option}
                    {sortBy === option && <img src="/images/dropdown-tick.svg" alt="selected" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="add-feedback-btn" onClick={() => (location.hash = "/new-feedback")}>
            + Add Feedback
          </button>
        </div>

        <div className="feedbacks-container">
          {processedSuggestions.length > 0 ? (
            processedSuggestions.map((x) => (
              <div key={x.id} className="feedback-item">
                <div className="feedback-main-info">
                  <h4 onClick={() => (location.hash = `/feedback/${x.id}`)}>{x.title}</h4>
                  <p>{x.description}</p>
                  <span className="category-tag">{x.category}</span>
                </div>
                <div
                  className={"upvote-pill" + (data?.currentUser?.myUpvotes?.includes(x.id) ? " active" : "")}
                  onClick={(e) => handleUpvote(e, x.id)}
                >
                  <svg width="9" height="7" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6L4 2L8 6" stroke={data?.currentUser?.myUpvotes?.includes(x.id) ? "#fff" : "#4661E6"} strokeWidth="2" fill="none" />
                  </svg>
                  {x.upvotes}
                </div>
                <a href={`#/feedback/${x.id}`} className="comments-count">
                  <img src="/images/comment.svg" alt="comments" />
                  {getCommentCount(x)}
                </a>
              </div>
            ))
          ) : (
            <div className="empty-page">
              <img src="/images/null-page.svg" alt="No feedback yet" />
              <div className="empty-page-title">
                <h2>There is no feedback yet.</h2>
                <p>Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
              </div>
              <button onClick={() => (location.hash = "/new-feedback")}>+ Add Feedback</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
