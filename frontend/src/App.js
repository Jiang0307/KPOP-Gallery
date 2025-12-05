import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StarsList } from './pages/StarsList';
import { StarGallery } from './pages/StarGallery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StarsList />} />
        <Route path="/stars/:starId" element={<StarGallery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


