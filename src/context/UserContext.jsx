import {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {axiosBase, base_url} from '../helpers/requests.js';
import {ColumnHeadersMap} from '../helpers/constants.js';

export const UserContext = createContext(undefined);


const UserProvider = ({children}) => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState('external');


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
      console.log('STM context-UserContext.jsx:32', hasToken); // todo remove dev item

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

    console.log('STM context-UserContext.jsx:30', result?.data); // todo remove dev item
    if(result?.data?.token) {
      window.localStorage.setItem('AdminDashToken', result.data.token)
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

  const addToRecentSongs = (song) => {
    setRecentSongs((prev) => {
      if (prev.length > 7) {
        prev.shift();
      }
      return [...prev, song];
    });
  };


  return (
    <UserContext.Provider value={{
      addToRecentSongs,
      recentSongs,
      loginUser,
      logoutUser,
      loggedIn,
      user,
      userType
    }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserProvider;
