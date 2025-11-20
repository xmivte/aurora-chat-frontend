import { Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Playground from './pages/Playground';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </>
  );
}

export default App;
