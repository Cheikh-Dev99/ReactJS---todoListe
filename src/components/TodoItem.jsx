import PropTypes from "prop-types";
import { useState } from "react";
import Button from "../ui/Button.jsx";

const TodoItem = ({
  task,
  onComplete,
  onDelete,
  onArchive,
  onEdit,
  isArchived,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editedText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className="flex items-center justify-between w-full p-1 my-1 border rounded">
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit(e)}
          className="flex-1 px-2 py-1 mr-2 border rounded"
        />
      ) : (
        <span
          className={`flex-1 ${
            task.completed ? "line-through bg-green-100/50" : ""
          }`}
        >
          {task.text}
        </span>
      )}

      <div className="flex gap-2">
        {!isArchived && (
          <>
            <Button variant="info" onClick={handleEdit}>
              {isEditing ? (
                <>
                  {/* Ajouter modifications */}
                  <i className="fas fa-pen-to-square" />
                </>
              ) : (
                <>
                  {/* Modifier */}
                  <i className="fas fa-pen-to-square" />
                </>
              )}
            </Button>
            <Button variant="success" onClick={() => onComplete(task.id)}>
              {task.completed ? "" : ""}
              <i className="fas fa-check" />
            </Button>
            <Button variant="danger" onClick={() => onDelete(task.id)}>
              {/* Supprimer */}
              <i className="fas fa-trash" />
            </Button>
          </>
        )}
        <Button variant="primary" onClick={() => onArchive(task.id)}>
          {isArchived ? "" : ""}
          <i className="fas fa-box-archive" />
        </Button>
      </div>
    </li>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
};

TodoItem.defaultProps = {
  isArchived: false,
};

export default TodoItem;
