import {createContext, useEffect, useState} from 'react';
import {axiosBase} from '../helpers/requests.js';

export const UserContext = createContext(undefined);


const UserProvider = ({children}) => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState('external');
  const [adminDashToken, setAdminDashToken] = useState();

  const logInByToken = () => {
    window.localStorage.getItem('AdminDashToken')
  }

  useEffect(() => {
    loginUser()
  }, []);



  const loginUser = async (userName, password) => {
    let logInData = {}

    if(userName && password){
      logInData = {UserName: userName, Password: password}
    } else {
      const hasToken = window.localStorage.getItem('AdminDashToken')

      if(hasToken){
        logInData = {token: hasToken}
      }
    }
    const result = await axiosBase({
      method: 'post',
      url: '/loginUser',
      data: logInData
    })
      .catch(error => {
        console.log(error);
      });


    if(result?.data?.token) {
      // priorRecentSongs
      window.localStorage.setItem('AdminDashToken', result.data.token)
      setAdminDashToken(result.data.token)
      setLoggedIn(true)
      delete result?.data?.token
      setUser(result?.data)
      setUserType(result?.data?.UserType)
      return true
    }

    if(result?.data){
      setLoggedIn(true)
      setUser(result?.data)
      setUserType(result?.data?.UserType)
      return true
    }
   return false
  }

  const logoutUser = () => {
    setUser({})
    setUserType({})
    setLoggedIn(false)
  }



  return (
    <UserContext.Provider value={{
      recentSongs,
      loginUser,
      logoutUser,
      loggedIn,
      user,
      userType,
      adminDashToken
    }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider;
