import {Button, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';
import {UserContext} from '../context/UserContext.jsx';


const newApiUserDefault = {
  Email: '',
  Name: '',
  AccountType: '',
  AuthKey: '',
  Company: '',
  UserName: '',
  ApiKey: ''
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
    field: 'ApiKey',
    headerName: 'ApiKey',
    width: 350
  },
  {
    field: 'AccountType',
    headerName: 'AccountType',
    width: 150
  },
  {
    field: 'UserName',
    headerName: 'UserName',
    width: 150
  },
  {
    field: 'Company',
    headerName: 'Company',
    width: 150
  },
];
export default function ApiUsers () {
  try {
    const {adminDashToken} = useContext(UserContext);
    const [registeredApiUsers, setRegisteredApiUsers] = useState([]);
    const [showRegisterApiUser, setShowRegisterApiUser] = useState(false);
    const [showRegisteredApiUser, setShowRegisteredApiUser] = useState(false);
    const [newApiUser, setNewApiUser] = useState(newApiUserDefault);
    const [createdApiUser, setCreatedApiUser] = useState(newApiUserDefault);

    const getAllRegisteredUsers = async () => {
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        url: '/getAPiUsers'
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
      if (isWhiteSpace(newApiUser.Name) || isWhiteSpace(newApiUser.Email)) {
        return;
      }
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'post',
        url: '/createAPiUser',
        data: newApiUser
      })
        .catch(error => {
          console.log(error);
        });

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
              Api Users
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
                {`${!showRegisterApiUser ? 'Add Api User' : 'Close Add Api User'}`}
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
                  <Typography sx={{fontWeight: 'bold'}}>Company</Typography>
                  <TextField
                    sx={{marginTop: 1}}
                    hiddenLabel
                    name="Company"
                    value={newApiUser.Company}
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
                  Register Api User
                </Button>
              </div>
            </div>}
            {/* POST REGISTRATION DETAILS DISPLAY */}
            {showRegisteredApiUser && <div className="w-full flex flex-col mt-10 flex">
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
              <div className="w-full flex flex-row mt-10 flex">
                <div className="flex flex-col ml-20 w-[90%]">
                  <Typography sx={{fontWeight: 'bold'}}>ApiKey</Typography>
                  <Typography sx={{fontWeight: 'bold'}}>{createdApiUser.ApiKey}</Typography>
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
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'ApiUsers' Page Component</h1>
    )
  }
}
