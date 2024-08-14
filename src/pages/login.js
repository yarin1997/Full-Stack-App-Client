import  axios  from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
  const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();
    const login = () => {
        const data = {username: username, password: password}
        axios.post('http://localhost:3001/auth/login', data)
       .then( ( res ) => {
        if( res.data.error){
          console.log(res.data.error);
           alert(res.data.error);
          }
          else
       {
         localStorage.setItem('accessToken', res.data.token)
          setAuthState({
            username: res.data.username, 
            id: res.data.id,
            status: true
          })
        console.log(res.data+ "success");
         navigate('/');
         }
         setError('')
       })
       .catch( ( err ) => {
           setError(err.message)
             console.log(err + "err")
       })
    }
  return (
    <div>login

    <div>
        <input type='text' placeholder='Userame' onChange={(event)=> setUsername(event.target.value)}/>
        <input type='password' placeholder='Password' onChange={(event)=>setPassword(event.target.value)}/>
        {error && <p>{error}</p>}
        <button onClick={login}>Login</button>
    </div>
    </div>
  )
}

export default Login