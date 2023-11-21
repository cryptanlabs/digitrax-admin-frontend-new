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
      <div className="w-full flex flex-col">

          <div className="w-[90%] flex flex-col mt-5 items-center justify-center">
              <Typography sx={{fontWeight: 'bold', fontSize: '40px'}}>User Management</Typography>
          </div>
        <div className="w-[90%] flex flex-col items-center justify-center">
            <ApiUsers/>
            <Users/>
        </div>
      </div>
    </>
  );
}
