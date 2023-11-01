
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import DataTableContext from './context/DataTableContext';
import SongDetails from './pages/SongDetails';

const App = () => {
  return (
    <>
      <DataTableContext>
        <SideNav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/songdata" element={<SongDetails />} />
          </Routes>
        </div>
      </DataTableContext>

  </>
  );
};

export default App;
