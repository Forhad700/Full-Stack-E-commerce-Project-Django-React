import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {domain} from "../env"
import SingleProduct from './SingleProduct'
import { Link } from 'react-router-dom';

const HomePage = () => {
    const[products, setProducts] = useState(null)
    const[category, setCategory] = useState(null)
    useEffect(()=>{
        const getdata=async()=>{
            await axios({
                method:"get",
                url: `${domain}/api/product/`
            }).then(response => {
                console.log(response.data);
                setProducts(response.data);
            })
        }
        getdata()
    },[])

    useEffect(()=>{
        const getcategoris=async()=>{
            await axios({
                method:"get",
                url: `${domain}/api/categori/`
            }).then(response=>{
                console.log(response.data);
                setCategory(response.data)
            })
        }
        getcategoris()
    },[])

    const nextProducts = async()=>{
        await axios({
            method:"get",
            url: products?.next
        }).then(response=>{
            console.log(response.data);
            setProducts(response.data);
        })
    }
    const previousproducts = async()=>{
        await axios({
            method:"get",
            url: products?.previous
        }).then(response=>{
            console.log(response.data);
            setProducts(response.data);
        })
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9">
                    <div className="row">
                        {
                            products !== null &&
                            products?.results.map((item, i) => (
                                <div key={i} className="col-md-4 my-2">
                                    <SingleProduct item={item} />
                                </div>
                            ))
                        }
                        <div className="homepage__pagination">
                            <div>
                                {
                                    products?.previous !==null ? (
                                        <button onClick={previousproducts} className="btn btn-danger">Previous</button>
                                    ):(
                                        <button className="btn btn-danger" disabled>Previous</button>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    products?.next !==null ?(
                                        <button onClick={nextProducts} className="btn btn-success">Next</button>
                                    ):(
                                        <button className="btn btn-success" disabled>Next</button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <h1>All Brands</h1>
                    {
                        category !== null &&
                        category?.map((category, i)=>(
                            <div className="my-2" key={i}>
                                <Link to={`/category/${category?.id}`} className="btn btn-success">{category?.title}</Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage
