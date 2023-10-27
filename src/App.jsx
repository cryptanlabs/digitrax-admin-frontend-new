
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import DataTableContext from './context/DataTableContext';

const App = () => {
  return (
    <>
      <DataTableContext>
        <SideNav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </DataTableContext>

  </>
  );
};

export default App;
