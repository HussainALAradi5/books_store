import { useState } from "react";

const Comment = ({
  id,
  text,
  onAddComment,
  onEditComment,
  onRemoveComment,
}) => {
  const [commentText, setCommentText] = useState(text || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (commentText.trim()) {
      if (isEditing && id) {
        onEditComment(id, commentText);
      } else {
        onAddComment(commentText);
      }
      setCommentText("");
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleRemove = () => {
    if (id) {
      onRemoveComment(id);
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Edit your comment..."
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>{text}</p>
          {onEditComment && !id && <button onClick={handleEdit}>Edit</button>}
          {onRemoveComment && !id && (
            <button onClick={handleRemove}>Remove</button>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
