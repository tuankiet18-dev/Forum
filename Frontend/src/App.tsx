import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateProblemPage from './pages/CreateProblem';
import ProfilePage from './pages/Profile';
import ProblemDetailPage from './pages/ProblemDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/problems/create" element={<CreateProblemPage />} />
        <Route path="/problems/:id" element={<ProblemDetailPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;