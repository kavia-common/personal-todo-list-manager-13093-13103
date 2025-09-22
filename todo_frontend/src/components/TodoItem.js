import React from 'react';

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  /** Render a single todo item line with actions */
  const created = new Date(todo.created_at);
  const updated = new Date(todo.updated_at);
  const isStale = updated.getTime() - created.getTime() > 1000;

  return (
    <div className="todo-item fade-in" role="listitem" aria-label={`Todo: ${todo.title}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={todo.is_completed}
        onChange={() => onToggleComplete(todo)}
        aria-label={`Mark ${todo.title} as ${todo.is_completed ? 'incomplete' : 'complete'}`}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="todo-title" style={{ textDecoration: todo.is_completed ? 'line-through' : 'none', color: todo.is_completed ? 'rgba(17,24,39,0.55)' : 'inherit' }}>
          {todo.title}
        </div>
        {todo.description && (
          <div className="todo-desc">
            {todo.description}
          </div>
        )}
        <div className="todo-meta" style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge" title={`Created ${created.toLocaleString()}`}>
            <span>Created</span>
            <span className="kbd">{created.toLocaleDateString()}</span>
          </span>
          <span className="badge" title={`Updated ${updated.toLocaleString()}`}>
            <span>Updated</span>
            <span className="kbd">{updated.toLocaleDateString()}</span>
          </span>
          {todo.is_completed && (
            <span className="badge" style={{ background: 'rgba(37,99,235,0.06)', borderColor: 'rgba(37,99,235,0.25)', color: '#2563EB' }}>
              Completed
            </span>
          )}
          {isStale && (
            <span className="badge" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', color: '#92400e' }}>
              Edited
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline" onClick={() => onEdit(todo)} aria-label={`Edit ${todo.title}`}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(todo)} aria-label={`Delete ${todo.title}`}>
          Delete
        </button>
      </div>
    </div>
  );
}
