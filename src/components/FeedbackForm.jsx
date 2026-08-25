import "../css/feedbackForm.css";
import { Data, Route } from "../context/AppContext";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FeedbackForm({ isEdit = false }) {
  const { data, setData } = useContext(Data);
  const route = useContext(Route);
  const dialogRef = useRef(null);

  const feedbackId = useMemo(() => {
    const parts = route.split("/").filter(Boolean);
    return parts.at(-1);
  }, [route]);

  const editingFeedback = useMemo(() => {
    if (!isEdit || !data?.feedbacks) return null;
    return data.feedbacks.find((f) => f.id === feedbackId);
  }, [isEdit, data?.feedbacks, feedbackId]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(data?.categories?.[0] || "Feature");
  const [status, setStatus] = useState("Planned");

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [emptyMsg, setEmptyMsg] = useState({
    title: false,
    description: false,
  });

  useEffect(() => {
    if (isEdit && editingFeedback) {
      setTitle(editingFeedback.title || "");
      setDescription(editingFeedback.description || "");
      setCategory(editingFeedback.category || "Feature");
      setStatus(editingFeedback.status || "Planned");
    } else if (!isEdit) {
      setTitle("");
      setDescription("");
      setCategory(data?.categories?.[0] || "Feature");
      setStatus("Planned");
    }
    setEmptyMsg({ title: false, description: false });
  }, [isEdit, editingFeedback, data?.categories]);

  if (isEdit && !editingFeedback) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#3A4374" }}>
        <h2>Feedback Not Found</h2>
        <p style={{ margin: "16px 0", color: "#647196" }}>The feedback you are trying to edit does not exist.</p>
        <button
          onClick={() => (location.hash = "/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4661E6",
            color: "#fff",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isTitleEmpty = !title.trim();
    const isDescEmpty = !description.trim();

    if (isTitleEmpty || isDescEmpty) {
      setEmptyMsg({ title: isTitleEmpty, description: isDescEmpty });
      return;
    }

    const id = isEdit ? editingFeedback.id : crypto.randomUUID();

    let updatedFeedbacks;
    if (isEdit) {
      updatedFeedbacks = data.feedbacks.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            title: title.trim(),
            description: description.trim(),
            category,
            status,
          };
        }
        return f;
      });
    } else {
      const newFeedback = {
        id,
        title: title.trim(),
        description: description.trim(),
        category,
        upvotes: 0,
        status: "Planned",
        comments: [],
      };
      updatedFeedbacks = [newFeedback, ...(data.feedbacks || [])];
    }

    setData({
      ...data,
      feedbacks: updatedFeedbacks,
    });

    toast.success(isEdit ? "Feedback updated successfully!" : "Feedback added successfully!");
    location.hash = `/feedback/${id}`;
  };

  const handleDelete = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    const updatedFeedbacks = data.feedbacks.filter((f) => f.id !== editingFeedback.id);

    setData({
      ...data,
      feedbacks: updatedFeedbacks,
    });

    toast.success("Feedback deleted successfully!");
    location.hash = "/";
  };

  const availableStatuses = ["Planned", "InProgress", "Live"];

  return (
    <div className="feedback-form-container">
      <button
        className="go-back-button"
        type="button"
        onClick={() => (location.hash = isEdit && editingFeedback ? `/feedback/${editingFeedback.id}` : "/")}
      >
        <img src="/images/right-arrow.svg" alt="back arrow" />
        Go Back
      </button>

      <form onSubmit={handleSubmit} className="feedback-form">
        <figure>
          <img src={isEdit ? "/images/pen.svg" : "/images/plus.svg"} alt="form icon" />
        </figure>

        <div className="feedback-form-contents">
          <h1>{isEdit ? `Editing ‘${editingFeedback?.title}’` : "Create New Feedback"}</h1>

          <section>
            <div className="feedback-form-input-text">
              <h4>Feedback Title</h4>
              <p>Add a short, descriptive headline</p>
            </div>
            <input
              className={emptyMsg.title ? "invalid" : ""}
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {emptyMsg.title && <p className="empty-msg">Can&apos;t be empty</p>}
          </section>

          <section style={{ position: "relative" }}>
            <div className="feedback-form-input-text">
              <h4>Category</h4>
              <p>Choose a category for your feedback</p>
            </div>
            <button
              type="button"
              className="dropdown-trigger-btn"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {category}
              <img src={`/images/${showCategoryDropdown ? "upper" : "bottom"}-arrow.svg`} alt="arrow" />
            </button>
            {showCategoryDropdown && (
              <div className="form-dropdown">
                {data?.categories?.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                    {category === cat && <img src="/images/dropdown-tick.svg" alt="selected" />}
                  </button>
                ))}
              </div>
            )}
          </section>

          {isEdit && (
            <section style={{ position: "relative" }}>
              <div className="feedback-form-input-text">
                <h4>Update Status</h4>
                <p>Change feature state</p>
              </div>
              <button
                type="button"
                className="dropdown-trigger-btn"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {status}
                <img src={`/images/${showStatusDropdown ? "upper" : "bottom"}-arrow.svg`} alt="arrow" />
              </button>
              {showStatusDropdown && (
                <div className="form-dropdown">
                  {availableStatuses.map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => {
                        setStatus(st);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {st}
                      {status === st && <img src="/images/dropdown-tick.svg" alt="selected" />}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          <section>
            <div className="feedback-form-input-text">
              <h4>Feedback Detail</h4>
              <p>Include any specific comments on what should be improved, added, etc.</p>
            </div>
            <textarea
              className={emptyMsg.description ? "invalid" : ""}
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {emptyMsg.description && <p className="empty-msg">Description cannot be empty</p>}
          </section>

          <div className="feedback-form-btn-group">
            <button className="feedback-form-btn-submit" type="submit">
              {isEdit ? "Save Changes" : "Add Feedback"}
            </button>
            <button
              className="feedback-form-btn-cancel"
              onClick={() => (location.hash = isEdit && editingFeedback ? `/feedback/${editingFeedback.id}` : "/")}
              type="button"
            >
              Cancel
            </button>
            {isEdit && (
              <button
                onClick={() => dialogRef.current?.showModal()}
                className="feedback-form-btn-delete"
                type="button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </form>

      <DeleteDialog dialogRef={dialogRef} handleDelete={handleDelete} />
    </div>
  );
}

function DeleteDialog({ dialogRef, handleDelete }) {
  return (
    <dialog ref={dialogRef} className="delete-dialog">
      <div className="dialog-container">
        <h3>Delete this feedback?</h3>
        <p>Are you sure you want to delete this feedback? This action cannot be undone and you will lose all of its data.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginTop: "24px" }}>
          <button className="delete-dialog-btn" onClick={handleDelete}>
            Confirm & Delete
          </button>
          <button className="cancel-dialog-btn" onClick={() => dialogRef.current?.close()}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
