import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout, Loader, NotFound } from "./layout";

const AnnouncementsPage = React.lazy(
  () => import("@modules/announcements/pages/AnnouncementsPage"),
);
const AnnouncementFormPage = React.lazy(
  () => import("@modules/announcements/pages/AnnouncementFormPage"),
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // layout route
    children: [
      { path: "/", element: <Navigate to="/announcements" replace /> },
      {
        path: "/announcements",
        element: (
          <React.Suspense fallback={<Loader />}>
            <AnnouncementsPage />
          </React.Suspense>
        ),
      },
      { path: "/announcements/:id", element: <Navigate to="../:id/edit" replace /> },
      {
        path: "/announcements/new",
        element: (
          <React.Suspense fallback={<Loader />}>
            <AnnouncementFormPage />
          </React.Suspense>
        ),
      },
      {
        path: "/announcements/:id/edit",
        element: (
          <React.Suspense fallback={<Loader />}>
            <AnnouncementFormPage />
          </React.Suspense>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
