import {useContext} from 'react';
import {UserContext} from '../context/UserContext.jsx';
import Login from '../pages/Login.jsx';
import Home from '../pages/Home.jsx';
import {Outlet} from 'react-router-dom';


export default function AccessGuard () {

  const {loggedIn} = useContext(UserContext);

  if(loggedIn){
    return (
      <Outlet />
    )
  }

  return (
    <Login/>
  )

}
