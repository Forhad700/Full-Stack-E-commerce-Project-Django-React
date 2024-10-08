import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../state/provider'

const Navbar = () => {
    const [{ profile, cartuncomplit }, dispatch] = useGlobalState()
    let cart_product_length = 0
    if(cartuncomplit !== null){
        cart_product_length = cartuncomplit?.cartproduct?.length
    }
    else{
        cart_product_length = 0
    }
    const logout = ()=>{
        window.localStorage.clear()
        dispatch({
            type:"ADD_PROFILE",
            profile:null
        })
        window.location.href = '/'
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Mobile Shop</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {
                        profile !== null ?
                            (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cart">Cart({cart_product_length})</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/profile">Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link onClick={logout} className="nav-link" to="">Logout</Link>
                                    </li>
                                </>
                            )
                            :
                            (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            )
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar