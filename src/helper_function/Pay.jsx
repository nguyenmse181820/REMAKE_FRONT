import axios from 'axios';

export const makePayment = async (amount) => {
    try {
        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
        const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/payment/vn-pay?amount=${amount}`, {headers});
        window.location.replace(response.data.data.paymentUrl);
    } catch (error) {
        console.log(error);
    }
}