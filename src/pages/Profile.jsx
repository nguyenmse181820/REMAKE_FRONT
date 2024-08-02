import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useDocumentTitle from '../components/Title';
import styles from '../css/Profile.module.css';
import { toast } from 'sonner';
import axios from 'axios';
import { validateString } from '../helper_function/Validation';

const ProfilePage = () => {
    const navigate = useNavigate();
    const customer = sessionStorage.getItem('customer') != null ? JSON.parse(sessionStorage.getItem('customer')) : null
    const [name, setName] = useState('');
    const validateName = validateString(name, 1, 20);
    const [address, setAddress] = useState('');
    const validateAddress = validateString(address, 10, 100);
    const [email, setEmail] = useState('');
    const validateEmail = validateString(email, 8, 254, '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
    const [refresh, setRefresh] = useState(false);
    useDocumentTitle("My Account");

    useEffect(() => {
        if (customer != null) {
            setName(customer.name);
            setEmail(customer.account.email);
            setAddress(customer.address);
        }
    }, [refresh])

    const saveChanges = async () => {
        if (
            
            validateName.result &&
            validateAddress.result &&
            validateEmail.result
        ) {
            try {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const object = {
                    ...customer,
                    account: {
                        ...customer.account,
                        email: email
                    },
                    address: address,
                    name: name
                }
                const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/update`, object, { headers });
                if (!response.data || response.status == 204) {
                    toast.error(`Error updating profile`);
                } else {
                    sessionStorage.setItem('customer', JSON.stringify(response.data));
                    setRefresh(r => !r);
                    toast.success(`Changes saved`);
                }
            } catch (error) {
                if(error.response.status === 406) {
                    toast.error(`The email ${email} is already linked to another account!`);
                }
            }
        } else {
            if(!validateName.result) 
                toast.error("Name field error: "+ validateName.reason);
            if(!validateEmail.result)
                toast.error("Email field error: "+ validateEmail.reason);
            if(!validateAddress.result)
                toast.error("Address field error: "+ validateAddress.reason);
        }
    }

    return (
        <div className={`${styles['account-page']}`}>
            <section className={`${styles['row']}`}>
                <img className={`img-fluid ${styles['img-slide']}`} src="https://www.withclarity.com/cdn/shop/files/Diamond-banner_1920x.jpg?v=1695385583" alt="choose_settings" />
                <div className={`${styles[`overlay-content`]}`}>
                    <p className='fw-light text-center'>MY ACCOUNT</p>
                </div>
            </section>
            <div className={`${styles[`form-container`]}`}>
                <div className={`row gap-3`}>
                    <p className='mb-5 fw-light' style={{ fontSize: '2rem' }}>My Personal Details</p>
                    <div className="col-md p-0">
                        <div className="form-floating">
                            <input
                                type="name"
                                className="form-control"
                                id="floatingInputGrid"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="floatingInputGrid">Name</label>
                        </div>
                    </div>
                    <div className="col-md p-0">
                        <div className="form-floating">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInputGrid"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="floatingInputGrid">Email address</label>
                        </div>
                    </div>
                    <div className="col-md p-0">
                        <div className="form-floating">
                            <input
                                type="address"
                                className="form-control"
                                id="floatingInputGrid"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <label htmlFor="floatingInputGrid">Address</label>
                        </div>
                    </div>

                </div>

                <div className='row mt-5'>
                    <button
                        type="button"
                        className={`btn btn-md ${styles['save-change']}`}
                        onClick={saveChanges}
                    >
                        Save Changes
                    </button>
                </div>
                <div className="row mt-5 gap-3">
                    <div className={`col ${styles['button-custom']}`} onClick={() => navigate("/profile/your-orders")} >
                        View Orders
                    </div>
                    <div className={`col ${styles['button-custom']}`} onClick={() => navigate("/profile/your-request")}>
                        View Request
                    </div>
                </div>
            </div>


        </div >
    );
}

export default ProfilePage;