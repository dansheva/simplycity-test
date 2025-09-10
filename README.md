# Simplicity Test App

This is a small React + Vite application built as a coding test.  
It demonstrates an **admin panel** for managing announcements using:

- React Router v7 – routing & layout
- React Query – data fetching & caching
- React Hook Form – forms & validation
- React Select – multi-select for categories
- React DatePicker – date & time input
- TanStack Table – table rendering
- Mantine – UI components & layout
- @tabler/icons-react – icons
- LocalStorage – mock backend with persistence

## ✨ Features

- Sidebar layout with Mantine `AppShell`
- Announcements list with sorting by **Last update**
- Create / Edit announcement form
  - All fields are **mandatory**
  - Validation errors show as **toasts**
- Categories are stored in LocalStorage and selected with React Select
- 404 page for not found announcements or invalid routes
- Errors follow a shared `IApiError` shape (`{ code: number; message: string }`)

## 🚀 Getting Started

Install dependencies:

```bash
yarn
```

Run local dev server:

```bash
yarn dev
```

App will be available at:

```
http://localhost:5173
```

Build for production:

```bash
yarn build
```

Preview production build:

```bash
yarn preview
```

## 📂 Project Structure

```
src/
  app/              # layout, router, shared components
  modules/
    announcements/  # announcements module (pages, api, storage, types)
```

---

💡 Data is persisted in **localStorage**. Sorting is done manually by `updatedAt` field.
