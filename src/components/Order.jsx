import React, { useState } from 'react';
import { useGlobalState } from '../state/provider';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { domain, header } from '../env';

const Order = () => {
    const [{ cartuncomplit }, dispatch] = useGlobalState();
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const history = useHistory();

    const order = async () => {
        await axios({
            method: "post",
            url: `${domain}/api/orders/`,
            headers: header,
            data: {
                "cartid": cartuncomplit?.id,
                "address": address,
                "email": email,
                "mobile": phone
            }
        }).then(response => {
            console.log(response.data, "Order Response");
            dispatch({
                type: "PAGE_RELOAD",
                pagereload: response.data
            });
            dispatch({
                type: "ADD_CARTUNCOMPLIT",
                cartuncomplit: null
            });
            history.push("/oldorders");
        }).catch(error => {
            console.error("Order placement failed", error);
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
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
                                cartuncomplit?.cartproduct?.map((item, i) => (
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
                        <tfoot>
                            <tr>
                                <td>
                                    <Link to="/cart" className="btn btn-success">Edit Cart</Link>
                                </td>
                                <td colSpan={4}>Total</td>
                                <td>{cartuncomplit?.total}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="col-md-6">
                    <h1>Order Now</h1>
                    <div>
                        <div className="form-group">
                            <label>Address</label>
                            <input onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder="Address" />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input onChange={(e) => setPhone(e.target.value)} type="text" className="form-control" placeholder="Mobile" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" placeholder="Email" />
                        </div>
                        <button onClick={order} className="btn btn-success my-2">Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
