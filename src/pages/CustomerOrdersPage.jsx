import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { formatDate, formatPrice } from '/src/helper_function/ConvertFunction.jsx';
import axios from 'axios';
import styles from '/src/css/CustomerOrdersPage.module.css';
import OrderDetails from '../components/OrderDetails';
import useDocumentTitle from "../components/Title";
import { Link } from "react-router-dom";

const CustomerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [customer, setCustomer] = useState(JSON.parse(sessionStorage.getItem('customer')));

    useDocumentTitle("Your Orders");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/order/all`, { headers });
                if (!response.data || response.status === 204) {
                    toast.info(`You currently have no orders`);
                } else {
                    let list = response.data;
                    list = list.filter(order => order.customer.customerId === customer.customerId);
                    if (list === null || list.length === 0) {
                        toast.info(`You currently have no orders`);
                    } else {
                        setOrders(list);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`${styles['request-page']}`}>
            <h1 className='text-center mb-4'>MY ORDERS</h1>
            <div className='container-fluid' style={{ padding: '0 3rem' }}>
                <div className="row">
                    <div className={`${styles['table-container']}`}>
                        <table>
                            <thead>
                                <tr className={`fs-6 ${styles['table-head']}`}>
                                    <th className="col-md-1">Order ID</th>
                                    <th className="col-md-3">Product Name</th>
                                    <th>Product Type</th>
                                    <th>Order Date</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="fs-6">
                                {orders.length <= 0 ? (
                                    <tr>
                                        <td colSpan="7">You have no orders.</td>
                                    </tr>
                                ) : (
                                    orders.sort((a, b) => b.orderDate - a.orderDate).map(order => (
                                        <tr key={order.id}>
                                            <td className="col-md-1">{order.id}</td>
                                            <td className="col-md-3">{order.product && order.product.productName ? order.product.productName : `Description: ${order.description}`}</td>
                                            <td className="text-capitalize">{order.product && order.product.productType ? order.product.productType : 'TBD'}</td>
                                            <td>{formatDate(order.orderDate)}</td>
                                            <td>{order.totalAmount != null ? formatPrice(order.totalAmount) : 'TBD'}</td>
                                            <td className="text-capitalize">{order.status.replaceAll("_", " ")}</td>
                                            <td>
                                                {
                                                    order.status == 'wait_customer' || order.status == 'pending_design'
                                                        ? <>
                                                            <Link to={`/profile/your-request`}>
                                                                <button className='fs-6'>
                                                                    Go to requests
                                                                </button>
                                                            </Link>
                                                        </>
                                                        : <>
                                                            <Link to={`/profile/your-orders/${order.id}`}>
                                                                <button className='fs-6'>
                                                                    View details
                                                                </button>
                                                            </Link>
                                                        </>
                                                }
                                                {/* <Link to={`/profile/your-orders/${order.id}`}>
                                                    <button className='fs-6'>
                                                        View details
                                                    </button>
                                                </Link> */}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrdersPage;
