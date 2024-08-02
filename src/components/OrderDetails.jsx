import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDate, formatPrice } from '../helper_function/ConvertFunction';
import styles from '/src/css/OrderDetails.module.css';
import empty_image from '/src/assets/empty_image.jpg';
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import img1 from '../assets/FullLogo.png';
import img2 from '../assets/carpentry.webp';
import { fetchOrderStatus } from "../helper_function/EnumFunction";

const AssignColumn = ({ order, fetchOrder }) => {

    const [saleStaff, setSaleStaff] = useState([]);
    const [productionStaff, setProductionStaff] = useState([]);
    const [designStaff, setDesignStaff] = useState([]);

    const [selectedSaleStaff, setSelectedSaleStaff] = useState('');
    const [selectedDesignStaff, setSelectedDesignStaff] = useState('');
    const [selectedProductionStaff, setSelectedProductionStaff] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const production_staff = await fetchProductionStaff();
            const sale_staff = await fetchSaleStaff();
            const design_staff = await fetchDesignStaff();
            setDesignStaff(design_staff);
            setSaleStaff(sale_staff);
            setProductionStaff(production_staff);
        }
        fetchData();
    }, [])

    const fetchProductionStaff = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/staff-production`, { headers });
            if (!response.data || response.status === 204) {
                toast.error(`Something went wrong went fetching staff members`);
            } else {
                return Array.isArray(response.data) ? response.data : [response.data];
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDesignStaff = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/staff-design`, { headers });
            if (!response.data || response.status === 204) {
                toast.error(`Something went wrong went fetching staff members`);
            } else {
                return Array.isArray(response.data) ? response.data : [response.data];
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSaleStaff = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/staff-sale`, { headers });
            if (!response.data || response.status === 204) {
                toast.error(`Something went wrong went fetching staff members`);
            } else {
                return Array.isArray(response.data) ? response.data : [response.data];
            }
        } catch (error) {
            console.log(error);
        }
    }

    const submitForm = async () => {
        if (selectedProductionStaff.length > 0 || selectedSaleStaff.length > 0 || selectedDesignStaff.length > 0) {
            try {
                //console.log(`POST ${import.meta.env.VITE_jpos_back}/api/assign?orderId=${order.id}&${selectedProductionStaff.length > 0 ? `productionStaffId=${selectedProductionStaff}` : ''}&${selectedDesignStaff.length > 0 ? `designStaffId=${selectedDesignStaff}` : ''}&${selectedSaleStaff.length > 0 ? `saleStaffId=${selectedSaleStaff}` : ''}`);
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/assign?orderId=${order.id}&${selectedProductionStaff.length > 0 ? `productionStaffId=${selectedProductionStaff}` : ''}&${selectedDesignStaff.length > 0 ? `designStaffId=${selectedDesignStaff}` : ''}&${selectedSaleStaff.length > 0 ? `saleStaffId=${selectedSaleStaff}` : ''}`, {}, { headers });
                if (response.status === 200) {
                    fetchOrder();
                    setSelectedDesignStaff('');
                    setSelectedProductionStaff('');
                    setSelectedDesignStaff('');
                } else {
                    toast.error(`Assign failed`);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.info(`Choose at least one staff to save!`);
        }
    }


    return (
        <>
            <div className="row mb-2">
                <div className="col">
                    Sale staff:
                </div>
                <div className="col text-end">
                    {
                        order.saleStaff == null
                            ? <>
                                <select className={`form-select rounded-0`} value={selectedSaleStaff} onChange={(e) => setSelectedSaleStaff(e.target.value)}>
                                    <option value=''>Select a staff</option>
                                    {saleStaff.map((staff, index) =>
                                        <option key={index} value={staff.staffId}>{staff.name} - {staff.phone}</option>
                                    )}
                                </select>
                            </>
                            : <>
                                {order.saleStaff.name} [ID: {order.saleStaff.staffId}]
                            </>
                    }
                </div>
            </div>
            {
                order.orderType == 'from_design'
                    ? <></>
                    : <>
                        <div className="row mb-2">
                            <div className="col">
                                Design staff:
                            </div>
                            <div className="col text-end">
                                {
                                    order.designStaff == null
                                        ? <>
                                            <select className={`form-select rounded-0`} value={selectedDesignStaff} onChange={(e) => setSelectedDesignStaff(e.target.value)}>
                                                <option value=''>Select a staff</option>
                                                {designStaff.map((staff, index) =>
                                                    <option key={index} value={staff.staffId}>{staff.name} - {staff.phone}</option>
                                                )}
                                            </select>
                                        </>
                                        : <>
                                            {order.designStaff.name} [ID:{order.designStaff.staffId}]
                                        </>
                                }
                            </div>
                        </div>
                    </>
            }
            <div className="row mb-2">
                <div className="col">
                    Prod. staff:
                </div>
                <div className="col text-end">
                    {
                        order.productionStaff == null
                            ? <>
                                <select className={`form-select rounded-0`} value={selectedProductionStaff} onChange={(e) => setSelectedProductionStaff(e.target.value)}>
                                    <option value=''>Select a staff</option>
                                    {productionStaff.map((staff, index) =>
                                        <option key={index} value={staff.staffId}>{staff.name} - {staff.phone}</option>
                                    )}
                                </select>
                            </>
                            : <>
                                {order.productionStaff.name} [ID:{order.productionStaff.staffId}]
                            </>
                    }
                </div>
            </div>
            {
                (order.orderType == 'from_design' && (order.saleStaff == null || order.productionStaff == null)) || (order.orderType == 'customize' && (order.saleStaff == null || order.productionStaff == null || order.designStaff == null))
                    ? <div className="row">
                        <button className={`${styles['custom-button']}`} onClick={submitForm}>
                            Assign
                        </button>
                    </div>
                    : <></>
            }
        </>
    )

}

const OrderDetails = () => {
    const location = useLocation().pathname.split("/");
    const navigate = useNavigate();
    const orderId = useParams().orderId;
    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [warranty, setWarranty] = useState(null);
    const [listOrderStatus, setListOrderStatus] = useState([]);


    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    })

    const staffType = location.includes("your-orders") ? 'customer' : location.includes('manage-requests') ? 'manage' : 'staff';

    const getWarranty = async () => {
        try {
            const response = await axios({
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                url: `${import.meta.env.VITE_jpos_back}/api/warranty/product/${order.product.productId}`
            })
            if (response.status === 200) {
                setWarranty(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchOrder = async () => {
        try {
            //(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`)
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/sales/order-select/${orderId}`, { headers });
            const list_order_status = await fetchOrderStatus();
            if (!response.data || response.status == 204) {
                toast.error(`Error fetching order`);
            } else {
                //console.log(response.data);
                setOrder(response.data);
                setListOrderStatus(list_order_status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPayment = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_jpos_back}/api/payment/info/${orderId}`,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                setPayment(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelOrder = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_jpos_back}/api/cancel-order/${orderId}`,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                toast.success('Order cancelled successfully');
                navigate(-1);
            } else {
                toast.error('Failed to cancel order');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to cancel order');
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

    const [activeProductionImage, setActiveProductionImage] = useState(0);

    const handleProductionImageMove = (direction) => {
        if (direction) {
            setActiveProductionImage(n => n + 1);
        } else {
            setActiveProductionImage(n => n - 1);
        }
    }

    const [activeFinalImage, setActiveFinalImage] = useState(0);

    const handleFinalImageMove = (direction) => {
        if (direction) {
            setActiveFinalImage(n => n + 1);
        } else {
            setActiveFinalImage(n => n - 1);
        }
    }
    //--------------------------------IMAGE THING---------------------------------------------------


    useEffect(() => {
        fetchOrder();
        fetchPayment();
    }, [orderId]);

    useEffect(() => {
        if (warranty == null) {
            if (order !== null && order.status == 'completed') {
                getWarranty();
            }
        }
    }, [order])

    console.log(payment);

    if (order == null) {
        return (
            <>
                Loading...
            </>
        )
    } else {
        return (
            <>
                <div id={`${styles['order-details']}`} className={`${staffType == 'manage' ? 'container-fluid' : 'container'}`}>
                    <div className="row">
                        <div className="col-md-8 position-relative">
                            <FontAwesomeIcon className={`${styles['back-icon']} position-absolute`} icon={faLeftLong} onClick={() => navigate(-1)} />
                            <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                            <h5 className='fw-semibold'>Customer name</h5>
                            <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
                            <h5 className='fw-semibold'>Customer address</h5>
                            <p className='fs-6 ms-4'>{order.customer.address}</p>
                            <h5 className='fw-semibold'>Budget</h5>
                            <p className='fs-6 ms-4 text-justify'>{formatPrice(order.budget)}</p>
                            <h5 className='fw-semibold'>Description</h5>
                            <p className='fs-6 text-justify'>{order.description}</p>
                            <h5 className='fw-semibold'>Reference images</h5>
                            {
                                order.designFile === null
                                    ? <>
                                        <img className='img-fluid' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: 'auto', height: '600px' }} />
                                    </>
                                    : <>
                                        <div className="d-flex justify-content-between">
                                            <button onClick={() => handleReferenceImageMove(false)} disabled={activeReferenceImage == 0} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                            <div style={{ height: '600px' }}>
                                                {
                                                    order.designFile.split("|").map((image, index) => {
                                                        if (index == activeReferenceImage) {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%' }} />
                                                        } else {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%', display: 'none' }} />
                                                        }
                                                    })
                                                }
                                            </div>
                                            <button onClick={() => handleReferenceImageMove(true)} disabled={activeReferenceImage == order.designFile.split("|").length - 1} hidden={order.designFile.split("|").length <= 0} className={`${styles[`image-btn`]}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                        </div>
                                    </>
                            }
                            <h5 className='fw-semibold'>Design images</h5>
                            {
                                order.modelFile === null
                                    ? <>
                                        <img className='img-fluid' src={order.modelFile === null ? empty_image : order.modelFile} alt="" style={{ width: 'auto', height: '600px' }} />
                                    </>
                                    : <>
                                        <div className="d-flex justify-content-between">
                                            <button onClick={() => handleProductionImageMove(false)} disabled={activeProductionImage == 0} hidden={order.modelFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                            <div style={{ height: '600px' }}>
                                                {
                                                    order.modelFile.split("|").map((image, index) => {
                                                        if (index == activeProductionImage) {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%' }} />
                                                        } else {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%', display: 'none' }} />
                                                        }
                                                    })
                                                }
                                            </div>
                                            <button onClick={() => handleProductionImageMove(true)} disabled={activeProductionImage == order.modelFile.split("|").length - 1} hidden={order.modelFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                        </div>
                                    </>
                            }
                            <h5 className='fw-semibold'>Finished product</h5>
                            {
                                order.productImage === null
                                    ? <>
                                        <img className='img-fluid' src={order.productImage === null ? empty_image : order.productImage} alt="" style={{ width: 'auto', height: '600px' }} />
                                    </>
                                    : <>
                                        <div className="d-flex justify-content-between">
                                            <button onClick={() => handleFinalImageMove(false)} disabled={activeFinalImage == 0} hidden={order.productImage.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                            <div style={{ height: '600px' }}>
                                                {
                                                    order.productImage.split("|").map((image, index) => {
                                                        if (index == activeFinalImage) {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%' }} />
                                                        } else {
                                                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%', display: 'none' }} />
                                                        }
                                                    })
                                                }
                                            </div>
                                            <button onClick={() => handleFinalImageMove(true)} disabled={activeFinalImage == order.productImage.split("|").length - 1} hidden={order.productImage.split("|").length <= 0} className={`${styles[`image-btn`]}`}><FontAwesomeIcon icon={faCaretRight} /></button>

                                        </div>
                                    </>
                            }
                        </div>

                        <div className="col-md-4">
                            {
                                order.status != 'completed' && staffType == 'manage'
                                    ? <div className="col">
                                        <h4 className="text-center fw-bold mb-4 mt-4">ASSIGNMENT</h4><hr />
                                        <AssignColumn order={order} fetchOrder={fetchOrder} />
                                    </div>
                                    : <>
                                    </>
                            }
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

                            <hr /><h5 className={styles.listItem}><span>Tax fee (10% VAT):</span> <span>{order.taxFee === null ? 'None' : formatPrice(order.taxFee)}</span></h5>
                            <h5 className={styles.listItem}><span>TOTAL PRICE {formatDate(order.qdate)}:</span> <span style={{ color: '#48AAAD' }}>{order.totalAmount === null ? "None" : formatPrice(order.totalAmount)}</span></h5>
                            {
                                payment != null
                                    ? <div className="border-bottom">
                                        <h4 className="text-center fw-bold mb-4 mt-4">PAYMENT INFORMATION</h4><hr />
                                        <p className={styles.listItem}><span>Payment ID:</span> <span>#{('000' + payment.id).slice(-4)}</span></p>
                                        <p className={styles.listItem}><span>Payment date:</span> <span>{formatDate(payment.paymentDate)}</span></p>
                                        <p className={styles.listItem}><span>Payment method:</span> <span>{payment.paymentMethod}</span></p>
                                        <p className={styles.listItem}><span>Paid:</span> <span>{formatPrice(payment.amountPaid)}</span></p>
                                        <p className={styles.listItem}><span>Total:</span> <span>{formatPrice(payment.amountTotal)}</span></p>
                                        <p className={styles.listItem}><span>Needs to pay:</span> <span>{formatPrice(payment.amountTotal - payment.amountPaid)}</span></p>
                                        <p className={styles.listItem}><span>Payment status:</span> <span>{payment.paymentStatus}</span></p>
                                    </div>
                                    : <>

                                    </>
                            }
                            {
                                listOrderStatus.slice(7).includes(order.status) || staffType == 'staff'
                                    ? <></>
                                    : <button onClick={cancelOrder} className="btn btn-danger rounded-0 w-100">Cancel Order</button>
                            }
                            {
                                warranty !== null
                                    ? <div ref={printRef} className="container mt-5">
                                        <div className="row justify-content-center mb-4">
                                            <div className="text-center">
                                                <img src={img1} className="img-fluid w-25" alt="Logo" />
                                            </div>
                                        </div>
                                        <h4 className="text-center fw-bold mb-3 fs-4">WARRANTY INFORMATION</h4>
                                        <hr />
                                        <h5 className='fw-semibold mb-4 fs-5'>CUSTOMER INFORMATION</h5>

                                        <div className='fs-6'>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">Identification:</span>
                                                <span>#{('000' + (warranty.customer.customerId)).slice(-4)}</span>
                                            </p>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">Name:</span>
                                                <span>{warranty.customer.name}</span>
                                            </p>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">Address:</span>
                                                <span>{warranty.customer.address}</span>
                                            </p>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">Email:</span>
                                                <span>{warranty.customer.account.email}</span>
                                            </p>
                                        </div><hr />

                                        <h5 className='fw-semibold mt-5 mb-4 fs-5'>PRODUCT INFORMATION</h5>
                                        <div className='fs-6'>
                                            <p className="row">
                                                <span className="col fw-bold">Product ID:</span>
                                                <span className="col text-end">#{('000' + (warranty.product.productId)).slice(-4)}</span>
                                            </p>
                                            <p className="row">
                                                <span className="col fw-bold">Product Name:</span>
                                                <span className="col text-end">{warranty.product.productName}</span>
                                            </p>
                                        </div><hr />

                                        <h5 className='fw-semibold mt-5 mb-4 fs-5'>EXTRA</h5>
                                        <div className='fs-6'>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">Purchase date:</span>
                                                <span>{formatDate(warranty.purchaseDate)}</span>
                                            </p>
                                            <p className='d-flex justify-content-between mb-2'>
                                                <span className="fw-bold">End of support date:</span>
                                                <span>{formatDate(warranty.endOfSupportDate)}</span>
                                            </p>

                                        </div><hr />
                                        <div className="text-center">
                                            <img src={img2} className="img-fluid w-25" alt="Logo" />
                                        </div>
                                    </div>

                                    : <></>
                            }
                            {
                                warranty !== null
                                    ? <button onClick={handlePrint} className="btn btn-primary rounded-0 mt-5 w-100">EXPORT TO PDF</button>
                                    : <></>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default OrderDetails;