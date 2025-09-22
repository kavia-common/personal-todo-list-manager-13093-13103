# Todo Frontend (React) — Ocean Professional

A minimalist, modern React UI for the Personal Todo List Manager. Connects to a FastAPI backend and supports full CRUD: add, edit, delete, and mark completed. Styled with the Ocean Professional palette.

## Features

- Ocean Professional theme with clean, minimalist design
- Full CRUD with loading/error states
- Smooth transitions, subtle shadows, rounded corners
- Search and filter (All/Active/Completed)
- Structured components and a slim API layer

## Getting Started

- Install: `npm install`
- Start dev server: `npm start` (http://localhost:3000)
- Ensure backend is running at http://localhost:3001

Optional: configure backend URL via env:
- Copy `.env.example` to `.env` and set:
  - `REACT_APP_API_BASE_URL=http://localhost:3001`

## Project Structure

- `src/services/api.js` — API client for FastAPI backend
- `src/components/TodoForm.js` — add/edit form
- `src/components/TodoItem.js` — single item view
- `src/components/TodoList.js` — list wrapper
- `src/styles/theme.css` — Ocean Professional styles
- `src/App.js` — application shell and state

## Notes

- The backend OpenAPI is used as reference for routes and shapes.
- The app handles optimistic UI for toggling completion.
- Errors are displayed non-intrusively above the list.
