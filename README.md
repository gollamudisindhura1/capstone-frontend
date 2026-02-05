# Pro-Tasker Frontend

## Overview

Frontend for **Pro-Tasker** — a full-stack task management app built with MERN stack.  
- Secure user registration & login (JWT authentication)  
- Create, view, update, delete projects & tasks  
- Interactive Day/Week/Month planner with drag-and-drop support  
- Priority coloring, status badges, time blocks, dark/light mode  

**Live Demo (Frontend):** https://pro-tasker-capstone-frontend.onrender.com  
**Live API (Backend):** https://pro-tasker-capstone-backend.onrender.com  

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62C" alt="Vite">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
</p>

## Features

- Responsive design (mobile + desktop friendly)
- Dark / Light mode toggle (persisted in localStorage)
- Protected routes (only logged-in users can access dashboard/projects)
- Project list + detail view
- Full **CRUD** for tasks: create/read/update/delete
- Drag-and-drop calendar (Day, Week, Month views) using react-big-calendar
- Priority-based coloring (Low/Medium/High) + status badges (To Do/In Progress/Done)
- Time blocks with start/end times
- User-specific data persistence (MongoDB backend)

## Tech Stack

- **Frontend**: React 18 + Vite + React Router v6 + React Big Calendar + date-fns + Bootstrap 5
- **Styling**: Custom CSS variables + glassmorphism + neon gradients
- **Deployment**: Render (Static Site for frontend, Web Service for backend)
- **Icons**: Bootstrap Icons
- **Theme**: Custom dark/light mode with localStorage persistence

## Screenshots
![alt text](<Screenshot 2026-02-04 at 2.13.54 PM.png>)
![alt text](<Screenshot 2026-02-04 at 2.14.04 PM.png>)
![alt text](<Screenshot 2026-02-04 at 2.12.03 PM.png>)
![alt text](<Screenshot 2026-02-04 at 2.11.56 PM.png>)


## Resources & References

- React: https://react.dev/
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- React Big Calendar: https://jquense.github.io/react-big-calendar
- date-fns: https://date-fns.org
- Bootstrap 5: https://getbootstrap.com
- Icons: Bootstrap Icons
- Dark/Light Theme: CSS variables + localStorage persistence

## Frontend Setup (Local Development)

1. Navigate to the frontend folder:
   ```bash
   cd client

2. Install dependencies:
- npm install

3. Create .env.local in the frontend root:
- VITE_BACKEND_URL=http://localhost:3000

4. Run the development server:
- npm run dev

## Deployment

1. Frontend: Deployed as Static Site on Render

- Live URL: https://pro-tasker-capstone-frontend.onrender.com

2. Backend: Deployed as Web Service on Render

- Live API: https://pro-tasker-capstone-backend.onrender.com

3. Environment Variable (Render Frontend)

- VITE_BACKEND_URL = https://pro-tasker-capstone-backend.onrender.com

## Challenges & Learnings

- Deployment on Render (free tier sleep, CORS setup, env variables)
- Full CRUD with nested routes (projects → tasks)
- React Big Calendar integration + custom time blocks
- Dark/light mode persistence + glassmorphism styling
- JWT authentication + protected routes

## Future Plans 

- Real-time collaboration
- Email reminders for due tasks
- Task comments / attachments
- Mobile app (React Native)
- Analytics dashboard (task completion stats)