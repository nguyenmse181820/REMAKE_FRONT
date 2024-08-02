import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../helper_function/ConvertFunction';
import axios from 'axios';
import { fetchDiamondPrice, fetchMaterialPrice } from '../../helper_function/FetchPriceFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faRing, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import styles from '/src/css/CompleteProduct.module.css';
import { makePayment } from '../../helper_function/Pay';
import useDocumentTitle from '../../components/Title';

const CompleteProduct = () => {
    const navigate = useNavigate();

    const [productDesign, setProductDesign] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [estimatedPrice, setEstimatedPrice] = useState(null);
    const selectedDiamonds = sessionStorage.getItem('selected_diamonds') !== null ? JSON.parse(sessionStorage.getItem('selected_diamonds')) : null;
    const selectedProduct = sessionStorage.getItem('selected_product') !== null ? JSON.parse(sessionStorage.getItem('selected_product')) : null;
    const customer = sessionStorage.getItem('customer') !== null ? JSON.parse(sessionStorage.getItem('customer')) : null;

    useDocumentTitle('Complete Bijoux Order');
    useEffect(() => {
        if (selectedDiamonds == null || selectedProduct == null) {
            toast.info(`Please return for selection`);
            navigate(`/build-your-own/choose-settings`);
        } else {
            fetchData();
        }
    }, [])

    const fetchData = async () => {
        const materials = await getMaterials(selectedProduct.selectedShell.productShellDesignId);
        const estimated_price = await getEstimatePrice(selectedProduct.selectedShell, selectedDiamonds, materials);

        setEstimatedPrice(estimated_price);
        setMaterials(materials);
    }

    const getMaterials = async (shellId) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/product-shell-material/${shellId}`, { headers });
            if (!response.data || response.status === 204) {
                toast.error("ERror cannot fetch materials");
            } else {
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getEstimatePrice = async (shell, diamonds, materials) => {
        let totalPrice = 0;
        totalPrice += shell.ematerialPrice;
        totalPrice += shell.productionPrice;
        totalPrice += shell.ediamondPrice;
        for (const diamond of diamonds) {
            const diamond_price = await fetchDiamondPrice(diamond.origin, diamond.shape, diamond.caratWeight, diamond.color, diamond.clarity, diamond.cut);
            totalPrice += diamond_price;
        }
        for (const material of materials) {
            const material_price = await fetchMaterialPrice(material.material.materialId);
            totalPrice += material_price * material.weight;
        }
        totalPrice = totalPrice * shell.markupRate;
        return totalPrice;
    }

    const clickPay = async () => {
        if (sessionStorage.getItem('customer') == null) {
            toast.info(`You need to be logged in!`);
            navigate('/login');
            return;
        }
        try {
            const orderId = await createOrder();
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const orderAmount = await axios.get(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`, { headers });
            if (!orderAmount || orderAmount.status === 204) {
                console.log(`Can't find totalAmount of that order`);
            } else {
                sessionStorage.setItem('currentOrderId', orderAmount.data.id);
                sessionStorage.setItem('currentOrderType', orderAmount.data.orderType);
                makePayment(orderAmount.data.totalAmount * 0.3);
            }
        } catch (error) {
            toast.error(`Payment process failed: ${error}`);
        }
    }

    const createOrder = async () => {
        try {
            const object = {
                productDesignId: selectedProduct.productDesignId,
                productShellId: selectedProduct.selectedShell.productShellDesignId,
                diamondIds: selectedDiamonds.map(d => d.diamondId),
                customerId: customer.customerId,
                note: selectedProduct.note
            };
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/create-order-from-design`, object, { headers });
            if (!response.data || response.status === 204) {
                toast.error("Failed to fetch order");
            } else {
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <h1 className='text-center mb-4 mt-5' style={{ fontFamily: 'Cambria' }}>MY BIJOUX ORDER</h1>
                </div>
                <div className='row mt-5'>
                    <div className={`col-md-8 ${styles.container}`} style={{backgroundColor: 'aliceblue', padding: '2rem'}}>
                        <div className={`${styles.imageSection}`}>
                            <div className='row position-relative'>
                                <div className={`${styles['image-container']} position-absolute left-0`} style={{height: '20%' }}>
                                    {selectedDiamonds.map(d =>
                                        <img key={d.diamondId} src={d.image.split("|")[0]} alt="Diamond" className={`${styles['diamondImage']} p-0 me-1`} />
                                    )}
                                </div>
                                <img src={selectedProduct.designFile} className={styles.productImage} alt="Product Design" />
                            </div>
                        </div>
                        <div className={`${styles.detailsSection}`}>

                            <p className='fs-4' style={{}}>{selectedProduct.designName} in {selectedProduct.selectedShell.shellName}</p>
                            <br />
                            <p className='fs-5'><FontAwesomeIcon icon={faGem} /> <i>Diamonds</i></p>
                            <ul>
                                {selectedDiamonds.map(d =>
                                    <li key={d.diamondId} style={{ listStyle: 'none' }}>
                                        {d.caratWeight} Carat {d.diamondName} {d.shape} Shape <br /> {d.cut} Cut {d.clarity} Clarity {d.color} Color <br /> Stock#:{d.diamondCode}

                                    </li>

                                )}
                            </ul>
                            <p className='fs-5'><FontAwesomeIcon icon={faRing} /> <i>Materials</i></p>
                            <ul>
                                {
                                    materials.map(m =>
                                        <li key={m.material.materialId} style={{ listStyle: 'none' }}>
                                            {m.material.materialName} - {m.weight} carat
                                        </li>
                                    )
                                }
                            </ul>

                            <p className='fw-bold fs-5 mt-4' style={{display: 'flex', justifyContent: 'space-between' }}>
                                <span>Product price:</span>
                                <span style={{color: '#48AAAD'}}>
                                    {estimatedPrice === null
                                    ? 'Estimating price...'
                                    : formatPrice(estimatedPrice)
                                }
                                </span>
                            </p>

                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className={`${styles[`summary`]}`}>
                            <p className="fs-5 fw-semibold "><FontAwesomeIcon icon={faClipboardList} /> SUMMARY</p>

                            <div>
                                <div>
                                    <div style={{ marginLeft: '1vw' }}>
                                        <p className='fs-6'>Subtotal: {estimatedPrice ? formatPrice(estimatedPrice) : 'Estimating price...'}</p>
                                        <p className='fs-6'>US & Int. Shipping: Free (Premium Shipping)</p>
                                        <p className='fs-6'>Taxes/Duties Estimate: 10% VAT</p>
                                    </div>
                                    <hr />
                                    <p className='fs-4'>ESTIMATED TOTAL: <span style={{ color: '#48AAAD', marginLeft: '1vw', marginTop: '1vw' }}>{(estimatedPrice + estimatedPrice * 0.1) ? formatPrice(estimatedPrice + estimatedPrice * 0.1) : 'Estimating price...'}</span></p>
                                    <div className='row'>
                                        <div className='col d-flex'><button onClick={clickPay} className={styles.button}>Pay 30% - {estimatedPrice !== null ? formatPrice(estimatedPrice * 1.1 * 0.3) : 'Estimating price...'}</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompleteProduct;
