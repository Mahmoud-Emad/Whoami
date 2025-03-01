# Whoami

A customized portfolio website built with Vue 3 and TypeScript, featuring a full-stack implementation with an Express backend server.

## Features

- 🎨 **Multiple Themes** - Support for multiple themes with dark mode by default
- 🔍 **Search Functionality** - Built-in search engine for projects, articles, posts, and guestbooks
- 📱 **Responsive Design** - Built with Vuetify for a mobile-first approach
- 👨‍💼 **Admin Dashboard** - Secure admin interface with fingerprint authentication
- 📝 **Guestbook** - Interactive guestbook for visitors
- 📚 **Blog System** - Integrated blogging capabilities
- 🎯 **Project Showcase** - Dedicated section for highlighting projects
- 📰 **Articles Section** - Share your thoughts and experiences
- 🔐 **Secure Backend** - Express.js backend with security features

## Tech Stack

### Frontend
- Vue 3
- TypeScript
- Vuetify
- Vue Router
- Pinia (State Management)
- VueUse

### Backend
- Express.js
- Node.js
- File-based storage (JSON)

### Default Admin Signature

in your first-time run, the default admin signature is `admin`.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file based on the example configuration
4. Start the development server:
```bash
# Start frontend
yarn dev

# Start backend (in a separate terminal)
node backend/server.cjs
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build

## Project Structure

```
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Vue components
│   │   ├── forms/       # Form components
│   │   └── home/        # Home page sections
│   ├── layouts/         # Layout components
│   ├── plugins/         # Vue plugins (Vuetify)
│   ├── router/          # Vue Router configuration
│   ├── store/           # Pinia store
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── views/           # Page components
├── backend/
│   ├── server.cjs       # Express server
│   ├── config.json      # Server configuration
│   └── db.json         # File-based database
└── public/              # Public static files
```

## Configuration

The application can be configured through `backend/config.json`:

- GitHub integration
- Admin dashboard settings
- Theme configuration
- Search functionality
- Server settings

## Development

The project uses:
- Vite for fast development and building
- ESLint and Prettier for code formatting
- TypeScript for type safety
- Vue 3 Composition API
