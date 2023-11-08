import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';


const newApiUserDefault = {
  Email: '',
  Name: '',
  UserName: '',
  Password: '',
  UserType: 'external'
};

const columns = [
  {
    field: 'Name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'Email',
    headerName: 'Email',
    width: 250
  },
  {
    field: 'UserName',
    headerName: 'UserName',
    width: 150
  },
  {
    field: 'UserType',
    headerName: 'UserType',
    width: 150
  }
];

const userTypes = ['internal','external']
export default function Users () {
  const [registeredApiUsers, setRegisteredApiUsers] = useState([]);
  const [showRegisterApiUser, setShowRegisterApiUser] = useState(false);
  const [showRegisteredApiUser, setShowRegisteredApiUser] = useState(false);
  const [newApiUser, setNewApiUser] = useState(newApiUserDefault);
  const [createdApiUser, setCreatedApiUser] = useState(newApiUserDefault);

  const getAllRegisteredUsers = async () => {
    const result = await axiosBase({
      method: 'get',
      url: '/getUsers'
    })
      .catch(error => {
        console.log(error);
      });

    const mappedResult = result.data.map(entry => {
      entry.id = entry.Id;
      return entry;
    });

    setRegisteredApiUsers(mappedResult);
  };

  useEffect(() => {
    getAllRegisteredUsers();
  }, []);
  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewApiUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterUser = async () => {
    if (isWhiteSpace(newApiUser.UserName) || isWhiteSpace(newApiUser.Password)) {
      return;
    }
    const result = await axiosBase({
      method: 'post',
      url: '/createUser',
      data: newApiUser
    })
      .catch(error => {
        console.log(error);
      });

    setNewApiUser(newApiUserDefault)
    setCreatedApiUser(result.data);
    setShowRegisteredApiUser(true);
    setShowRegisterApiUser(false);
    await getAllRegisteredUsers();
  };


  return (
    <>
      <div className="w-full mt-4 flex flex-col items-center justify-between">
        <div className="w-full flex flex-col mt-2 flex">
          <h1 className="text-4xl ml-10 font-medium justify-start">
            Dashboard Users
          </h1>
        </div>
        <div className="w-full flex flex-col mt-2 flex">
          <div className="w-[90%] flex mt-10 items-center justify-end">
            <Button
              variant="outlined"
              onClick={() => {
                setShowRegisterApiUser(!showRegisterApiUser);
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
              {`${!showRegisterApiUser ? 'Open Register User' : 'Close Register User'}`}
            </Button>
          </div>
          {showRegisterApiUser && <div className="w-full flex flex-col mt-2 flex">
            <div className="w-full flex flex-row mt-2 flex">
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Name</Typography>
                <TextField
                  sx={{marginTop: 1}}
                  hiddenLabel
                  name="Name"
                  value={newApiUser.Name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </div>
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>UserName</Typography>
                <TextField
                  sx={{marginTop: 1}}
                  hiddenLabel
                  name="UserName"
                  onChange={handleChange}
                  value={newApiUser.UserName}
                  variant="outlined"
                />
              </div>
            </div>
            <div className="w-full flex flex-row mt-10 flex">
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Password</Typography>
                <TextField
                  sx={{marginTop: 1}}
                  hiddenLabel
                  name="Password"
                  value={newApiUser.Password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </div>
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Email</Typography>
                <TextField
                  sx={{marginTop: 1}}
                  hiddenLabel
                  name="Email"
                  onChange={handleChange}
                  value={newApiUser.Email}
                  variant="outlined"
                />
              </div>

            </div>
            <div className="w-full flex flex-row mt-10 flex">
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>UserType</Typography>
                <Select
                  sx={{marginTop: 1}}
                  name="UserType"
                  value={newApiUser.UserType}
                  onChange={handleChange}
                >
                  {userTypes.map((value, index) => (
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="w-[90%] flex mt-10 items-center justify-end">
              <Button
                variant="outlined"
                onClick={handleRegisterUser}
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
                Register New User
              </Button>
            </div>
          </div>}
          {/* POST REGISTRATION DETAILS DISPLAY */}
          {showRegisteredApiUser &&
            <div className="w-full flex flex-col mt-10 flex">
              <div className="w-full flex flex-row mt-2 flex">
                <div className="flex flex-col ml-20 w-[90%]">
                  <Typography sx={{fontWeight: 'bold', fontSize: 30}}>Created User</Typography>
                </div>
              </div>
              <div className="w-full flex flex-row mt-10 flex">

                <div className="flex flex-col ml-20 w-[40%]">
                  <Typography sx={{fontWeight: 'bold'}}>Name</Typography>
                  <Typography sx={{fontWeight: 'bold'}}>{createdApiUser.Name}</Typography>
                </div>
                <div className="flex flex-col ml-20 w-[40%]">
                  <Typography sx={{fontWeight: 'bold'}}>UserName</Typography>
                  <Typography sx={{fontWeight: 'bold'}}>{createdApiUser.UserName}</Typography>
                </div>
              </div>
              <div className="w-full flex flex-row mt-10 flex">
                <div className="flex flex-col ml-20 w-[40%]">
                  <Typography sx={{fontWeight: 'bold'}}>Company</Typography>
                  <Typography sx={{fontWeight: 'bold'}}>{createdApiUser.Company}</Typography>
                </div>
                <div className="flex flex-col ml-20 w-[40%]">
                  <Typography sx={{fontWeight: 'bold'}}>Email</Typography>
                  <Typography sx={{fontWeight: 'bold'}}>{createdApiUser.Email}</Typography>
                </div>
              </div>

              <div className="w-[90%] flex mt-10 items-center justify-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowRegisteredApiUser(false);
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
                  Close Registration Details
                </Button>
              </div>
            </div>}
          <div className="w-full mt-10 mb-10 flex">
            <SimpleDataGrid
              columns={columns}
              rows={registeredApiUsers}
            />
          </div>
        </div>
      </div>
    </>
  );
}
