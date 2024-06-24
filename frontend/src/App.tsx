import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './hooks/AuthContext';
import { Suspense } from 'react';
import Loading from './components/Loading';

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <DndProvider backend={HTML5Backend}>
                  <Home />
                </DndProvider>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </Router>
  );
}

export default App;
