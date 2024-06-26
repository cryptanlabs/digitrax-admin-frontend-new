import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BungalowIcon from "@mui/icons-material/Bungalow";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {Link, useNavigate} from 'react-router-dom';
import {Button, Box, Typography} from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import {useContext} from 'react';
import {DataTableData} from '../context/DataTableContext.jsx';
import {UserContext} from '../context/UserContext.jsx';
import { saveAs } from 'file-saver';
const drawerWidth = 240;

const internalNav = ["Dashboard", "CrossClear Dashboard", "Create Song", "Files To Buckets", "Query Builder", "Users", "Status Dashboard", "Batch Update", "Lookup Song Details", "Batch Upload", "Usage"]
const externalNav = ["Home", "Dashboard"]

export default function SideNav() {
  const navigate = useNavigate();
  const { recentSongs, backgroundStatus } = useContext(DataTableData);
  const {userType, logoutUser, loggedIn} = useContext(UserContext);


  const navigateToRecentSong = (song) => {
    navigate(`/songdata/${song}`, { state: { SongNumber: song } });
  }

  const downloadConsoleLogs = () => {
    let blob = new Blob([JSON.stringify(console.logs)], {type: 'text/plain'})
    saveAs(blob, `console_logs.txt`)
    // let url = URL.createObjectURL(blob)
  }


  if (loggedIn) {
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid lightgrey",
            display: 'flex',
            justifyContent: 'space-between'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Toolbar
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
            <img src="/digitrax.png" alt="Digitrax" width="500" height="600"/>
            {backgroundStatus && <Typography sx={{color: '#a45d31'}}>Processing</Typography>}
          </Toolbar>
          <List>
            {(userType === 'internal' ? internalNav : externalNav).map((text, index) => (
              <ListItem key={text} sx={{paddingBottom: '0px', paddingTop: '0px'}}>
                <Link
                  to={(() => {
                    switch (index) {
                      // case 0:
                      //   return "/";
                      case 0:
                        return "/dashboard";
                      case 1:
                        return "/crossDashboard";
                      case 2:
                        return "/createsong";
                      case 3:
                        return "/filesToBuckets";
                      case 4:
                        return "/queryBuilder";
                      case 5:
                        return "/users";
                      case 6:
                        return "/statusDashboard";
                      case 7:
                        return "/batchUpload";
                      case 8:
                        return "/viewSongDetails";
                      case 9:
                        return "/batchMedia"
                      case 10:
                        return "/usage"
                      default:
                        return "/";
                    }
                  })()}
                  style={{textDecoration: "none", color: "inherit"}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {(() => {
                        switch (index) {
                          case 0:
                            return <BungalowIcon/>;
                          case 1:
                            return <BarChartIcon/>;
                          case 2:
                            return <BarChartIcon/>;
                          case 3:
                            return <CheckBoxIcon/>;
                          case 4:
                            return <CheckBoxIcon/>;
                          case 5:
                            return <CheckBoxIcon/>;
                          case 6:
                            return <AccountCircleIcon/>;
                          case 7:
                            return <BarChartIcon/>;
                          case 8:
                            return <BarChartIcon/>;
                          case 9:
                            return <BarChartIcon/>;
                          case 10:
                            return <BarChartIcon/>;
                          // case 4:
                          //   return <AccountCircleIcon />;

                          default:
                            return null;
                        }
                      })()}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                  </ListItemButton>
                </Link>

              </ListItem>
            ))}
            <ListItem
              onClick={logoutUser}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary="Logout"/>
              </ListItemButton>
            </ListItem>
          </List>

        </Box>
        <Box
          sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '40px'}}>
          <Typography sx={{fontWeight: "bold", paddingLeft: '30px'}}>
            Recent Songs
          </Typography>
          <List>
            {recentSongs.map((song, idx) => (
              <ListItem key={idx}
                        sx={{width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginBottom: '0',
                          paddingBottom: '0px',
                          paddingTop: '0px'}}
                        onClick={() => {
                          navigateToRecentSong(song)
                        }}
              >
                <ListItemButton
                  sx={{paddingBottom: '0px', paddingTop: '0px'}}
                >
                  <ListItemText primary={`C${song}`}/>
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>
              <ListItemButton onClick={downloadConsoleLogs}>
                Export Browser Logs
              </ListItemButton>
            </ListItem>
          </List>
        </Box>


      </Drawer>
    );
  }
}
