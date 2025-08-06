# Derayah Market Watch: A Blueprint for Modern Front-End Architecture

A professional-grade, single-page application (SPA) built to showcase a robust and scalable front-end architecture using Vue 3, Pinia, TypeScript, and the PrimeVue component library. This project serves as a comprehensive blueprint for building modern, feature-rich, and maintainable web applications.

**Live Demo:** [https://stunning-moonbeam-f11193.netlify.app/](https://stunning-moonbeam-f11193.netlify.app/)

![Derayah Market Watch Demo GIF](./.github/assets/app-demo.gif)

---

## 🏛️ Core Architectural Principles

This project was architected around three core principles that are essential for long-term scalability and maintainability.

### 1. Decoupling & Separation of Concerns

The application maintains a strict separation between its layers:

- **API Service Layer (`/services`):** All external API communication is handled here. The rest of the application is agnostic to the data source.
- **State Management Layer (`/stores`):** Pinia stores act as the single source of truth. They orchestrate business logic but delegate the "how" of data fetching to the service layer.
- **UI Layer (`/views` & `/components`):** Vue components are primarily "dumb," responsible only for displaying state and emitting user events.

### 2. Centralized State Management

Global state is managed exclusively by **Pinia**. This provides a predictable and debuggable state flow. Key patterns implemented include:

- **A `detailsCache`** to prevent redundant API calls for previously visited detail pages.
- **Getters with arguments** (`getAssetById`) for efficient data selection.
- **Modular stores** (`market.ts`, `auth.ts`) to keep concerns separated.

### 3. Automated Quality Gates

Code quality is not optional; it's automated.

- **Pre-commit Hooks:** Using **Husky** and **lint-staged**, the codebase is automatically linted and formatted before any commit can be made.
- **Unit Testing:** The core business logic in the Pinia stores is rigorously unit-tested with **Vitest**, including mocking the API service to ensure reliability in isolation.
- **TypeScript Strict Mode:** The entire project runs in `strict` mode to enforce type safety and prevent common runtime errors.

---

## ✨ Key Features & Implementations

Beyond the architecture, the application includes a rich set of professional-grade features.

### User Experience

- **PrimeVue Component Library:** The entire UI is built with PrimeVue, providing a consistent, professional, and accessible design system.
- **Dark/Light Mode:** A fully implemented, theme-aware dark mode that affects all components and global styles.
- **Skeleton Loaders & Transitions:** Smooth page transitions and skeleton loaders create a fast, fluid, and modern perceived performance.
- **Global Notifications:** A decoupled **Toast** notification system handles all user feedback (errors, successes) in a non-intrusive way.
- **Confirmation Dialogs:** A promise-based confirmation service for sensitive actions like logging out.

### Functionality

- **Full Authentication:** Complete user authentication and session management using **Firebase Authentication**.
- **Protected Routes:** A robust navigation guard in `vue-router` protects authenticated routes from unauthorized access.
- **Enterprise-Grade Data Table:** The main dashboard features a PrimeVue `<DataTable>` with client-side search, sorting, and pagination.
- **Data Visualization:** The detail view includes a client-side chart using `Chart.js` to display historical price data.

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
    - Create a `firebase.ts` file in `src/services/`.
    - Add your Firebase project configuration to this file.
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
