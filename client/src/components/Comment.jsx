import { useState } from "react";

const Comment = ({ text, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  if (text) {
    return <p>{text}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        placeholder="Add a comment..."
      />
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default Comment;
