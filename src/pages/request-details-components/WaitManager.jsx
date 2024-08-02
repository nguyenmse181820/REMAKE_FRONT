import { formatDate, formatPrice } from '../../helper_function/ConvertFunction'
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import empty_image from '/src/assets/empty_image.jpg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '/src/css/WaitManager.module.css';

const WaitManager = () => {

    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`, { headers });
            if (response.status === 200) {
                setOrder(response.data);
                setMarkupRate(response.data.markupRate);
                setTotalAmount(response.data.totalAmount);
            } else {
                toast.error(`Error fetching order`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const navigate = useNavigate();
    const [markupRate, setMarkupRate] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const acceptQuote = () => {

        if (markupRate <= 0 || totalAmount <= 0) {
            toast.info(`Markup rate cannot be 0 or below`);
        } else {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            axios.post(`${import.meta.env.VITE_jpos_back}/api/${order.id}/manager-response?managerApproval=true`,
                {
                    markupRate: markupRate,
                    totalAmount: totalAmount
                },
                {
                    headers
                }
            )
                .then(
                    response => {
                        toast.success(`Form submitted`);
                        navigate('/staff/manage-requests');
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
        }
    }

    const updatePrice = (e) => {
        setMarkupRate(e.target.value);
        setTotalAmount((order.totalAmount / order.markupRate) * e.target.value);
    }

    const refuseQuote = () => {
        if (sessionStorage.getItem('staff') !== null) {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            axios.post(`${import.meta.env.VITE_jpos_back}/api/${order.id}/manager-response?managerApproval=false`, {}, { headers })
                .then(
                    response => {
                        toast.info(`Quotation rejected`);
                        navigate('/staff/manage-requests');
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
        }
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

    if (order == null) {
        return (
            <div className='container-fluid'>
                Loading...
            </div>
        )
    } else {


        return (
            <>
                <div className='container-fluid' id={`${styles['wait-manager']}`}>
                    <div className="row">
                        <h1 className='fw-bold'>
                            <FontAwesomeIcon onClick={() => navigate(-1)} icon={faChevronLeft} className='me-3' id={`${styles['go-back-icon']}`} />
                            Accept quotation
                        </h1>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                            <h5 className='fw-semibold'>Customer name</h5>
                            <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
                            <h5 className='fw-semibold'>Customer address</h5>
                            <p className='fs-6 ms-4'>{order.customer.address}</p>
                            <h5 className='fw-semibold'>Reference image</h5>
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
                                            <p className={styles.listItem}><span>Shape:</span> <span>{diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}</span></p>
                                            <p className={styles.listItem}><span>Clarity:</span> <span>{diamond.clarity}</span></p>
                                            <p className={styles.listItem}><span>Color:</span> <span>{diamond.color}</span></p>
                                            <p className={styles.listItem}><span>Cut:</span> <span>{diamond.cut}</span></p>
                                        </div>
                                    </div>
                                )
                                : <></>
                            }
                            <h5 className={styles.listItem}><span>Quotation price:</span> <span style={{ color: 'red' }}>{order.qdiamondPrice === null ? 'None' : formatPrice(order.qdiamondPrice)}</span></h5>
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
                            <h5 className={styles.listItem}><span>Order price:</span> <span style={{ color: '#48AAAD' }}>{order.omaterialPrice === null ? 'None' : formatPrice(order.omaterialPrice)}</span></h5>
                            <hr />
                            <h5 className='fw-semibold mb-4'>Extra</h5>
                            <div className='fs-6' style={{ listStyle: "none" }}>
                                <p className={styles.listItem}><span>Extra diamonds:</span> <span>{order.ediamondPrice === null ? "None" : formatPrice(order.ediamondPrice)}</span></p>
                                <p className={styles.listItem}><span>Extra materials:</span> <span>{order.ematerialPrice === null ? "None" : formatPrice(order.ematerialPrice)}</span></p>
                                <p className={styles.listItem}><span>Production price:</span> <span>{order.productionPrice === null ? "None" : formatPrice(order.productionPrice)}</span></p>
                            </div>
                            <h5>Total price as of {formatDate(order.qdate)}: <span style={{ color: '#48AAAD' }}>{formatPrice(order.totalAmount)}</span></h5>
                            <h5 className='fw-bold'>Markup rate</h5>
                            <input step={0.1} min={0.1} max={10} className='form-control mb-3' type="number" onChange={updatePrice} value={markupRate} />
                            <h4>Total: <span style={{ color: '#48AAAD' }}>{formatPrice(totalAmount)}</span></h4>
                            <div className="row">
                                <div className="col d-flex">
                                    <button onClick={acceptQuote} className={`${styles.button} rounded-0`}>Accept</button>
                                </div>
                                <div className="col d-flex">
                                    <button onClick={refuseQuote} className={`${styles.button} rounded-0 ${styles["secondary-button"]}`}>Refuse</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default WaitManager;