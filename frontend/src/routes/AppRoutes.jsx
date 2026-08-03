import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===========================
   Public Pages
=========================== */

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import StudentModules from "../pages/StudentModules/StudentModules";
import StudentLessons from "../pages/StudentLessons/StudentLessons";
import StudentExpressions from "../pages/StudentExpressions/StudentExpressions";
import Settings from "../pages/Settings/Settings";

/* ===========================
   Admin Pages
=========================== */

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Modules from "../pages/Modules/Modules";
import Lessons from "../pages/Lessons/Lessons";
import Expressions from "../pages/Expressions/Expressions";

/* ===========================
   Protected Route
=========================== */

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===========================
            PUBLIC WEBSITE
        ============================ */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/modules"
          element={<StudentModules />}
        />

        <Route
          path="/modules/:moduleId/lessons"
          element={<StudentLessons />}
        />

        <Route
          path="/lessons/:lessonId/expressions"
          element={<StudentExpressions />}
        />

        {/* ===========================
            ADMIN LOGIN
        ============================ */}

        <Route
          path="/admin"
          element={<Login />}
        />

        {/* ===========================
            PROTECTED ADMIN ROUTES
        ============================ */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

        <Route
          path="/admin/modules"
          element={
            <ProtectedRoute>
              <Modules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/modules/:moduleId/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/expressions"
          element={
            <ProtectedRoute>
              <Expressions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lessons/:lessonId/expressions"
          element={
            <ProtectedRoute>
              <Expressions />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}