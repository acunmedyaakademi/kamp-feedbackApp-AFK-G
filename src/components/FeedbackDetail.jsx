import "../css/feedbackdetail.css";
import { Data, Route, ScreenSize } from "../context/AppContext";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function FeedbackDetail() {
  const { data, setData } = useContext(Data);
  const screenSize = useContext(ScreenSize);
  const route = useContext(Route);

  const [newComment, setNewComment] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const feedbackId = useMemo(() => {
    const parts = route.split("/").filter(Boolean);
    return parts.at(-1);
  }, [route]);

  const currentFeedback = useMemo(() => {
    if (!data?.feedbacks) return null;
    return data.feedbacks.find((f) => f.id === feedbackId);
  }, [data?.feedbacks, feedbackId]);

  useEffect(() => {
    setReplyTargetId(null);
    setReplyContent("");
  }, [route]);

  if (!currentFeedback) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#3A4374" }}>
        <h2>Feedback not found</h2>
        <p style={{ margin: "16px 0", color: "#647196" }}>The requested feedback item does not exist or was deleted.</p>
        <a
          href="#/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#4661E6",
            color: "#fff",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Go back home
        </a>
      </div>
    );
  }

  const isUpvoted = data?.currentUser?.myUpvotes?.includes(currentFeedback.id);

  const handleUpvote = () => {
    if (!data?.currentUser || !data?.feedbacks) return;
    const myUpvotes = data.currentUser.myUpvotes || [];

    const newMyUpvotes = isUpvoted
      ? myUpvotes.filter((id) => id !== currentFeedback.id)
      : [...myUpvotes, currentFeedback.id];

    const newFeedbacks = data.feedbacks.map((f) => {
      if (f.id === currentFeedback.id) {
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userComment = {
      id: crypto.randomUUID(),
      author: data.currentUser.name,
      name: data.currentUser.name,
      username: data.currentUser.username,
      content: newComment.trim(),
      image: data.currentUser.image || "",
      replies: [],
    };

    const updatedFeedbacks = data.feedbacks.map((f) => {
      if (f.id === currentFeedback.id) {
        return {
          ...f,
          comments: [...(f.comments || []), userComment],
        };
      }
      return f;
    });

    setData({ ...data, feedbacks: updatedFeedbacks });
    setNewComment("");
    toast.success("Comment posted successfully!");
  };

  const handleReplySubmit = (e, topCommentId, replyToUsername) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const formattedUsername = replyToUsername
      ? replyToUsername.startsWith("@")
        ? replyToUsername
        : `@${replyToUsername}`
      : "";

    const userReply = {
      id: crypto.randomUUID(),
      author: data.currentUser.name,
      name: data.currentUser.name,
      username: data.currentUser.username,
      content: `${formattedUsername ? formattedUsername + " " : ""}${replyContent.trim()}`,
      image: data.currentUser.image || "",
    };

    const updatedFeedbacks = data.feedbacks.map((f) => {
      if (f.id === currentFeedback.id) {
        const updatedComments = (f.comments || []).map((c) => {
          if (c.id === topCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), userReply],
            };
          }
          return c;
        });
        return { ...f, comments: updatedComments };
      }
      return f;
    });

    setData({ ...data, feedbacks: updatedFeedbacks });
    setReplyTargetId(null);
    setReplyContent("");
    toast.success("Reply posted successfully!");
  };

  const totalCommentCount = (currentFeedback.comments || []).reduce((acc, comment) => {
    return acc + 1 + (comment.replies ? comment.replies.length : 0);
  }, 0);

  const getAvatarSrc = (userObj) => {
    if (userObj.image && userObj.image.trim() !== "") return userObj.image;
    const nameStr = userObj.author || userObj.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameStr)}&background=4661E6&color=fff`;
  };

  return (
    <div className="feedback-detail-container">
      <div className="feedback-detail-header">
        <a href="#/" className="go-back-link">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L2 5L6 1" stroke="#4661E6" strokeWidth="2" />
          </svg>
          Go Back
        </a>
        <a href={`#/edit-feedback/${currentFeedback.id}`} className="edit-feedback-btn">
          Edit Feedback
        </a>
      </div>

      <div className="card-info">
        <div className="card-content">
          <div className="card-header">
            {screenSize >= 768 && (
              <span onClick={handleUpvote} className={"detailUpvote" + (isUpvoted ? " active" : "")}>
                <svg width="9" height="7" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6L4 2L8 6" stroke={isUpvoted ? "#fff" : "#4661E6"} strokeWidth="2" fill="none" />
                </svg>
                {currentFeedback.upvotes}
              </span>
            )}
            <div>
              <h4>{currentFeedback.title}</h4>
              <p>{currentFeedback.description}</p>
              <button className="category-tag">{currentFeedback.category}</button>
            </div>
          </div>
          <div className="card-footer">
            {screenSize < 768 && (
              <span onClick={handleUpvote} className={"detailUpvote" + (isUpvoted ? " active" : "")}>
                <svg width="9" height="7" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6L4 2L8 6" stroke={isUpvoted ? "#fff" : "#4661E6"} strokeWidth="2" fill="none" />
                </svg>
                {currentFeedback.upvotes}
              </span>
            )}
            <span className="bg">
              {totalCommentCount} <img src="/images/comment.svg" alt="comments" />
            </span>
          </div>
        </div>
      </div>

      <div className="feedback-comments">
        <h3>{totalCommentCount} Comments</h3>
        {currentFeedback.comments?.map((comment) => (
          <div key={comment.id} className="comment-wrapper">
            <div className="comments-area">
              <div className="comment">
                <div className="comment-header">
                  <img src={getAvatarSrc(comment)} alt="user avatar" />
                  <div>
                    <h4>{comment.author || comment.name}</h4>
                    <span>{comment.username}</span>
                  </div>
                </div>
                <button
                  className="reply-btn"
                  onClick={() => setReplyTargetId(replyTargetId === comment.id ? null : comment.id)}
                >
                  Reply
                </button>
              </div>
              <p className="comment-body">{comment.content}</p>
            </div>

            {replyTargetId === comment.id && (
              <form
                onSubmit={(e) => handleReplySubmit(e, comment.id, comment.username)}
                autoComplete="off"
                className="reply-form"
              >
                <textarea
                  name="userReply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="text-area"
                  placeholder="Type your reply..."
                ></textarea>
                <button type="submit">{screenSize >= 768 ? "Post Reply" : "Send"}</button>
              </form>
            )}

            {comment.replies?.length > 0 && (
              <div className="replies-section">
                {comment.replies.map((replyItem) => (
                  <Fragment key={replyItem.id}>
                    <div className="reply">
                      <div className="comment-header">
                        <div className="reply-header">
                          <img src={getAvatarSrc(replyItem)} alt="reply avatar" />
                          <div>
                            <h4>{replyItem.author || replyItem.name}</h4>
                            <span>{replyItem.username}</span>
                          </div>
                        </div>
                        <button
                          className="reply-btn"
                          onClick={() => setReplyTargetId(replyTargetId === replyItem.id ? null : replyItem.id)}
                        >
                          Reply
                        </button>
                      </div>
                      <p className="reply-body">{replyItem.content}</p>
                    </div>

                    {replyTargetId === replyItem.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, comment.id, replyItem.username)}
                        autoComplete="off"
                        className="reply-form"
                      >
                        <textarea
                          name="userReply"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="text-area"
                          placeholder="Type your reply..."
                        ></textarea>
                        <button type="submit">{screenSize >= 768 ? "Post Reply" : "Send"}</button>
                      </form>
                    )}
                  </Fragment>
                ))}
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>

      <div className="add-comment">
        <h4>Add Comment</h4>
        <form onSubmit={handleCommentSubmit} autoComplete="off">
          <textarea
            name="userComment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here"
            maxLength={250}
          ></textarea>
          <div className="add-comment-footer">
            <span>{250 - newComment.length} Characters left</span>
            <button type="submit">Post Comment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
