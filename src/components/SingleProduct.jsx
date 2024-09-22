import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import {domain,header} from '../env'
import { useGlobalState } from '../state/provider'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const SingleProduct = ({item}) => {
    const [{ profile }, dispatch] = useGlobalState()
    const history = useHistory()

    const addtocart=async(id)=>{
        profile !== null? (
        await axios({
            method: "post",
            url: `${domain}/api/addtocart/`,
            data:{"id":id},
            headers:header
        }).then(response=>{
            console.log(response.data, "$$$$ ADD to Cart $$$$");
            dispatch({
                type: "PAGE_RELOAD",
                pagereload: response.data
            })
        })
        ):
        (
            history.push("/login")
        )
    }
    return (
        <div class="card single_product" >
            <Link to={`/product/${item.id}`}>
                <img class="card-img-top" src={item.image} alt="Card image cap"/>
            </Link>
            
            <div class="card-body">
                <h5 class="card-title">{item.title}</h5>
                <p class="card-text">{(item.description).substring(0,100)}...<Link to={`/product/${item.id}`}>more</Link></p>
                <button onClick={() => addtocart(item.id)} class="btn btn-primary">Add to Card</button>
            </div>
            <div className="card-footer">
                <h5>Price: <del>{item.marcket_price}$</del> {item.selling_price}$</h5>
            </div>
        </div>
    )
}

export default SingleProduct