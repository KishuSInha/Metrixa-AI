import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import Manifesto from './pages/Manifesto';
import Legal from './pages/Legal';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/manifesto" element={<Manifesto />} />
      <Route path="/legal" element={<Legal />} />
    </Routes>
  );
}

export default App;