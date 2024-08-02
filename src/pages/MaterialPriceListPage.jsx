import { useEffect, useState } from "react";
import { fetchMaterialPrice } from "../helper_function/FetchPriceFunctions";
import axios from "axios";
import styles from '/src/css/MaterialPriceListPage.module.css';
import { formatDate, formatPrice } from "../helper_function/ConvertFunction";
import { CircularProgress, LinearProgress } from "@mui/material";

const MaterialPriceListPage = () => {

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/material/all`);
            let priced_materials = []
            for (const material of response.data) {
                priced_materials.push(
                    {
                        ...material,
                        price: await fetchMaterialPrice(material.materialId)
                    }
                )
            }
            setMaterials(priced_materials);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className={`container ${styles[`list-page`]}`}>
            <div className={`${styles[`page-title`]}`}>
                <p>Precious Material Price List</p>
            </div>
            <div>
                <p>Last Updated: {formatDate(new Date())}</p>
            </div>
            {
                materials.length > 0 && !loading
                    ?
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: "#48AAAD", color: "white" }}>PRECIOUS MATERIAL <span style={{ fontWeight: "normal" }}>(g)</span></th>
                                <th style={{ backgroundColor: "#48AAAD", color: "white" }}>PRICE <span style={{ fontWeight: "normal" }}>(USD)</span></th>
                            </tr>
                        </thead>
                        <tbody className={`${styles[`content`]}`}>
                            {
                                materials.map((value, index) => (
                                    <tr key={index}>
                                        <td>
                                            {
                                                value.materialName.replaceAll("_", " ").split(" ").map((word, i) => i === 0
                                                    ? word.charAt(0).toUpperCase() + word.slice(1)
                                                    : word.toUpperCase()
                                                ).join(" ")
                                            }
                                        </td>
                                        <td>
                                            {formatPrice(value.price)}
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    : <div className="container-fluid">
                        <div className="row">
                            <div className="col d-flex justify-content-center align-items-center">
                                <CircularProgress />
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default MaterialPriceListPage;