import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { domain } from '../env'
import SingleProduct from './SingleProduct'

const CategoryProducts = () => {
    const [category, setCategory] = useState(null)
    const {id} = useParams()
    useEffect(()=>{
        const getcategoryproduct = async()=>{
            await axios({
                method:"get",
                url: `${domain}/api/categori/${id}/`
            }).then(response=>{
                // console.log(response.data[0]);
                setCategory(response.data[0])
            })
        }
        getcategoryproduct()
    },[])
    return (
        <div className="container">
            <h1>Brand: {category?.title}</h1>
            <h2>Category Products</h2>
            <div className="row">
                {
                    category !== null &&
                    category?.category_products?.map((product,i)=>(
                        <div key={i} className="col-md-3">
                            <SingleProduct item={product}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CategoryProducts