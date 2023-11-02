
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import DataTableContext from './context/DataTableContext';
import SongDetails from './pages/SongDetails';
import SongDetailsProvider from './context/SongDetailsContext.jsx';

const App = () => {
  return (
    <>
      <DataTableContext>
        <SideNav />
        <SongDetailsProvider>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/songdata" element={<SongDetails />} />
            </Routes>
          </div>
        </SongDetailsProvider>

      </DataTableContext>

  </>
  );
};

export default App;
