import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VesselLanding from './VesselLanding';
import LocalUsage from './LocalUsage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VesselLanding />} />
        <Route path="/local-usage" element={<LocalUsage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
