import {Outlet, Navigate} from 'react-router-dom';
import {useContext} from 'react';
import {UserContext} from '../context/UserContext.jsx';


export default function InternalOnly(){
  const {loggedIn, userType} = useContext(UserContext);

  if(userType === 'external'){
    return <Navigate to="/" />
  }
  return (
    <Outlet />
  )
}
