# Pro-Tasker Frontend

## Overview

Frontend for Pro-Tasker this is a full-stack task management app.  
- Users can register/login
- Manage projects 
- Create/edit tasks with due dates/times/priorities/statuses.
- View tasks in an interactive Day/Week/Month planner.

Live Demo:
Backend API:

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62C" alt="Vite">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  
</p>

## Features

- Responsive design (desktop + mobile)
- Dark / Light mode toggle (saved in localStorage)
- User authentication (protected routes)
- Project list + detail view
- Task CRUD (create/read/update/delete) with drag-and-drop calendar support
- Priority coloring, status badges, time blocks
- Calendar views: Day, Week, Month with dynamic titles

## Tech Stack

- React 18 + Vite
- React Router v6
- React Big Calendar + drag-and-drop addon
- date-fns
- Bootstrap 5
- Custom CSS variables for theming

## Screenshots

<p align="center">
  <img src="frontend/public/screenshots/Screenshot 2026-02-04 at 2.13.54 PM.png" alt="Dashboard Light Mode" width="45%">
  <img src="frontend/public/screenshots/Screenshot 2026-02-04 at 2.14.04 PM.png" alt="Day Planner Dark Mode" width="45%">
  <img src="frontend/public/screenshots/Screenshot 2026-02-04 at 2.12.03 PM.png" alt="Mobile View" width="30%">
  <img src="frontend/public/screenshots/Screenshot 2026-02-04 at 2.11.56 PM.png" alt="Mobile View" width="30%">
</p>

## Resources & References

- React: https://react.dev/
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- React Big Calendar: https://jquense.github.io/react-big-calendar
- date-fns: https://date-fns.org
- Bootstrap 5: https://getbootstrap.com
- Icons: Bootstrap Icons
- Dark/Light Theme: CSS variables + localStorage persistence

## Dependencies (main ones from package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "react-big-calendar": "^1.15.0",
    "react-big-calendar/lib/addons/dragAndDrop": "^1.15.0",
    "date-fns": "^3.6.0",
    "bootstrap": "^5.3.3"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
