# Derayah Market Watch: A Blueprint for Modern Front-End Architecture

A professional-grade, single-page application (SPA) built to showcase a robust and scalable front-end architecture using Vue 3, Pinia, TypeScript, and the PrimeVue component library. This project serves as a comprehensive blueprint for building modern, feature-rich, and maintainable web applications.

**Live Demo:** [https://stunning-moonbeam-f11193.netlify.app/](https://stunning-moonbeam-f11193.netlify.app/)

![Derayah Market Watch Demo GIF](./.github/assets/app-demo.gif)

---

## 🏛️ Core Architectural Principles

This project was architected around four core principles that are essential for long-term scalability and maintainability.

### 1. Decoupling & Separation of Concerns

The application maintains a strict separation between its layers:

- **API Service Layer (`/services`):** All external API communication is handled here. The rest of the application is agnostic to the data source. This layer has been enhanced to support server-side pagination and search.
- **State Management Layer (`/stores`):** Pinia stores act as the single source of truth. They orchestrate business logic but delegate the "how" of data fetching to the service layer.
- **UI Layer (`/views` & `/components`):** Vue components are primarily "dumb," responsible for displaying state and emitting user events. The PrimeVue `<DataTable>` is configured in `lazy` mode to delegate all data operations to the store.

### 2. Centralized & Scalable State Management

Global state is managed exclusively by **Pinia**. This provides a predictable and debuggable state flow. Key patterns implemented include:

- **Server-Side Operations State:** The store now manages the complete state for server-side operations, including pagination (`totalRecords`, `currentPage`) and search (`searchQuery`).
- **Advanced Paginated Caching:** A multi-key cache (`Map`) stores previously fetched pages of data. The cache key is a composite of the search query, page number, and page size (e.g., `"bitcoin-1-10"`), ensuring data is only fetched once.
- **Intelligent Cache Invalidation:** The cache is automatically cleared when a new search is performed, guaranteeing that users always see fresh, relevant results.
- **Persistent UI State:** The store "remembers" the user's pagination state, returning them to their exact previous position when navigating back to the dashboard.

### 3. Automated Quality Gates

Code quality is not optional; it's automated.

- **Pre-commit Hooks:** Using **Husky** and **lint-staged**, the codebase is automatically linted and formatted before any commit can be made.
- **Unit Testing:** The core business logic in the Pinia stores is rigorously unit-tested with **Vitest**, including mocking the API service.
- **TypeScript Strict Mode:** The entire project runs in `strict` mode to enforce type safety and prevent common runtime errors.

### 4. Resilient & User-Centric Error Handling

The application is designed to handle failures gracefully.

- **Specific Error Handling:** The application uses custom error types (`RateLimitError`) and intelligent `catch` blocks to distinguish between different API errors (e.g., rate limiting vs. generic failures) and browser-level CORS issues.
- **Transactional State Updates:** For critical actions like pagination, the store implements a **state rollback** mechanism. If an API call fails, the application state is automatically reverted to its last valid state, preventing UI de-synchronization.
- **User-Friendly Feedback:** All errors are presented to the user via a non-intrusive global Toast notification system, providing clear and actionable feedback.

---

## ✨ Key Features & Implementations

Beyond the architecture, the application includes a rich set of professional-grade features.

### User Experience

- **PrimeVue Component Library:** The entire UI is built with PrimeVue, providing a consistent, professional, and accessible design system.
- **Dark/Light Mode:** A fully implemented, theme-aware dark mode that affects all components and global styles.
- **Debounced Input:** User input on the search bar is debounced to prevent excessive API calls and provide a smoother experience.
- **Global Notifications:** A decoupled **Toast** notification system handles all user feedback.

### Functionality

- **Full Authentication:** Complete user authentication and session management using **Firebase Authentication**.
- **Protected Routes:** A robust navigation guard in `vue-router` protects authenticated routes.
- **Enterprise-Grade DataTable:** The main dashboard features a PrimeVue `<DataTable>` with **lazy-loaded, server-side pagination and debounced server-side search**. This ensures the application is highly performant, even with millions of potential records.
- **Data Visualization:** The detail view includes a client-side chart using `Chart.js` to display historical price data, fetched on-demand.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.x or later)
- npm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [Your GitHub Repo URL]
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd derayah-market-watch
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Firebase:**
    - Create a `.env.local` file in the project root.
    - Add your Firebase project configuration variables to this file (see `.env.example`).
5.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles and minifies the application for production.
- `npm run lint`: Lints and fixes files.
- `npm run test:unit`: Runs the unit tests with Vitest.

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
