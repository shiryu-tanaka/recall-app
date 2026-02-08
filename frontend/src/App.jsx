import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Questions from './pages/Questions';
import QuestionForm from './pages/QuestionForm';
import TaskDetail from './pages/TaskDetail';
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/new" element={<QuestionForm />} />
        <Route path="/questions/edit/:id" element={<QuestionForm />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
