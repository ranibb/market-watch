# Real-Time Data Dashboard (Vue 3 Edition)

A single-page application built to explore and demonstrate a professional-grade front-end architecture using Vue 3, Pinia, and TypeScript. The application fetches real-time market data from the CoinGecko API and displays it in a clean, interactive, and performant user interface.

**Live Demo:** [Link to your Netlify deployment]

---

## Core Architectural Concepts & Features

This project was built as a deep dive into the modern Vue ecosystem and serves as a blueprint for professional front-end development.

- **State Management:** Centralized, type-safe state management using **Pinia**. Includes a robust caching mechanism for detail views to prevent redundant API calls.
- **Component-Based Architecture:** Follows best practices with reusable UI components, view components, and global components for UI state (loading, errors).
- **Clean Architecture:** Decoupled business logic with a dedicated API service layer, separating data fetching from state management concerns.
- **Reactive UI:** Implemented real-time search/filtering using Pinia getters and Vue's reactivity system.
- **Advanced UX:** Features skeleton loaders for improved perceived performance and smooth CSS transitions between routes.
- **Automated Quality Gates:** Integrated with **Husky** and **lint-staged** to automatically lint and format code on every pre-commit hook.
- **Unit Testing:** Core business logic in the Pinia store is unit-tested with **Vitest**, including mocking the API service.

## Technologies Used

- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **State Management:** Pinia
- **Routing:** Vue Router
- **Testing:** Vitest
- **Tooling:** Vite, ESLint, Prettier, Husky
