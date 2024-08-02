import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import PendingDesign from './customer-request-details/PendingDesign';
import WaitCustomer from './customer-request-details/WaitCustomer';
import axios from 'axios';
import useDocumentTitle from '../components/Title';
import styles from '/src/css/CustomerRequestDetailsPage.module.css';

const CustomerRequestDetailsPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [customer,setCustomer] = useState(JSON.parse(sessionStorage.getItem('customer')));

    useDocumentTitle("Your Request Details");

    const fetchOrder = async () => {

        //console.log(`GET ${import.meta.env.VITE_jpos_back}/api/customers/${sessionStorage.getItem('customer_id')}/orders`);
        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
        const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/customers/${customer.customerId}/orders`,{headers});
        if (!response.data || response.status === 204) {
            toast.error("No data found");
        }
        setOrderList(response.data);
    }

    useEffect(() => {
        fetchOrder();
    }, [])

    useEffect(() => {
        if(currentIndex >= 0 && currentIndex < orderList.length) {
            setCurrentOrder(orderList[currentIndex]);
        }
    },[currentIndex])

    useEffect(() => {
        //console.log(orderList);
        if (orderList.length > 0) {
            setCurrentOrder(orderList[currentIndex]);
        }
    }, [orderList])

    return (
        <>
            <div className='container' id={`${styles['customer-request-detail']}`}>
                <div className="row p-0 gap-3">
                    <div className='col p-0'>
                        <button disabled={currentIndex == 0} onClick={() => setCurrentIndex(val => val - 1)} className={`border ${styles['btn']} btn rounded-0 text-white w-100`}>
                            Previous
                        </button>
                    </div>
                    <div className='col p-0'>
                        <button disabled={currentIndex == orderList.length-1} onClick={() => setCurrentIndex(val => val + 1)} className={`border ${styles['btn']} btn rounded-0 text-white w-100`}>
                            Next
                        </button>
                    </div>
                </div>
                <div className='row'>
                    {currentOrder != null && currentOrder.status == 'wait_customer' ? <WaitCustomer order={currentOrder} /> : <></>}
                    {currentOrder != null && currentOrder.status == 'pending_design' ? <PendingDesign order={currentOrder} /> : <></>}
                </div>
            </div>
        </>
    )

}

export default CustomerRequestDetailsPage;