import axios from 'axios';
import React, { useState } from 'react'
import { domain, header2 } from '../env';

const LoginPage = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    const loginrequest = async()=>{
        await axios({
            method:"post",
            url: `${domain}/api/login/`,
            headers:header2,
            data: {
                'username': username,
                'password': password
            }
        }).then(response => {
            console.log(response.data['token']);
            window.localStorage.setItem("token", response.data['token'])
            window.location.href = '/'
        }).catch(_=>{
            alert("Incorrect Username or Password")
        })
    }
    return (
        <div className="container mt-4">
            <h1>LoginPage</h1>
            <div class="form-group">
                <label>Username</label>
                <input onChange={(e)=>setUsername(e.target.value)} type="text" class="form-control" placeholder="Username" />
            </div>
            <div class="form-group">
                <label>Password</label>
                <input onChange={(e)=>setPassword(e.target.value)} type="password" class="form-control" placeholder="Password" />
            </div>
            <button onClick={loginrequest} className='btn btn-success my-3'>Login</button>
        </div>
    )
}

export default LoginPage