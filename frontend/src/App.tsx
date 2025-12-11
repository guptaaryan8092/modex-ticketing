import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShowsProvider } from './contexts/ShowsContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ShowsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/booking/:id" element={<Booking />} />
            </Routes>
          </Layout>
        </ShowsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
