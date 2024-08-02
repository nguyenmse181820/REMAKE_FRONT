import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../helper_function/ConvertFunction';
import useDocumentTitle from '../../components/Title';
import empty_image from '/src/assets/empty_image.jpg';
import styles from '/src/css/DesignerUploadPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { LinearProgress } from '@mui/material';

const DesignerUploadPage = ({ order }) => {
    const [designFiles, setDesignFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [processing, setProcessing] = useState(false);

    useDocumentTitle("Upload Design");

    const navigate = useNavigate();

    const uploadImages = async () => {
        setImageUrls([]);
        setProcessing(true);
        try {
            if (designFiles.length > 0) {
                for (const file of designFiles) {
                    const formData = new FormData();
                    formData.append("file", file)
                    const headers = {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
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

    const submit = async () => {
        try {
            if (designFiles.length <= 0) {
                toast.info(`Please select a file to upload`);
            } else {
                setProcessing(true);
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/designs/upload/${order.id}`, imageUrls.join("|"), { headers });
                if (!response.data || response.status === 204) {
                    throw new Error("Upload file failed. Backend fail");
                }
                navigate('/staff/request');
                setProcessing(false);
            }
        } catch (error) {
            toast.error(`Something went wrong`);
            console.log(error);
            setProcessing(false);
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

    const [activeImage, setActiveImage] = useState(0);
    const handleImageMove = (direction) => {
        if (direction) {
            setActiveImage(n => n + 1);
        } else {
            setActiveImage(n => n - 1);
        }
    }
    //--------------------------------IMAGE THING---------------------------------------------------

    return (
        <>
            <div className="container position-relative">
                <FontAwesomeIcon icon={faLeftLong} className='fs-1 position-absolute pe-auto'/>
                <div className="row mt-3">
                    <div className="col-md-8">
                        <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                        <h5 className='fw-semibold'>Customer name</h5>
                        <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
                        <h5 className='fw-semibold'>Customer address</h5>
                        <p className='fs-6 ms-4'>{order.customer.address}</p>
                        <h5 className='fw-semibold'>Budget</h5>
                        <p className='fs-6 ms-4'>{formatPrice(order.budget)}</p>
                        <h5 className='fw-semibold'>Description</h5>
                        <textarea value={order.description.trim()} style={{ resize: "none" }} maxLength={255} className="form-control rounded-0" rows='10' cols='30' disabled={true}></textarea>
                        <h5 className='fw-semibold'>Reference image</h5>
                        {
                            order.designFile === null
                                ? <>
                                    <img className='img-fluid' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: '100%', height: 'auto' }} />
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
                                        <button onClick={() => handleReferenceImageMove(true)} disabled={activeReferenceImage == order.designFile.split("|").length - 1} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                    </div>
                                </>
                        }
                        {
                            order.modelFeedback
                                ? <>
                                    <h5 className='fw-semibold'>Model feedback</h5>
                                    <textarea value={order.modelFeedback} style={{ resize: "none" }} maxLength={255} className="form-control rounded-0" rows='5' cols='30' disabled={true}></textarea>
                                </>
                                : <>
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

                        <hr /><h5 className={styles.listItem}><span>Tax fee (10% VAT):</span> <span>{order.taxFee === null ? 'None' : formatPrice(order.taxFee)}</span></h5>
                        <h5 className={styles.listItem}><span>TOTAL PRICE {formatDate(order.qdate)}:</span> <span style={{ color: '#48AAAD' }}>{order.totalAmount === null ? "None" : formatPrice(order.totalAmount)}</span></h5>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12 text-center">
                        <h2>Upload design file</h2>
                        <div>
                            <div className="mb-3">
                                <input className="form-control mb-3 rounded-0" type="file" multiple={true} accept="image/*" onChange={(e) => setDesignFiles(e.target.files)} />
                                <div className="d-flex justify-content-between">
                                    <button onClick={() => handleImageMove(false)} disabled={activeImage == 0} hidden={imageUrls.length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                    <div style={{ height: '400px' }}>
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
                                        !processing
                                            ? <>
                                                <div className="col">
                                                    <button className="btn btn-dark w-100 rounded-0" onClick={uploadImages} >Upload image</button>
                                                </div>
                                                <div className="col">
                                                    <button className="btn btn-dark w-100 rounded-0" onClick={submit} >Submit</button>
                                                </div>
                                            </>
                                            : <>
                                                <div className="col">
                                                    <LinearProgress />
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
}
export default DesignerUploadPage;