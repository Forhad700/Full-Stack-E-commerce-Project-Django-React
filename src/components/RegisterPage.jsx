import axios from 'axios'
import React, { useState } from 'react'
import { domain, header2 } from '../env'
import { useHistory } from 'react-router-dom'

const RegisterPage = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmpassword, setConfirmpassword] = useState(null)
    const history = useHistory()

    const registernewuser = async()=>{
        if(password !== confirmpassword){
            alert("Password Not Matched")
        }
        else{
            await axios({
                method: "post",
                url: `${domain}/api/register/`,
                headers:header2,
                data:{
                    "username": username,
                    "password": password
                }
            }).then(response=>{
                //console.log(response.data['message']);
                alert(response.data['message'])
                history.push("/login")
            })
        }
    }
    return (
        <div className="container">
            <h1>Register</h1>
                <div class="form-group">
                    <label>Username</label>
                    <input onChange={(e)=>setUsername(e.target.value)} type="text" class="form-control"  placeholder="Username"/>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" class="form-control"  placeholder="Password"/>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input onChange={(e)=>setConfirmpassword(e.target.value)} type="password" class="form-control"  placeholder="Confirm Password"/>
                </div>
                <button onClick={registernewuser} className="btn btn-success my-2">Register</button>
        </div>
    )
}

export default RegisterPage