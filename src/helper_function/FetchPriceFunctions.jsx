import axios from 'axios';

export const fetchMaterialPrice = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/material/${id}`);
        if (response.status === 204) {
            return 0;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        return 0; // Return 0 in case of error to not break the total calculation
    }
};

export const fetchDiamondPrice = async (origin, shape, caratWeight, color, clarity, cut) => {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
    const response = await axios.post(`${import.meta.env.VITE_jpos_back}/public/diamond-price/get-single-price`,
        {
            origin: origin,
            cut: cut,
            clarity: clarity,
            caratWeight: caratWeight,
            color: color,
            shape: shape
        }
    )
    if (!response.data || response.status === 204) {
        console.log("Failed to fetch diamond price");
    }
    return response.data;
};