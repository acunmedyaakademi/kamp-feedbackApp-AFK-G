import FeedbackDetail from "./components/FeedbackDetail";
import FeedbackForm from "./components/FeedbackForm";
import Roadmap from "./components/Roadmap";
import Suggestions from "./components/Suggestions";

export function getPage(url) {
  const pathSegments = url.split("?")[0].split("/").filter(Boolean);
  const rootPath = pathSegments.length > 0 ? "/" + pathSegments[0] : "/";

  switch (rootPath) {
    case "/":
      return <Suggestions />;
    case "/feedback":
      return <FeedbackDetail />;
    case "/roadmap":
      return <Roadmap />;
    case "/new-feedback":
      return <FeedbackForm isEdit={false} />;
    case "/edit-feedback":
      return <FeedbackForm isEdit={true} />;
    default:
      return (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#3A4374" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>404 - Page Not Found</h1>
          <p style={{ marginBottom: "24px", color: "#647196" }}>The page you are looking for does not exist.</p>
          <a
            href="#/"
            style={{
              padding: "12px 24px",
              backgroundColor: "#AD1FEA",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Go Back Home
          </a>
        </div>
      );
  }
}
