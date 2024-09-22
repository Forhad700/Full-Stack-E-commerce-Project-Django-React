import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { domain, header } from '../env';

const OrderDetails = () => {
    const { id } = useParams();
    const [orderdetails, setOrderdetails] = useState(null);

    useEffect(() => {
        const getOrderdetails = async () => {
            await axios({
                method: "get",
                url: `${domain}/api/orders/${id}/`,
                headers: header
            }).then(response => {
                console.log(response.data["data"][0]);
                setOrderdetails(response.data["data"][0]);
            }).catch(error => {
                console.error("Failed to fetch order details", error);
            });
        };
        getOrderdetails();
    }, [id]);

    const product = orderdetails?.cartproduct;

    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Discount</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {orderdetails !== null &&
                            <>
                                <td>{orderdetails.date}</td>
                                <td>{orderdetails.total}</td>
                                <td>{orderdetails.email}</td>
                                <td>{orderdetails.mobile}</td>
                                <td>{orderdetails.discount} %</td>
                                <td>{orderdetails.cartproduct.length}</td>
                            </>
                        }
                    </tr>
                </tbody>
            </table>
            <h1>Product Details</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        product?.map((item, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item.product[0].title}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.subtotal}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetails;
