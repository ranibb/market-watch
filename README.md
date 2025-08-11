# Derayah Market Watch: A Blueprint for Modern Front-End Architecture

A professional-grade, **micro-frontend shell application** built to showcase a robust and scalable architecture using Vue 3, Pinia, TypeScript, and PrimeVue. This project serves as a comprehensive blueprint for building modern, feature-rich, and maintainable web applications using an enterprise-grade, multi-repository setup.

**Live Demo:** [https://stunning-moonbeam-f11193.netlify.app/](https://stunning-moonbeam-f11193.netlify.app/)

![Derayah Market Watch Demo GIF](./.github/assets/app-demo.gif)

---

## 🏛️ Core Architectural Principles

This project was architected around a **Micro-Frontend** model, demonstrating how to build a complex application by composing independently developed and deployed features.

### 1. The Micro-Frontend Shell

This application acts as the **Host** or **Shell**. It is responsible for:

- **Rendering the main application layout**, including the primary navigation and toolbar.
- **Providing core, cross-cutting services** like authentication, session management, and global UI state (loading, notifications).
- **Orchestrating the routing** between its own pages and the dynamically loaded remote micro-frontends.

### 2. The Remote Micro-Frontend

A separate, independently deployed application, the [Remote Portfolio](https://github.com/ranibb/remote-portfolio), provides the "Portfolio" feature.

- This remote app is **dynamically loaded** into the Shell at runtime using **Module Federation**.
- This pattern simulates a multi-team environment where different teams can own, develop, and deploy their features autonomously.

### 3. Centralized & Scalable State Management

Global state is managed exclusively by **Pinia**. This provides a predictable and debuggable state flow. Key patterns include:

- **Server-Side Operations State:** The store manages the complete state for server-side pagination and search.
- **Advanced Paginated Caching:** A multi-key cache (`Map`) stores previously fetched pages, keyed by a composite of the search query, page number, and page size, to eliminate redundant API calls.
- **Persistent UI State:** The store "remembers" the user's pagination state, returning them to their exact previous position when navigating.

### 4. Automated Quality Gates & Resilience

Code quality and application resilience are built-in and automated.

- **Pre-commit Hooks:** Using **Husky** and **lint-staged**, the codebase is automatically linted and formatted before any commit can be made.
- **Unit Testing:** The core business logic in the Pinia stores is rigorously unit-tested with **Vitest**.
- **Resilient State Management:** The store uses a **transactional state rollback** mechanism. If an API call fails, the UI state is automatically reverted to its last valid state, preventing de-synchronization.
- **Specific Error Handling:** The application uses custom error types and intelligent `catch` blocks to provide clear, user-friendly feedback for different failure scenarios (e.g., rate limiting).

---

## ✨ Key Features & Implementations

### Functionality

- **Full Authentication:** Complete user authentication and session management using **Firebase Authentication**.
- **Protected Routes:** A robust navigation guard in `vue-router` protects authenticated routes.
- **Enterprise-Grade DataTable:** A PrimeVue `<DataTable>` with lazy-loaded, server-side pagination and debounced server-side search.
- **Data Visualization:** Client-side charting with `Chart.js` to display historical price data.
- **Dynamic Micro-Frontend Loading:** The Portfolio page demonstrates dynamically loading and rendering a component from a separate, live-deployed application.

### User Experience

- **PrimeVue Component Library:** The entire UI is built with a consistent, professional, and accessible design system.
- **Dark/Light Mode:** A fully implemented, theme-aware dark mode that affects all components and global styles.
- **Global UI State Components:** Centralized, non-intrusive components for `Toast` notifications, `Confirmation Dialogs`, and `Loading Indicators`.

---

## 🚀 Local Development (Micro-Frontend Workflow)

This project is designed to be run in parallel with its remote dependencies.

### 1. Run the Remote App (`remote-portfolio`)

In a separate terminal, the remote must be **built** and then **served** on port 5001.

```bash
# In the remote-portfolio directory
npm run build
npm run preview -- --port 5001
```

### 2. Run the Shell App (This Project)

In another terminal, run the Shell in development mode. It is configured to consume the remote running on port 5001.

```bash
npm run dev
```

## 📦 Deployment

This application is deployed using a **multi-repository, separate deployment** strategy on Netlify, which is a professional, production-grade pattern.

- The **Shell** is deployed to its primary URL.
- The **Remote** is deployed to a separate, independent URL.
- The Remote's Netlify site is configured with a `_headers` file to set the correct `Access-Control-Allow-Origin` (CORS) header, allowing the Shell to securely fetch its assets.

---

## 🛠️ Technologies Used

- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **Component Library:** PrimeVue
- **State Management:** Pinia
- **Routing:** Vue Router
- **Testing:** Vitest
- **Authentication:** Firebase
- **Tooling:** Vite, ESLint, Prettier, Husky, lint-staged
