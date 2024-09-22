import React from 'react';
import { useGlobalState } from '../state/provider';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { domain, header } from '../env';

const Cart = () => {
    const [{ cartuncomplit }, dispatch] = useGlobalState();
    const history = useHistory();

    const cart_product_length = cartuncomplit?.cartproduct?.length || 0;

    const updateCart = async (id) => {
        try {
            const response = await axios.post(`${domain}/api/updatecart/`, { id }, { headers: header });
            dispatch({ type: "PAGE_RELOAD", pagereload: response.data });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const editCart = async (id) => {
        try {
            const response = await axios.post(`${domain}/api/editcart/`, { id }, { headers: header });
            dispatch({ type: "PAGE_RELOAD", pagereload: response.data });
        } catch (error) {
            console.error("Error editing cart:", error);
        }
    };

    const deleteCartProduct = async (id) => {
        try {
            const response = await axios.post(`${domain}/api/deletecartproduct/`, { id }, { headers: header });
            dispatch({ type: "PAGE_RELOAD", pagereload: response.data });
        } catch (error) {
            console.error("Error deleting cart product:", error);
        }
    };

    const deleteFullCart = async () => {
        try {
            const response = await axios.post(`${domain}/api/deletefullcart/`, { id: cartuncomplit?.id }, { headers: header });
            dispatch({ type: "PAGE_RELOAD", pagereload: response.data });
            dispatch({ type: "ADD_CARTUNCOMPLIT", cartuncomplit: null });
            alert("Your full cart has been deleted!");
            history.push("/");
        } catch (error) {
            console.error("Error deleting full cart:", error);
        }
    };

    return (
        <div className="container p-2">
            {cart_product_length !== 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartuncomplit?.cartproduct.map((data, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{data.product[0].title}</td>
                                <td>{data.price}</td>
                                <td>{data.quantity}</td>
                                <td>{data.subtotal}</td>
                                <td>
                                    <button onClick={() => editCart(data.id)} className="btn btn-info">-</button>
                                    <button onClick={() => deleteCartProduct(data.id)} className="btn btn-danger mx-1">X</button>
                                    <button onClick={() => updateCart(data.id)} className="btn btn-success">+</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="4" className="text-right">Total: </th>
                            <th>{cartuncomplit?.total}</th>
                            <th>
                                <Link to="/order" className="btn btn-success">Order Now</Link>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <div>
                    <h2>There is no cart...</h2>
                </div>
            )}
            <div className="row">
                <div className="col">
                    <Link className="btn btn-info" to="/oldorders">Old orders</Link>
                </div>
                {cart_product_length !== 0 && (
                    <div className="col">
                        <button onClick={deleteFullCart} className="btn btn-danger">Delete Cart</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
