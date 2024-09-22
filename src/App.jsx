import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import Navbar from './components/Navbar'
import ProductsDetails from './components/ProductsDetails'
import CategoryProducts from './components/CategoryProducts'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Profilepage from './components/Profilepage'
import axios from 'axios'
import { domain, header, usertoken } from './env'
import { useGlobalState } from './state/provider'
import Cart from './components/Cart'
import Oldorders from './components/Oldorders'
import Order from './components/Order'
import OrderDetails from './components/OrderDetails'


const App = () => {
  const [{ profile, pagereload, cartuncomplit, cartcomplit }, dispatch] = useGlobalState()
  console.log(cartcomplit, "#### cartcomplit ####");
  console.log(cartuncomplit, "#### cartuncomplit ####");
  useEffect(() => {
    if(usertoken !== null){
      const getdata = async()=>{
        await axios({
          method: "get",
          url: `${domain}/api/profile/`,
          headers: header
        }).then(response=>{
          dispatch({
            type: "ADD_PROFILE",
            profile: response.data["data"]
          })
        })
      }
      getdata()
    }
  },[pagereload])
  useEffect(()=>{
    const getcart=async()=>{
      await axios({
        method: "get",
        url: `${domain}/api/cart/`,
        headers:header
      }).then(response=>{
        console.log(response.data, "Cart ...This is cart");
        {
          const all_data = []
          response?.data.map(data=>{
            if(data.complit){
              all_data.push(data)
              dispatch({
                type:"ADD_CARTCOMPLIT",
                cartcomplit:all_data
              })
            }
            else{
              dispatch({
                type:"ADD_CARTUNCOMPLIT",
                cartuncomplit:data
              })
            }
          })
        }
      })
    }
    getcart()
  },[pagereload])
  return (
    <BrowserRouter>
    <Navbar/>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/product/:id" component={ProductsDetails} />
        <Route exact path="/category/:id" component={CategoryProducts} />
        {
          profile !== null ? (
            <>
              <Route exact path="/profile" component={Profilepage} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/oldorders" component={Oldorders} />
              <Route exact path="/order" component={Order} />
              <Route exact path="/orderdetails/:id" component={OrderDetails} />
            </>
          ) :
          (
            <>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/register" component={RegisterPage} />
            </>
          )
        }
        <Route exact component={HomePage} />
      </Switch>
    </BrowserRouter>
  )
}

export default App