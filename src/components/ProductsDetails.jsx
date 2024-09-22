import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { domain, header } from '../env';
import SingleProduct from './SingleProduct'
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../state/provider';

const ProductsDetails = () => {
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [categoryproducts, setCategoryproducts] = useState(null)
    const [{ profile }, dispatch] = useGlobalState()
        const history = useHistory()
  
    useEffect(()=>{
        const getdata = async()=>{
            await axios({
                method:"get",
                url: `${domain}/api/product/${id}/`
            }).then(response=>{
                console.log(response.data);
                setProduct(response.data)
                getcategory(response.data?.category['id'])
            })
        }
        getdata()
    },[id])
    
        const getcategory = async(id) => {
            await axios({
                method: 'get',
                url: `${domain}/api/categori/${id}/`
            }).then(response=>{
                console.log(response.data);
                setCategoryproducts(response.data)
            })
        }
        

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
        <div className="container">
            {
                product !== null &&
                (
                    <div className="row">
                        <img src={product?.image}/>
                        <div className="col-md-7">
                            <h1>{product?.title}</h1>
                            <h2>Price : <del> {product?.marcket_price}</del> {product?.selling_price}</h2>
                        </div>
                        <div className="col-md-4">
                            <button onClick={() => addtocart(product?.id)} className="btn btn-info">Add to Cart</button>
                        </div>
                        <p>{product?.description}</p>
                    </div>
                )
            }
            <div className="row">
                <h1>Related Products</h1>
                {
                    categoryproducts !==null &&
                    categoryproducts[0]?.category_products?.map((product,i)=>(
                        <div className="col-md-3" key={i}>
                            <SingleProduct item={product} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductsDetails