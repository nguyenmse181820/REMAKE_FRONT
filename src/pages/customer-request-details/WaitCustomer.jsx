import { Toaster, toast } from 'sonner';
import { formatPrice, formatDate } from '../../helper_function/ConvertFunction';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import empty_image from '/src/assets/empty_image.jpg';
import { useNavigate } from 'react-router-dom';
import styles from '/src/css/WaitCustomer.module.css';
import { fetchDiamondPrice, fetchMaterialPrice } from '../../helper_function/FetchPriceFunctions';
import { makePayment } from '../../helper_function/Pay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const WaitCustomer = ({ order }) => {

    const navigate = useNavigate();

    const [currentMaterialPrice, setCurrentMaterialPrice] = useState(0);
    const [currentDiamondPrice, setCurrentDiamondPrice] = useState(0);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getCurrentDiamondPrice(order.product.diamonds);
        getCurrentMaterialPrice(order.product.materials);
    }, [])

    const getCurrentMaterialPrice = async (materials) => {
        let total = 0;
        for (const material of materials) {
            total += await fetchMaterialPrice(material.material.materialId) * material.weight;
        }
        setCurrentMaterialPrice(total);
    };

    const getCurrentDiamondPrice = async (diamonds) => {
        let totalDiamondPrice = 0;
        for (const diamond of diamonds) {
            totalDiamondPrice += await fetchDiamondPrice(diamond.origin, diamond.shape, diamond.caratWeight, diamond.color, diamond.clarity, diamond.cut);
        }
        setCurrentDiamondPrice(totalDiamondPrice);
    };

    const createOrder = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/accept-quotation?orderId=${order.id}`, {}, { headers });
            if (!response.data || response.status === 204) {
                toast.error("Something went wrong, saving failed");
            } else {
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const clickPay = async () => {
        setProcessing(true);
        try {
            const orderId = await createOrder();
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const orderAmount = await axios.get(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`, { headers });
            if (!orderAmount || orderAmount.status === 204) {
                console.log(`Can't find totalAmount of that order`);
            } else {
                console.log(orderAmount);
                sessionStorage.setItem('currentOrderId', orderAmount.data.id);
                sessionStorage.setItem('currentOrderType', orderAmount.data.orderType);
                makePayment(orderAmount.data.totalAmount * 0.3);
            }
        } catch (error) {
            toast.error(`Payment process failed: ${error}`);
        }
        setProcessing(false);
    }

    //--------------------------------IMAGE THING---------------------------------------------------
    const [activeReferenceImage, setActiveReferenceImage] = useState(0);

    const handleReferenceImageMove = (direction) => {
        if (direction) {
            setActiveReferenceImage(n => n + 1);
        } else {
            setActiveReferenceImage(n => n - 1);
        }
    }
    //--------------------------------IMAGE THING---------------------------------------------------


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8">
                        <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                        <h5 className='fw-semibold'>Customer name</h5>
                        <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
                        <h5 className='fw-semibold'>Customer address</h5>
                        <p className='fs-6 ms-4'>{order.customer.address}</p>
                        <h5 className='fw-semibold'>Reference image</h5>
                        <img className='img-fluid mb-3' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: '100%', height: 'auto' }} />
                        {
                            order.designFile === null
                                ? <>
                                    <img className='img-fluid' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: '100%', height: 'auto' }} />
                                </>
                                : <>
                                    <div className="position-relative">
                                        <button onClick={() => handleReferenceImageMove(false)} disabled={activeReferenceImage == 0} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']} position-absolute start-0 top-50`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                        <button onClick={() => handleReferenceImageMove(true)} disabled={activeReferenceImage == order.designFile.split("|").length - 1} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']} position-absolute end-0 top-50`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                        {
                                            order.designFile.split("|").map((image, index) => {
                                                if (index == activeReferenceImage) {
                                                    return <img key={index} className='img-fluid' src={image} alt="" style={{ width: '100%', height: 'auto' }} />
                                                } else {
                                                    return <img key={index} className='img-fluid' src={image} alt="" style={{ width: '100%', height: 'auto', display: 'none' }} />
                                                }
                                            })
                                        }
                                    </div>
                                </>
                        }
                    </div>

                    <div className="col-md-4">
                        <h4 className="text-center fw-bold mb-4 mt-4">ORDER SUMMARY</h4><hr />
                        {order.product !== null
                            ? order.product.diamonds.map(diamond =>
                                <div key={diamond.diamondId}>
                                    <h5 className='fw-semibold mb-4'>Diamond #{diamond.diamondId}</h5>
                                    <div className='fs-6'>
                                    <p className={styles.listItem}><span>Diamond Code:</span><span>{diamond.diamondCode}</span></p>
                                            <p className={`${styles.listItem}`}><span className="w-50">Diamond Name:</span><span className="text-end w-50">{diamond.diamondName}</span></p>
                                            <p className={styles.listItem}><span>Shape:</span> <span>{diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}</span></p>
                                            <p className={styles.listItem}><span>Clarity:</span> <span>{diamond.clarity}</span></p>
                                            <p className={styles.listItem}><span>Color:</span> <span>{diamond.color}</span></p>
                                            <p className={styles.listItem}><span>Cut:</span> <span>{diamond.cut.replaceAll("_", " ")}</span></p>
                                            <p className={styles.listItem}><span>Carat weight:</span> <span>{diamond.caratWeight}</span></p>
                                            <p className={styles.listItem}><span>Origin:</span> <span>{diamond.origin}</span></p>
                                            <p className={styles.listItem}><span>Proportions:</span> <span>{diamond.proportions}</span></p>
                                            <p className={styles.listItem}><span>Fluorescence:</span> <span>{diamond.fluorescence.replaceAll("_", " ")}</span></p>
                                            <p className={`${styles.listItem}`}><span>Symmetry:</span> <span>{diamond.symmetry.replaceAll("_", " ")}</span></p>
                                            <p className={styles.listItem}><span>Polish:</span> <span>{diamond.polish.replaceAll("_", " ")}</span></p>
                                    </div>
                                </div>
                            )
                            : <></>
                        }
                        <h5 className={styles.listItem}><span>Quotation price:</span> <span style={{ color: 'red' }}>{order.qdiamondPrice === null ? 'None' : formatPrice(order.qdiamondPrice)}</span></h5>
                        <h5 className={styles.listItem}><span>Current price:</span> <span style={{ color: '#48AAAD' }}>{formatPrice(currentDiamondPrice)}</span></h5>
                        <h5 className={styles.listItem}><span>Order price:</span> <span style={{ color: '#48AAAD' }}>{order.odiamondPrice === null ? 'None' : formatPrice(order.odiamondPrice)}</span></h5>
                        <hr />
                        {order.product !== null
                            ? order.product.materials.map(material =>
                                <div key={material.material.materialId}>
                                    <h5 className='fw-semibold mb-4'>Material #{material.material.materialId}</h5>
                                    <div className='fs-6' style={{ listStyle: "none" }}>
                                        <p className={styles.listItem}><span>Name:</span> <span>{material.material.materialName.replaceAll("_", " ")}</span></p>
                                        <p className={styles.listItem}><span>Weight:</span> <span>{material.weight}</span></p>
                                    </div>
                                </div>
                            )
                            : <>
                            </>
                        }
                        <h5 className={styles.listItem}><span>Quotation price:</span> <span style={{ color: 'red' }}>{order.qmaterialPrice === null ? 'None' : formatPrice(order.qmaterialPrice)}</span></h5>
                        <h5 className={styles.listItem}><span>Current price:</span> <span style={{ color: '#48AAAD' }}>{formatPrice(currentMaterialPrice)}</span></h5>
                        <h5 className={styles.listItem}><span>Order price:</span> <span style={{ color: '#48AAAD' }}>{order.omaterialPrice === null ? 'None' : formatPrice(order.omaterialPrice)}</span></h5>
                        <hr />
                        <h5 className='fw-semibold mb-4'>Extra</h5>
                        <div className='fs-6' style={{ listStyle: "none" }}>
                            <p className={styles.listItem}><span>Extra diamonds:</span> <span>{order.ediamondPrice === null ? "None" : formatPrice(order.ediamondPrice)}</span></p>
                            <p className={styles.listItem}><span>Extra materials:</span> <span>{order.ematerialPrice === null ? "None" : formatPrice(order.ematerialPrice)}</span></p>
                            <p className={styles.listItem}><span>Production price:</span> <span>{order.productionPrice === null ? "None" : formatPrice(order.productionPrice)}</span></p>
                        </div>

                        <hr /><h5 className={styles.listItem}><span>Tax fee (10% VAT):</span> <span>{order.taxFee === null ? 'None' : formatPrice(order.taxFee)}</span></h5>
                        <h5 className={styles.listItem}><span>QUOTE {formatDate(order.qdate)}</span> <span style={{ color: 'red' }}>{order.totalAmount === null ? "None" : formatPrice(order.totalAmount)}</span></h5>
                        <h5 className={styles.listItem}><span>CURRENT {formatDate(new Date())}</span> <span style={{ color: '#48AAAD' }}>{formatPrice((currentDiamondPrice + currentMaterialPrice + order.ematerialPrice + order.ediamondPrice + order.productionPrice) * order.markupRate * 1.1)}</span></h5>
                        {
                            order.status == 'completed'
                                ? <>
                                    <h5 className="fw-bold">WARRANTY INFORMATION</h5>
                                    <div>
                                        <li>Customer ID: {('000' + order.customer.customerId).slice(-4)}</li>
                                        <li>Product ID: {('000' + order.product.productId).slice(-4)}</li>
                                        <li>Purchase date: {order.odate === null ? formatDate(order.orderDate) : formatDate(order.odate)}</li>
                                        <li>Warranty: 4 years from purchase date</li>
                                        <li>Terms: <a href="/" target="_blank">Read our terms here</a></li>
                                    </div>
                                </>
                                : <>
                                </>
                        }
                        {processing
                            ? <button className={`btn rounded-0 w-100 ${styles['submit-button']}`} type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Loading...</span>
                            </button>
                            : <button onClick={clickPay} className={`btn rounded-0 w-100 ${styles['submit-button']}`}>
                                Accept quotation & pay {formatPrice((currentDiamondPrice + currentMaterialPrice + order.ematerialPrice + order.ediamondPrice + order.productionPrice) * order.markupRate * 1.1 * 0.3)} (30% price)
                            </button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default WaitCustomer;