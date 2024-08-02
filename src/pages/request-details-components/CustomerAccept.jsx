import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../helper_function/ConvertFunction';
import { Toaster, toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '/src/css/CustomerAccept.module.css';
import axios from 'axios';
import emptyImage from '/src/assets/empty_image.jpg';

const CustomerAccept = ({ order }) => {

    const navigate = useNavigate();

    const [paymentDate, setPaymentDate] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [amountPaid, setAmountPaid] = useState(0);
    const [maxDate, setMaxDate] = useState('');

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // JavaScript months are 0-based
        let day = today.getDate();

        // Pad month and day with leading zeros if necessary
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        setMaxDate(`${year}-${month}-${day}`);
    }, []);


    const handleSubmit = async () => {
        try {
            if (paymentDate !== null &&
                paymentMethod.trim().length > 0 &&
                amountPaid >= order.totalAmount * 0.3
            ) {
                setProcessing(true);
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/sales/orders/${order.id}/confirm-deposit`,
                    {
                        paymentDate: paymentDate,
                        paymentMethod: paymentMethod,
                        paymentStatus: 'deposit',
                        amountPaid: amountPaid,
                        amountTotal: order.totalAmount
                    },
                    {
                        headers
                    }
                )
                if (!response.data || response.status === 204) {
                    toast.error("Something happened, failed to confirm deposit");
                } else {
                    console.log(response.data);
                    setProcessing(false);
                    navigate("/staff/request");
                }
            } else {
                if (paymentMethod.trim().length <= 0) {
                    toast.info(`Please select a payment method`);
                }
                if (paymentDate == null) {
                    toast.info(`Please select a date`);
                }
                if (amountPaid < order.totalAmount * 0.3) {
                    toast.info(`Amount paid must be at least 30% of the product's price: ${formatPrice(order.totalAmount*0.3)}`);
                }
            }
        } catch (error) {
            console.log(error);
            setProcessing(false);
        }
    }

    return (
        <>
            <div className='container-fluid' id={`${styles['customer-accept']}`}>
                <div className="row">
                    <h1 className='fw-bold'>
                        <FontAwesomeIcon onClick={() => navigate('/staff/request')} icon={faChevronLeft} className='me-3' id={`${styles['go-back-icon']}`} />
                        Customer Accepts
                    </h1>
                </div>

                <div className="row">
                    <div className="col">
                        <h4 className='fw-bold'>Customer name</h4>
                        <p>[ID: {order.customer.customerId}] {order.customer.name}</p>
                        <h4 className='fw-bold'>Customer address</h4>
                        <p>{order.customer.address}</p>
                        {
                            order.orderType !== 'from_design'
                                ? <>
                                    <h4 className='fw-bold'>Customer budget</h4>
                                    <p>{formatPrice(order.budget)}</p>
                                    <h4 className='fw-bold'>Description</h4>
                                    <p style={{ maxWidth: '500px', wordWrap: 'break-word' }} >{order.description}</p>
                                    <h4 className='fw-bold'>Reference image</h4>
                                    <img className='img-fluid' src={order.designFile == 'Not provided' ? emptyImage : order.designFile} alt="" style={{ width: '500px', height: '500px' }} />
                                </>
                                : <>
                                    <h4 className='fw-bold'>Design model</h4>
                                    <img className='img-fluid' src={order.designFile == 'Not provided' ? emptyImage : order.designFile} alt="" style={{ width: '500px', height: '500px' }} />
                                </>
                        }
                    </div>
                    <div className='col'>
                        {order.product.diamonds.map(diamond =>
                            <div key={diamond.diamondId}>
                                <h4 className='fw-bold'>Diamond #{diamond.diamondId}</h4>
                                <ul>
                                    <li>Shape: {diamond.shape}</li>
                                    <li>Clarity: {diamond.clarity}</li>
                                    <li>Color: {diamond.color}</li>
                                    <li>Cut: {diamond.cut}</li>
                                </ul>
                            </div>
                        )}
                        <h4>Total: <span className='text-success'>{formatPrice(order.odiamondPrice)}</span></h4>
                        {order.product.materials.map(material =>
                            <div key={material.material.materialId}>
                                <h4 className='fw-bold'>Material #{material.material.materialId}</h4>
                                <ul>
                                    <li>Name: {material.material.materialName}</li>
                                    <li>Weight: {material.weight} karat</li>
                                </ul>
                            </div>
                        )}
                        <h4>Total: <span className='text-success'>{formatPrice(order.omaterialPrice)}</span></h4>
                        <h4 className='fw-bold'>Extra</h4>
                        <ul>
                            <li>Extra diamonds: {formatPrice(order.ediamondPrice)}</li>
                            <li>Extra materials: {formatPrice(order.ematerialPrice)}</li>
                            <li>Production price: {formatPrice(order.productionPrice)}</li>
                        </ul>
                        <h4>Accepted price as of {formatDate(order.odate)}: <span className='text-success'>{formatPrice(order.totalAmount)}</span></h4>
                        <h4 className='fw-bold'>Payment</h4>
                        <div className="row mb-2">
                            <div className="col">Payment method</div>
                            <div className="col">
                                <select onChange={(e) => setPaymentMethod(e.target.value)} className='form-control'>
                                    <option value=''>Select payment method</option>
                                    {["VISA", "Cash", "Credit/Debit"].map(value => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col">Payment date</div>
                            <div className="col">
                                <input onChange={(e) => setPaymentDate(e.target.value)} className='form-control' max={maxDate} type="date" />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col">Amount paid</div>
                            <div className="col">
                                <input onChange={(e) => setAmountPaid(e.target.value)} placeholder='0.00' className='form-control' type="number" />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col">
                                Total amount
                            </div>
                            <div className="col">
                                {formatPrice(order.totalAmount)}
                            </div>
                        </div>
                        {
                            processing
                                ? <button className="btn btn-secondary w-100" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    <span role="status">Loading...</span>
                                </button>
                                :
                                <button className={`btn w-100 ${styles['submit-button']}`} onClick={handleSubmit}>
                                    Confirm customer deposit
                                </button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerAccept;