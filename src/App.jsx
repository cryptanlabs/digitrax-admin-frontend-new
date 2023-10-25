
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
    <SideNav />
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  </>
  );
};

export default App;