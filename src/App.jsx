import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import DataTableContext from './context/DataTableContext';
import SongDetails from './pages/SongDetails';
import SongDetailsProvider from './context/SongDetailsContext.jsx';
import CreateSong from './pages/CreateSong';
import CrossDashboard from './pages/CrossDashboard.jsx';
import Reports from './pages/Reports.jsx';
import QueryBuilder from './pages/QueryBuilder.jsx';
import UserProvider from './context/UserContext.jsx';
import AccessGuard from './components/AccessGuard.jsx';
import InternalOnly from './pages/InternalOnly.jsx';
import UsersDashBoard from './pages/UsersDashboad.jsx';


const App = () => {
  return (
    <>
      <UserProvider>
        {/*<AccessGuard>*/}
          <DataTableContext>
            <SideNav/>
            <SongDetailsProvider>
              <div className="main-content">

                <Routes>
                  <Route element={<AccessGuard/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/songdata" element={<SongDetails/>}/>
                    <Route element={<InternalOnly/>}>
                      <Route path="/crossDashboard" element={<CrossDashboard/>}/>
                      <Route path="/createsong" element={<CreateSong/>}/>
                      <Route path="/reports" element={<Reports/>}/>
                      <Route path="/queryBuilder" element={<QueryBuilder/>}/>
                      <Route path="/users" element={<UsersDashBoard/>}/>
                    </Route>
                  </Route>
                </Routes>
              </div>
            </SongDetailsProvider>

          </DataTableContext>
        {/*</AccessGuard>*/}

      </UserProvider>


    </>
  );
};

export default App;
