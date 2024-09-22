import React, { useState } from 'react'
import { useGlobalState } from '../state/provider'
import { domain, header } from '../env';
import axios from 'axios';

const Profilepage = () => {
    const [{ profile }, disptach] = useGlobalState()
    const [email, setEmail] = useState(profile?.prouser.email)
    const [firstname, setFirstname] = useState(profile?.prouser.first_name)
    const [lastname, setLastname] = useState(profile?.prouser.last_name)
    const [image, setImage] = useState(null)
    
    const userdataupdate = async()=>{
        await axios({
            method: "post",
            url: `${domain}/api/userdataupdate/`,
            headers:header,
            data:{
                "first_name": firstname,
                "last_name": lastname,
                "email": email
            }
        }).then(response => {
            console.log(response.data);
            disptach({
                type: "PAGE_RELOAD",
                pagereload: response.data
            })
        })
    }
    const updateprofileimage=async()=>{
        const fromdata = new FormData()
        fromdata.append("image", image)

        await axios({
            method: "post",
            url: `${domain}/api/profileimageupdate/`,
            headers:header,
            data:fromdata
        }).then(response => {
            console.log(response.data);
            disptach({
                type: "PAGE_RELOAD",
                pagereload: response.data
            })
        })
    }
    return (
        <div className="container">
            <div className="row">
                <div className="media">
                    <img src={`${domain}${profile?.image}`} className=" account-img" />
                    <div className="media-body">
                        <h2>{profile?.prouser?.username}</h2>
                        <p>{profile?.prouser?.email}</p>
                        <p>{profile?.prouser?.first_name} {profile?.prouser?.last_name}</p>
                    </div>
                </div>
                <div className="">
                <div class="form-group">
                        <label>Profile Image</label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" class="form-control"  />
                        <button onClick={updateprofileimage} className="btn btn-info my-3">Upload</button>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" class="form-control" value={email} />
                    </div>
                    <div class="form-group">
                        <label>First Name</label>
                        <input onChange={(e) => setFirstname(e.target.value)} type="text" class="form-control"  value={firstname}/>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input onChange={(e) => setLastname(e.target.value)} type="text" class="form-control" value={lastname} />
                    </div>
                    <button onClick={userdataupdate} className="btn btn-success my-3">Update</button>
                </div>
            </div>
        </div>
    )
}

export default Profilepage