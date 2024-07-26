import { useState } from "react";

const Comment = ({
  id,
  text,
  canEdit,
  onEditComment,
  onRemoveComment,
  onAddComment,
  currentUserId,
  commentUserId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState(text || "");
  const [newCommentText, setNewCommentText] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
    setCommentText(text);
  };

  const handleSaveClick = () => {
    onEditComment(id, commentText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setCommentText(text);
  };

  const handleRemoveClick = () => {
    onRemoveComment(id);
  };

  const handleAddComment = () => {
    onAddComment(newCommentText);
    setNewCommentText("");
  };

  const isOwner = currentUserId === commentUserId;

  return (
    <div className="comment">
      {isEditing ? (
        <>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <>
          <p>{text}</p>
          {canEdit && isOwner && (
            <>
              <button onClick={handleEditClick}>Edit</button>
              <button onClick={handleRemoveClick}>Remove</button>
            </>
          )}
        </>
      )}
      {onAddComment && (
        <div>
          <textarea
            value={newCommentText}
            onChange={(event) => setNewCommentText(event.target.value)}
            placeholder="Leave a comment"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      )}
    </div>
  );
};

export default Comment;
