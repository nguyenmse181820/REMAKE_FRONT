import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const PaymentHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }

    useEffect(() => {
        const callback = async () => {
            try {
                console.log(`GET ${import.meta.env.VITE_jpos_back}/api/payment/vn-pay-callback${location.search}&orderId=${sessionStorage.getItem('currentOrderId')}&orderType=${sessionStorage.getItem('currentOrderType')}`)
                const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/payment/vn-pay-callback${location.search}&orderId=${sessionStorage.getItem('currentOrderId')}&orderType=${sessionStorage.getItem('currentOrderType')}`, { headers });
                console.log(response);
                if (response.status == 200) {
                    sessionStorage.removeItem('selected_product');
                    sessionStorage.removeItem('selected_diamonds');
                    sessionStorage.removeItem('currentOrderId');
                    sessionStorage.removeItem('currentOrderType');
                    navigate("/online-completed");
                }
            } catch (error) {
                console.log(`POST ${import.meta.env.VITE_jpos_back}/api/cancel-order/${sessionStorage.getItem('currentOrderId')}`)
                await axios.post(`${import.meta.env.VITE_jpos_back}/api/cancel-order/${sessionStorage.getItem('currentOrderId')}`, {}, { headers });
                if (sessionStorage.getItem('currentOrderType') == 'from_design') {
                    navigate('/build-your-own/complete-product');
                } else {
                    navigate('/profile');
                }
                sessionStorage.removeItem('currentOrderId');
                sessionStorage.removeItem('currentOrderType');

            }
        }

        callback();
    }, [])

    return (
        <>
            <h1>Payment processing</h1>
        </>
    )
}

export default PaymentHandler;