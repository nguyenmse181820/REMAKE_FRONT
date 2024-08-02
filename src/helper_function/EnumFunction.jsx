import axios from "axios";

export const fetchDesignType = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_jpos_back}/public/enum/designTypes`
        })
        if(response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const fetchOrderStatus = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${import.meta.env.VITE_jpos_back}/public/enum/orderStatus`,
        })
        if(response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}