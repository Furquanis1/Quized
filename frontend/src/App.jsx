import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import MyAttempts from './pages/MyAttempts';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import QuizForm from './pages/admin/QuizForm';
import ManageQuestions from './pages/admin/ManageQuestions';
import QuestionForm from './pages/admin/QuestionForm';
import ViewAttempts from './pages/admin/ViewAttempts';
import Leaderboard from './pages/Leaderboard';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private (authenticated user) routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/quizzes" element={<PrivateRoute />}>
            <Route index element={<QuizList />} />
          </Route>
          <Route path="/quiz/:id" element={<PrivateRoute />}>
            <Route index element={<TakeQuiz />} />
          </Route>
          <Route path="/result/:attemptId" element={<PrivateRoute />}>
            <Route index element={<QuizResult />} />
          </Route>
          <Route path="/my-attempts" element={<PrivateRoute />}>
            <Route index element={<MyAttempts />} />
          </Route>
          <Route path="/leaderboard" element={<PrivateRoute />}>
            <Route index element={<Leaderboard />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="/admin/quizzes" element={<AdminRoute />}>
            <Route index element={<ManageQuizzes />} />
          </Route>
          <Route path="/admin/quizzes/new" element={<AdminRoute />}>
            <Route index element={<QuizForm />} />
          </Route>
          <Route path="/admin/quizzes/:id/edit" element={<AdminRoute />}>
            <Route index element={<QuizForm />} />
          </Route>
          <Route path="/admin/quizzes/:id/questions" element={<AdminRoute />}>
            <Route index element={<ManageQuestions />} />
          </Route>
          <Route path="/admin/questions/:id/edit" element={<AdminRoute />}>
            <Route index element={<QuestionForm />} />
          </Route>
          <Route path="/admin/quizzes/:quizId/questions/new" element={<AdminRoute />}>
            <Route index element={<QuestionForm />} />
          </Route>
          <Route path="/admin/attempts" element={<AdminRoute />}>
            <Route index element={<ViewAttempts />} />
          </Route>
          <Route path="/admin/leaderboard" element={<AdminRoute />}>
            <Route index element={<Leaderboard />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
