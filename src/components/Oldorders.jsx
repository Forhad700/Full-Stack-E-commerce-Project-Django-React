import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { domain, header } from '../env';
import { Link } from 'react-router-dom';

const Oldorders = () => {
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const getorders = async () => {
            await axios({
                method: "get",
                url: `${domain}/api/orders/`,
                headers: header
            }).then(response => {
                console.log(response.data, "### Old Orders");
                setOrders(response.data);
            }).catch(error => {
                console.error("Failed to fetch orders", error);
            });
        };
        getorders();
    }, [reload]);

    const deleteorderhistory = async (id) => {
        await axios({
            method: "delete",
            url: `${domain}/api/orders/${id}/`,
            headers: header
        }).then(response => {
            console.log(response.data);
            setReload(prev => !prev);
        }).catch(error => {
            console.error("Failed to delete order", error);
        });
    };

    return (
        <div className='container'>
            <h1>Order History</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Total</th>
                        <th>Product</th>
                        <th>Order Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.length > 0 ?
                            orders.map((order, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>$. {order.total}</td>
                                    <td>{order.cartproduct.length}</td>
                                    <td>{order.order_status}</td>
                                    <td>
                                        <Link to={`/orderdetails/${order.id}`} className="btn btn-info">Details</Link>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteorderhistory(order.id)} className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan={6}>No Old Order</td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Oldorders;
