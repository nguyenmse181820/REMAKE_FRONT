import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from 'axios';
import styles from '/src/css/ManageRequestsPage.module.css';
import { formatDate, formatPrice } from "../helper_function/ConvertFunction";
import OrderDetails from "../components/OrderDetails";
import WaitManager from '../pages/request-details-components/WaitManager';
import useDocumentTitle from "../components/Title";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const ManageRequestsPage = () => {
    const [orders, setOrders] = useState([]);
    const [queryOrders, setQueryOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [activeOrder, setActiveOrder] = useState(null);
    const orderStatus = [
        'Waiting for Sales Staff',
        'Waiting for Manager',
        'Manager approved',
        'Waiting for Customer',
        'Customer Accepted',
        'Designing',
        'Pending Designs',
        'Production',
        'Delivered',
        'Waiting for Payment',
        'Completed'
    ];

    useDocumentTitle("Manage Requests");

    const TableComponent = () => {
        if (queryOrders.length > 0 && !loading) {
            return (
                queryOrders.sort((a,b) => b.id - a.id).map(order => (
                    <tr className="fs-6" key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer.name}</td>
                        <td>{formatDate(order.orderDate)}</td>
                        <td>{order.totalAmount == null ? `Budget: ${formatPrice(order.budget)}` : `Price: ${formatPrice(order.totalAmount)}`}</td>
                        <td className="text-capitalize">{order.status.replaceAll("_", " ")}</td>
                        <td>
                            {
                                order.status == 'wait_manager'
                                    ? <>
                                        <Link to={`/staff/manage-requests/quote/${order.id}`} >
                                            <button className={`${styles[`font-small`]}`}>
                                                VIEW DETAILS
                                            </button>
                                        </Link>
                                    </>
                                    : <>
                                        <Link to={`/staff/manage-requests/request/${order.id}`} >
                                            <button className={`${styles[`font-small`]}`}>
                                                VIEW DETAILS
                                            </button>
                                        </Link>
                                    </>
                            }
                        </td>
                    </tr>
                ))
            )
        } else if (loading) {
            return (
                <tr>
                    <td colSpan={6}>
                        <LinearProgress />
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td colSpan="6">You have no orders.</td>
                </tr>
            )
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/order/all`, { headers });
                if (!response.data || response.status === 204) {
                    toast.error("Cannot fetch orders");
                } else {
                    let orders = response.data.filter(order => order.status != 'cancelled');
                    setOrders(orders);
                    setQueryOrders(orders);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }

        fetchData();
    }, [])

    useEffect(() => {
        let status = null;
        switch (activeStatus) {
            case "Waiting for Sales Staff":
                status = 'wait_sale_staff';
                break;
            case "Waiting for Manager":
                status = 'wait_manager';
                break;
            case "Manager approved":
                status = 'manager_approved';
                break;
            case "Waiting for Customer":
                status = 'wait_customer';
                break;
            case "Customer Accepted":
                status = 'customer_accept';
                break;
            case "Designing":
                status = 'designing';
                break;
            case "Pending Designs":
                status = 'pending_design';
                break;
            case "Production":
                status = 'production';
                break;
            case "Delivered":
                status = 'delivered';
                break;
            case "Waiting for Payment":
                status = 'wait_payment';
                break;
            case "Completed":
                status = 'completed';
                break;
            default:
        }
        if (status !== null) {
            const query_orders = orders.filter(order => order.status === status);
            setQueryOrders(query_orders);
        } else {
            setQueryOrders(orders);
        }
    }, [activeStatus, orders])

    return (
        <div id={styles['manage-request']} className="container-fluid">

            <div className="row my-3">
                <div className="col">
                    <div className={`${styles['circle-style']}`}>
                        <div className={styles['status-line']}>
                            <div className={`${styles['status-item']}`}>
                                <div
                                    onClick={() => setActiveStatus(null)}
                                    className={`${styles['view-circle']}`}
                                >
                                    <span><FontAwesomeIcon icon={faList} /></span>
                                </div>
                                <p className={styles['status-label']}>View all</p>
                            </div>
                            {orderStatus.map((status, index) => (
                                <React.Fragment key={index}>
                                    <div className={`${styles['status-item']} `}>
                                        <div
                                            onClick={() => setActiveStatus(status)}
                                            className={`${styles['status-circle']} ${activeStatus === status ? styles['active'] : ''}`}
                                        >
                                            <span className="fw-bold">{index + 1}</span>
                                        </div>
                                        <p className={styles['status-label']}>{status}</p>
                                    </div>
                                    {index < orderStatus.length - 1 && (
                                        <span className={styles['separator']}>{'>'}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <div className="col">
                    <table>
                        <thead>
                            <tr className={`${styles['table-head']} fs-6`}>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Price/Budget</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableComponent />
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <div className="row mb-3">
                <div className="col">
                    {activeOrder == null
                        ? <p className="fs-5 mt-3">*Choose an order to view its details.</p>
                        : activeOrder.status === 'wait_manager'
                            ? <WaitManager order={activeOrder} />
                            : <OrderDetails orderId={activeOrder.id} staffType="manage" />
                    }
                </div>
            </div> */}
        </div>
    )
}

export default ManageRequestsPage;
