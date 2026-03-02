import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import Manifesto from './pages/Manifesto';
import Privacy from './pages/Privacy';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/manifesto" element={<Manifesto />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/legal" element={<Privacy />} />
    </Routes>
  );
}

export default App;