import React from 'react';
import TodoItem from './TodoItem';

// PUBLIC_INTERFACE
export default function TodoList({ items, onToggleComplete, onEdit, onDelete }) {
  /** Render list of todos or empty state */
  if (!items?.length) {
    return (
      <div className="empty fade-in">
        No todos yet. Add your first task using the form below.
      </div>
    );
  }

  return (
    <div className="list" role="list" aria-live="polite">
      {items.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
