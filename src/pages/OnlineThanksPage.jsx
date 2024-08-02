import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import complete from '/src/assets/order-complete.png';
import styles from '/src/css/OnlineThanksPage.module.css';
import useDocumentTitle from '../components/Title';

const OnlineThanksPage = () => {

    const navigate = useNavigate();

    useDocumentTitle("Thank You!");

    const clear = () => {
        const customer = JSON.parse(sessionStorage.getItem('customer'));
        const token = sessionStorage.getItem('token');

        sessionStorage.clear();

        sessionStorage.setItem('customer', JSON.stringify(customer));
        sessionStorage.setItem('token', token);
    }

    return (
        <>
            <div className="container text-center my-5">
                <div className="row">
                    <div className="col-12">
                        <img src={complete} alt="Complete" className="img-fluid mb-4" style={{ maxWidth: '200px' }} />
                        <h1 className="mb-3">Thank You for Your Purchase!</h1>
                        <p className="lead mb-4">Your order has been placed successfully.</p>
                        <Link to="/build-your-own/choose-setting" onClick={clear} className={`col-2 btn btn-lg mb-3 ${styles.continueShoppingButton}`}>Continue Shopping</Link>
                        <br />
                        <Link to="/profile/your-orders" className={`col-2 btn btn-lg mb-3 ${styles.continueShoppingButton}`}>View Order Details</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default OnlineThanksPage;