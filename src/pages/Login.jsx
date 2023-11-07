import {Button, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';

export default function Login () {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');



  const handleRegisterUser = async () => {
    if (isWhiteSpace(userName) || isWhiteSpace(password)) {
      return;
    }
    // const result = await axiosBase({
    //   method: 'post',
    //   url: '/createUser',
    //   data: newApiUser
    // })
    //   .catch(error => {
    //     console.log(error);
    //   });

  };


  return (
    <>
      <div className="w-full mt-4 flex flex-col items-center justify-between">
        <div className="w-full flex flex-col mt-2 flex">
          <h1 className="text-4xl ml-10 font-medium justify-start">

          </h1>
        </div>
        <div className="w-full flex flex-col mt-40 items-center">
          <div className="flex flex-col w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>UserName</Typography>
            <TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="Name"
              value={userName}
              onChange={(e) => {setUserName(e.target.value)}}
              variant="outlined"
            />
          </div>
          <div className="flex flex-col mt-5 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Password</Typography>
            <TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="Name"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
              variant="outlined"
            />
          </div>
          <div className="w-[90%] flex mt-10 items-center justify-center">
            <Button
              variant="outlined"
              onClick={() => {
              }}
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
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
