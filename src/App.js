import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/login';
import Registration from './pages/Registration';
import {AuthContext} from './helpers/AuthContext'
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import { ChangePassword } from './pages/ChangePassword';
function App() {
const [ authState, setAuthState]= useState(
  {
   username: "",
   id: 0,
   status:false
  });
useEffect(() => {
 axios.get('http://localhost:3001/auth/auth', { headers: {
  accessToken : localStorage.getItem('accessToken')
 }})
   .then(( res) =>{
    if(res.data.error)
      setAuthState({...authState, status:false})
    else
    setAuthState({
      username : res.data.username,
      id: res.data.id,
      status: true
    })
   })
},[])
const logout = () => {
  localStorage.removeItem('accessToken');
  setAuthState({
     username:""
     ,id:0, 
     status: false
     })
}
  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
   <Router>
     <div className='navbar1'>
        
          {!authState.status ? (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/registration">Register</Link>
            </div>
          ) : (
            <>
             <Link to="/createpost"> Create A Post</Link>
             <Link to="/"> Home Page</Link>
             <button onClick={logout}>LogOut</button>
            </>
          )}
          <h1> {authState.username}</h1>
      </div>
    <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/post/:id' element={<Post />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/changepassword' element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
        
    </Routes>
   </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
