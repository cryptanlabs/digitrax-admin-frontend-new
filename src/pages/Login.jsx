import {Button, TextField, Typography, InputAdornment, IconButton, Input,OutlinedInput } from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';
import {UserContext} from '../context/UserContext.jsx';
import {useNavigate} from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login () {
  try {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {loginUser} = useContext(UserContext);
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleLoginUser = async () => {
      if (isWhiteSpace(userName) || isWhiteSpace(password)) {
        return;
      }
console.log('STM pages-Login.jsx:22', userName, password); // todo remove dev item
      const loginResult = await loginUser(userName, password);
      if (loginResult) {
        navigate('/dashboard');
      }

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
              <Typography sx={{fontWeight: 'bold'}}>Username</Typography>
              <TextField
                sx={{marginTop: 1}}
                hiddenLabel
                name="Name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                variant="outlined"
              />
            </div>
            <div className="flex flex-col mt-5 w-[40%]">
              <Typography sx={{fontWeight: 'bold'}}>Password</Typography>
              <OutlinedInput
                sx={{marginTop: 1}}
                type={showPassword ? 'text' : 'password'}
                hiddenLabel
                name="Name"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                variant="outlined"
                endAdornment={
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    // edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
              />
            </div>
            <div className="w-[90%] flex mt-10 items-center justify-center">
              <Button
                variant="outlined"
                onClick={() => {
                  handleLoginUser();
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
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'Login' Page Component</h1>
    )
  }
}
