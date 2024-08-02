import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import WaitSaleStaff from './request-details-components/WaitSaleStaff';
import WaitManager from './request-details-components/WaitManager';
import ManagerApproved from './request-details-components/ManagerApproved';
import CustomerAccept from './request-details-components/CustomerAccept';
import Production from './request-details-components/Production';
import DesignerUploadPage from './request-details-components/DesignerUploadPage';
import ConfirmPaymentPage from './request-details-components/ConfirmPaymentPage';

const RequestDetailPage = () => {
    const orderId = useParams().orderId;

    const [order, setOrder] = useState(undefined);
    useEffect(() => {
        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
        axios.get(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`,{headers})
            .then(
                response => {
                    setOrder(response.data);
                }
            ).catch(
                error => {
                    if (error.response) {
                        toast(error.response);
                    }
                    toast("Something went wrong...");
                }
            );
    }, [])

    if (order === undefined) {
        return (
            <h1>Loading...</h1>
        )
    } else {
        switch (order.status) {
            case "wait_sale_staff":
                return (
                    <WaitSaleStaff order={order} />
                )
                
            case "wait_manager":
                return (
                    <WaitManager order={order} />
                );
            case "manager_approved":
                return (
                    <ManagerApproved order={order} />
                );
                
            case "customer_accept":
                return (
                    <CustomerAccept order={order} />
                )
                
            case "designing":
                return(
                    <DesignerUploadPage order={order}/>
                );
                
            case "production":
                return (
                    <Production order={order} />
                )
                
            case "delivered":
                return(
                    <ConfirmPaymentPage order={order} />
                )
                
            case "completed":
                break;
            default:
        }
        toast("Something went wrong...");
    };
}

export default RequestDetailPage;
