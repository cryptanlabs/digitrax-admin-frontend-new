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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const drawerWidth = 240;
export default function SideNav() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid black",
          display: 'flex',
          justifyContent: 'space-between'
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box>
      <Toolbar>
        <img src="/digitrax.png" alt="Digitrax" width="500" height="600" />
      </Toolbar>
      <List>
        {["Home", "Dashboard", "Tasks", "Users"].map((text, index) => (
          <ListItem key={text}>
            <Link
              to={(() => {
                switch (index) {
                  case 0:
                    return "/";
                  case 1:
                    return "/dashboard";
                  // case 2: return "/path3";
                  // case 3: return "/path4";
                  default:
                    return "/";
                }
              })()}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  {(() => {
                    switch (index) {
                      case 0:
                        return <BungalowIcon />;
                      case 1:
                        return <BarChartIcon />;
                      case 2:
                        return <CheckBoxIcon />;
                      case 3:
                        return <AccountCircleIcon />;
                      default:
                        return null;
                    }
                  })()}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      </Box>
      <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Button
            startIcon={<SettingsSuggestIcon />}
            sx={{
              borderColor: "gray",
              padding: 1.5,
              marginRight: 2,
              color: "#454545",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Settings
          </Button>
          </Box>
    </Drawer>
  );
}
