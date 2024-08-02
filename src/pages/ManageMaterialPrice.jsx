import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from '/src/css/ManageMaterialPrice.module.css';
import { formatPrice, formatDate } from '/src/helper_function/ConvertFunction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const formatBackendDate = (date) => {
    // Pad single digit numbers with a leading zero
    const pad = (num) => (num < 10 ? '0' : '') + num;

    // Pad milliseconds to always have three digits
    const padMilliseconds = (num) => {
        if (num < 10) {
            return '00' + num;
        } else if (num < 100) {
            return '0' + num;
        } else {
            return num;
        }
    };

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based in JS
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = padMilliseconds(date.getMilliseconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}


const ManageMaterialPrice = () => {

    const [materialPrices, setMaterialPrices] = useState(null);
    const [materials, setMaterials] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const [activePrice, setActivePrice] = useState(null);
    const [activeDate, setActiveDate] = useState(null);
    const [newPrice, setNewPrice] = useState(null);

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/materialPrices/find-all`,{headers});
            const response2 = await axios.get(`${import.meta.env.VITE_jpos_back}/api/material/all`,{headers});
            if (!response.data || response.status === 204 || !response2.data || response2.status === 204) {
                toast.info(`Cannot fetch data`);
            } else {
                setMaterialPrices(response.data);
                setMaterials(response2.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updatePrice = async () => {
        if(newPrice >= 0 && newPrice !== null) {
            try {
                if (activePrice == null || activeDate == null || newPrice == null) {
                    toast.error(`Missing fields!`);
                } else {
                    const object = {
                        materialId: activePrice,
                        materialPrice: newPrice
                    }
                    const headers = {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                    const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/materialPrices/add`, object, {headers});
                    if (!response.data || response.status === 204) {
                        toast.error(`Cannot update`);
                    } else {
                        setActiveDate(null);
                        setActivePrice(null);
                        setNewPrice(null);
                        setRefresh(r => !r);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error(`New price must be greater than 0 or empty.`);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [refresh])

    return (
        <div className="container-fluid" id={`${styles['manage-material-price']}`}>
            <div className="row mb-3">
                <div className="col">
                    <table className="text-center table border align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Eff. Date</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                materials != null && materialPrices != null
                                    ? materials.map((material, index) => (
                                        <tr key={index}>
                                            <td>{material.materialId}</td>
                                            <td id={`${styles['materials']}`}>{material.materialName.replace("_", " ")}</td>
                                            <td>
                                                {
                                                    formatDate(
                                                        materialPrices
                                                            .filter(price => price.materialPriceId.materialId == material.materialId)
                                                            .sort((a, b) => new Date(b.materialPriceId.effectiveDate) - new Date(a.materialPriceId.effectiveDate))[0].materialPriceId.effectiveDate
                                                    )
                                                }
                                            </td>
                                            <td>
                                                <div className="input-group" >
                                                    {
                                                        activePrice !== material.materialId
                                                            ? <>
                                                                <input
                                                                    type="number"
                                                                    step={0.05}
                                                                    min={0.01}
                                                                    className="form-control text-end rounded-0"
                                                                    value={
                                                                        materialPrices
                                                                            .filter(price => price.materialPriceId.materialId == material.materialId)
                                                                            .sort((a, b) => new Date(b.materialPriceId.effectiveDate) - new Date(a.materialPriceId.effectiveDate))[0].price
                                                                    }
                                                                    disabled={true}
                                                                />
                                                                <button
                                                                    className="btn btn-primary rounded-0"
                                                                    onClick={() => {
                                                                        setActivePrice(material.materialId);
                                                                        setNewPrice(materialPrices
                                                                            .filter(price => price.materialPriceId.materialId == material.materialId)
                                                                            .sort((a, b) => new Date(b.materialPriceId.effectiveDate) - new Date(a.materialPriceId.effectiveDate))[0].price);
                                                                        setActiveDate(new Date(
                                                                            materialPrices
                                                                                .filter(price => price.materialPriceId.materialId == material.materialId)
                                                                                .sort((a, b) => new Date(b.materialPriceId.effectiveDate) - new Date(a.materialPriceId.effectiveDate))[0].materialPriceId.effectiveDate
                                                                        ))
                                                                    }}
                                                                > <FontAwesomeIcon icon={faPenToSquare} /> </button>
                                                            </>
                                                            : <>
                                                                <input
                                                                    type="number"
                                                                    step={0.05}
                                                                    min={0.01}
                                                                    className="form-control text-end rounded-0"
                                                                    value={newPrice}
                                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                                />
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={updatePrice}
                                                                > <FontAwesomeIcon icon={faFloppyDisk} /> </button>
                                                                <button
                                                                    className="btn btn-danger rounded-0"
                                                                    onClick={() => {
                                                                        setActivePrice(null);
                                                                        setActiveDate(null);
                                                                        setNewPrice(null);
                                                                    }}
                                                                > <FontAwesomeIcon icon={faXmark} /> </button>
                                                            </>
                                                    }
                                                </div>
                                                {

                                                }
                                            </td>
                                        </tr>
                                    ))
                                    : <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageMaterialPrice;