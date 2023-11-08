import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';
import ApiUsers from './ApiUsers.jsx';
import Users from './Users.jsx';

export default function UsersDashBoard () {
  const [registeredApiUsers, setRegisteredApiUsers] = useState([]);
  const [showApiUsers, setShowApiUsers] = useState(true);


  const showOtherTypeOfUser = () => {
    setShowApiUsers(!showApiUsers)
  }

  return (
    <>
      <div className="w-full flex ">
        <div className="w-[90%] flex flex-row mt-10 items-center justify-center">
          <Button
            variant="outlined"
            onClick={showOtherTypeOfUser}
            sx={{
              marginRight: '100px',
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Show Dashboard Users
          </Button>
          <Button
            variant="outlined"
            onClick={showOtherTypeOfUser}
            sx={{
              marginRight: '15px',
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Show Api Users
          </Button>
        </div>
      </div>
      {showApiUsers && <ApiUsers/>}
      {!showApiUsers && <Users/>}
    </>
  );
}
