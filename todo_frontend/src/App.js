import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Todo Manager app
   * Features:
   *  - Load todos from FastAPI backend (localhost:3001)
   *  - Add, edit, delete, toggle completion
   *  - Loading and error states
   *  - Ocean Professional styling
   */
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // currently edited todo or null
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    fetchTodos()
      .then((items) => {
        if (!isMounted) return;
        setTodos(items);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message || 'Failed to load todos.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let items = todos;
    if (filter === 'active') items = items.filter((t) => !t.is_completed);
    if (filter === 'completed') items = items.filter((t) => t.is_completed);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [todos, filter, query]);

  // Actions
  const handleCreate = async (payload) => {
    setBusy(true);
    setError('');
    try {
      const created = await createTodo(payload);
      // Prepend new item for immediate visibility
      setTodos((prev) => [created, ...prev]);
    } catch (e) {
      setError(e.message || 'Failed to create todo.');
    } finally {
      setBusy(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!editing) return;
    setBusy(true);
    setError('');
    try {
      const updated = await updateTodo(editing.id, payload);
      setTodos((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
      setEditing(null);
    } catch (e) {
      setError(e.message || 'Failed to update todo.');
    } finally {
      setBusy(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    // Optimistic update
    const optimistic = todos.map((t) =>
      t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
    );
    setTodos(optimistic);
    setError('');
    try {
      await updateTodo(todo.id, { is_completed: !todo.is_completed });
    } catch (e) {
      // revert on error
      setTodos(todos);
      setError(e.message || 'Failed to toggle completion.');
    }
  };

  const handleDelete = async (todo) => {
    const previous = todos;
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setError('');
    try {
      await deleteTodo(todo.id);
      if (editing?.id === todo.id) setEditing(null);
    } catch (e) {
      // revert on error
      setTodos(previous);
      setError(e.message || 'Failed to delete todo.');
    }
  };

  const activeCount = useMemo(() => todos.filter(t => !t.is_completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter(t => t.is_completed).length, [todos]);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <div className="header-badge" aria-hidden>✓</div>
          <div>
            <div className="title">Todo List Manager</div>
            <div className="helper">FastAPI + React • Ocean Professional</div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="card elevated fade-in" style={{ overflow: 'hidden' }}>
          <div className="card-body">
            <div className="row wrap" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div className="col" style={{ flex: 2 }}>
                <input
                  className="input"
                  placeholder="Search todos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search todos"
                />
              </div>
              <div className="row" role="tablist" aria-label="Filter todos">
                <button
                  className={`btn ${filter === 'all' ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setFilter('all')}
                  role="tab"
                  aria-selected={filter === 'all'}
                >
                  All
                </button>
                <button
                  className={`btn ${filter === 'active' ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setFilter('active')}
                  role="tab"
                  aria-selected={filter === 'active'}
                >
                  Active
                </button>
                <button
                  className={`btn ${filter === 'completed' ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setFilter('completed')}
                  role="tab"
                  aria-selected={filter === 'completed'}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="hr" />

            {loading && <div className="loading">Loading todos…</div>}
            {!loading && error && <div className="error" role="alert">{error}</div>}

            {!loading && !error && (
              <>
                <div className="row" style={{ gap: 8, marginBottom: 12 }}>
                  <span className="badge">Total <span className="kbd">{todos.length}</span></span>
                  <span className="badge">Active <span className="kbd">{activeCount}</span></span>
                  <span className="badge">Completed <span className="kbd">{completedCount}</span></span>
                </div>
                <TodoList
                  items={filtered}
                  onToggleComplete={handleToggleComplete}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              </>
            )}
          </div>

          <div className="card-footer">
            <div className="row wrap" style={{ alignItems: 'flex-start' }}>
              <div className="col" style={{ flex: 1 }}>
                <div className="helper" style={{ marginBottom: 8, fontWeight: 600 }}>
                  {editing ? 'Edit todo' : 'Add a new todo'}
                </div>
                <TodoForm
                  key={editing?.id || 'create'}
                  initial={editing || null}
                  onSubmit={editing ? handleEditSubmit : handleCreate}
                  onCancel={editing ? () => setEditing(null) : undefined}
                  submitting={busy}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>Tip: Use clear titles. Add details for context.</div>
          <div className="helper">API: http://localhost:3001</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
