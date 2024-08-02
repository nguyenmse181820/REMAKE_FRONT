import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../helper_function/ConvertFunction';
import empty_image from '/src/assets/empty_image.jpg';
import { faCaretLeft, faCaretRight, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '/src/css/PendingDesign.module.css';
import { validateString } from '../../helper_function/Validation';
import { toast } from 'sonner';

const PendingDesign = ({ order }) => {

    const navigate = useNavigate();

    const [note, setNote] = useState('');
    const validateNote = validateString(note, 8, Math.INFINITY);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (accepted) => {
        try {
            setProcessing(true);
            let response = null;
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            if (accepted) {
                response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/customers/${order.id}/acceptDesign`, {}, { headers });
            } else {
                if (validateNote.result) {
                    response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/customers/${order.id}/refuseDesign`, {
                        note: note
                    }, { headers });
                } else {
                    toast.info(`You must give feedback on why you refuse`);
                }
            }
            if (!response.data || response.status === 204) {
                toast.error("Something went wrong, failed to submit");
            } else {
                setProcessing(false);
                navigate("/profile");
            }
        } catch (error) {
            setProcessing(false);
            console.log(error);
        }
    }

    //--------------------------------IMAGE THING---------------------------------------------------
    const [activeProductionImage, setActiveProductionImage] = useState(0);

    const handleProductionImageMove = (direction) => {
        if (direction) {
            setActiveProductionImage(n => n + 1);
        } else {
            setActiveProductionImage(n => n - 1);
        }
    }
    //--------------------------------IMAGE THING---------------------------------------------------

    return (
        <>
            {
                processing
                    ? <div className="spinner-border text-secondary" role="status">
                    </div>
                    : <></>
            }
            <div className="container-fluid p-3">
                <div className="row mb-3">
                    <div className="col">
                        <FontAwesomeIcon className={`${styles['back-icon']} `} icon={faLeftLong} onClick={() => navigate(-1)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
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
                    </div>
                </div>
                <div className="col-md mb-3">
                    <textarea placeholder='Leave notes....' style={{ resize: "none" }} className="form-control rounded-0" onChange={(e) => setNote(e.target.value)} rows='5' cols='30' aria-label="description"></textarea>
                    <div className="form-text text-danger">{validateNote.reason}</div>
                </div>
                <div className='row  mb-3'>
                    <div className="col-md">
                        <button onClick={() => handleSubmit(true)} className='btn btn-success w-100 rounded-0'>Accept</button>
                    </div>
                    <div className="col-md">
                        <button onClick={() => handleSubmit(false)} className='btn btn-danger w-100 rounded-0'>Decline</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PendingDesign;