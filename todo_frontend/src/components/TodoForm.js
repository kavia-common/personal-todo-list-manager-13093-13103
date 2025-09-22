import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function TodoForm({ initial, onSubmit, onCancel, submitting }) {
  /** TodoForm handles creation and editing of todos.
   *  Props:
   *   - initial: { title, description, is_completed } optional default values
   *   - onSubmit: function(payload) -> void
   *   - onCancel: function() -> void
   *   - submitting: boolean to indicate submit in-flight
   */
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [isCompleted, setIsCompleted] = useState(initial?.is_completed || false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setIsCompleted(initial?.is_completed || false);
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      is_completed: Boolean(isCompleted),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      <div className="row wrap" style={{ marginBottom: 10 }}>
        <div className="col">
          <label className="helper" htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            placeholder="e.g., Buy groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!error}
          />
        </div>
      </div>
      <div className="row wrap" style={{ marginBottom: 10 }}>
        <div className="col">
          <label className="helper" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="textarea"
            placeholder="Optional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="row" style={{ marginBottom: 12, alignItems: 'center' }}>
        <label className="helper" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            className="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Mark as completed
        </label>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : (initial ? 'Update Todo' : 'Add Todo')}
        </button>
      </div>
    </form>
  );
}
