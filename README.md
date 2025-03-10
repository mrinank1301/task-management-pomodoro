# Task Management with Pomodoro Timer

A comprehensive productivity-focused task management application that combines the Pomodoro technique with advanced task tracking and collaborative features.

## Features

✨ **Core Features**
- Task creation and management with priority levels
- Pomodoro timer with work/break sessions
- Visual progress tracking
- Browser notifications for timer events
- Task categorization and notes
- Task completion tracking

🎯 **Advanced Features**
- Dynamic task filtering and search
- Priority-based task organization
- Category-based task grouping
- Task statistics and progress tracking
- Custom timer duration support
- Notes and comments for tasks

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form, Zod
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/mrinank1301/task-management-pomodoro.git
cd task-management-pomodoro
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage Guide

### Task Management
- Create new tasks with title, description, and priority
- Add categories to organize tasks
- Set custom timer duration for specific tasks
- Add notes to tasks for additional context
- Mark tasks as complete when finished

### Pomodoro Timer
- Start a 25-minute work session (customizable)
- Automatic switch to 5-minute break sessions
- Visual progress indicator
- Browser notifications when sessions end
- Pause and reset timer as needed

### Task Organization
- Filter tasks by priority (high, medium, low)
- Search tasks by title or description
- Filter by categories
- Separate views for active and completed tasks
- Task statistics dashboard

## Development

To start the development server:

```bash
npm run dev
```

For production build:

```bash
npm run build
npm start
```

## License

MIT
