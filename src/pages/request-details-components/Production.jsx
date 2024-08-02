import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../helper_function/ConvertFunction';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '/src/css/Production.module.css';
import empty_image from '/src/assets/empty_image.jpg';
import useDocumentTitle from '../../components/Title';
import { LinearProgress } from '@mui/material';

const Production = ({ order }) => {

    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [designFiles, setDesignFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    useDocumentTitle("Complete Production");

    const handleSubmit = async () => {
        try {
            if (imageUrls.length <= 0) {
                toast.info("Please upload your completed product's image!");
            } else {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/${order.id}/complete-product`, imageUrls.join("|"), { headers });
                if (!response.data || response.status === 204) {
                    toast.error("Something went wrong, can't submit");
                } else {
                    console.log(response.data);
                    navigate("/staff/request");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const uploadImages = async () => {
        setImageUrls([]);
        setProcessing(true);
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            if (designFiles.length > 0) {
                for (const file of designFiles) {
                    const formData = new FormData();
                    formData.append("file", file)
                    const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/upload`, formData, { headers });
                    if (!response.data || response.status === 204) {
                        throw new Error("Upload file failed. Backend fail");
                    }
                    setImageUrls(arr => [...arr, response.data]);
                }
            } else {
                toast.info(`Please select at least 1 image!`);
            }
        } catch (error) {
            console.log(error);
        }
        setProcessing(false);
    }

    const [activeProductionImage, setActiveProductionImage] = useState(0);
    const [activeImage, setActiveImage] = useState(0);

    const handleProductionImageMove = (direction) => {
        if (direction) {
            setActiveProductionImage(n => n + 1);
        } else {
            setActiveProductionImage(n => n - 1);
        }
    }

    const handleImageMove = (direction) => {
        if (direction) {
            setActiveImage(n => n + 1);
        } else {
            setActiveImage(n => n - 1);
        }
    }

    return (
        <>
            <div className='container-fluid' id={`${styles['production']}`}>
                <div className="row">
                    <h1 className='fw-bold'>
                        <FontAwesomeIcon onClick={() => navigate('/staff/request')} icon={faChevronLeft} className='me-3' id={`${styles['go-back-icon']}`} />
                        Production Order
                    </h1>
                </div>

                <div className="row mb-2">
                    <div className="col-md-8">
                        <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                        <h5 className='fw-semibold'>Customer name</h5>
                        <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
                        <h5 className='fw-semibold'>Customer address</h5>
                        <p className='fs-6 ms-4'>{order.customer.address}</p>
                        <h5 className='fw-semibold'>Note</h5>
                        <p className='fs-6 ms-4'>{order.note}</p>
                        <h5 className='fw-semibold'>Design images</h5>
                        {
                            order.modelFile === null
                                ? <>
                                    <img className='img-fluid' src={order.modelFile === null ? empty_image : order.modelFile} alt="" style={{ width: '100%', height: '600px' }} />
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
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col text-center">
                        <label className="form-label ">Upload completed image of product</label>
                        <input className="form-control mb-3" multiple={true} type="file" onChange={(e) => setDesignFiles(e.target.files)} />
                        <div className={`d-flex justify-content-between`}>
                            <button onClick={() => handleImageMove(false)} disabled={activeImage == 0} hidden={imageUrls.length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                            <div style={{ height: '600px' }}>
                                {
                                    imageUrls.length > 0
                                        ? imageUrls.map((image, index) => {
                                            if (activeImage == index) {
                                                return (
                                                    <img className='img-fluid' style={{ width: 'auto', height: '100%' }} key={index} src={image} crossOrigin="anonymous" />
                                                )
                                            } else {
                                                return (
                                                    <img className='img-fluid' key={index} src={image} crossOrigin="anonymous" style={{ width: 'auto', height: '100%', display: 'none' }} />
                                                )
                                            }
                                        })
                                        : <p>URL: Not provided</p>
                                }
                            </div>
                            <button onClick={() => handleImageMove(true)} disabled={activeImage == imageUrls.length - 1} hidden={imageUrls.length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                        </div>
                        <div className="row mt-3">
                            {
                                processing
                                    ? <>
                                        <div className="col">
                                            <LinearProgress />
                                        </div>
                                    </>
                                    : <>
                                        <div className="col">
                                            <button className={`w-100 ${styles[`custom-button`]}`} onClick={uploadImages} >Upload image</button>

                                        </div>
                                        <div className="col">
                                            <button className={`w-100 ${styles[`custom-button`]}`} onClick={handleSubmit}>Submit order</button>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Production