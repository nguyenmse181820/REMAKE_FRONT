import { Link, useNavigate } from 'react-router-dom';
import styles from '/src/css/BuildYourOwnNav.module.css';
import { useState, useEffect } from 'react';
import { formatPrice } from '../helper_function/ConvertFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';

const BuildYourOwnNav = () => {

    const navigate = useNavigate();
    const selectedProduct = sessionStorage.getItem('selected_product') !== null ? JSON.parse(sessionStorage.getItem('selected_product')) : null;
    const selectedDiamonds = sessionStorage.getItem('selected_diamonds') !== null ? JSON.parse(sessionStorage.getItem('selected_diamonds')) : null;

    const calculateTotal = () => {
        if(selectedDiamonds == null) {
            return 0;
        } else {
            let total = 0;
            for(const diamond of selectedDiamonds) {
                total += diamond.price;
            }
            return total;
        }
    }

    const checkCompletion = () => {
        if(selectedProduct != null && selectedDiamonds != null) {
            if(selectedDiamonds.length == selectedProduct.selectedShell.diamondQuantity) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="container mt-4" id={styles['build-your-own-nav']} style={{ paddingBottom: '5vh' }}>
            <div className="row flex-nowrap">
                <div className={`col-lg-4 ${styles['col']}`} onClick={() => navigate("/build-your-own/choose-setting")}>
                    <div className="col-1">
                        <h2>1.</h2>
                    </div>

                    {
                        selectedProduct == null
                            ? <>
                                <p className='fs-5 mt-3'>Choose a setting</p>
                            </>
                            : <>
                                <div className="col">
                                    <div className="container-fluid">
                                        <div className={`"row fw-bold text-truncate`} style={{maxWidth: '10rem'}}>
                                            {selectedProduct.designName}
                                        </div>
                                        <div className="row justify-content-around">
                                            <b className='text' style={{ color: '#48AAAD' }}>{formatPrice(selectedProduct.price)}</b>
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-2 ${styles['image-col']} `}>
                                    <Link onClick={(e) => e.stopPropagation()} to={`/build-your-own/setting-details/${selectedProduct.productDesignId}`}>
                                        <img crossOrigin='anonymous' src={selectedProduct.designFile} alt="" />
                                    </Link>
                                </div>
                            </>
                    }

                </div>
                <div className={`col-lg-4 ${styles['col']}`} onClick={() => navigate("/build-your-own/choose-diamond")}>
                    <div className="col-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h2>2.</h2>
                    </div>
                    <div className='col' style={{ height: '100%', boxSizing: 'border-box' }}>
                        <div className="container-fluid" style={{ boxSizing: 'border-box', height: '100%' }}>
                            <div className="row" style={{ boxSizing: 'border-box', height: '100%' }}>
                                {
                                    selectedDiamonds === null
                                        ? <>
                                            <p className='fs-5 mt-3'>Choose diamonds</p>
                                        </>
                                        : <>
                                            {
                                                selectedDiamonds.map((diamond, index) => (
                                                    <div key={index} className="col-2 p-0" style={{ boxSizing: 'border-box', height: '100%', marginRight: '5px' }}>
                                                        <Link onClick={(e) => e.stopPropagation()} to={`/build-your-own/diamond-details/${diamond.diamondId}`}>
                                                            <img crossOrigin='anonymous' className='img-fluid' src={diamond.image.split("|")[0]} alt="" />
                                                        </Link>
                                                    </div>
                                                ))
                                            }
                                            <div className="col-3 p-0" style={{ boxSizing: 'border-box', height: '100%' }}>
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <b>{selectedDiamonds.length}/{selectedProduct.selectedShell.diamondQuantity}</b>
                                                    </div>
                                                    <div className="row">
                                                        <b>Total: <span className='text' style={{ color: '#48AAAD' }}>{formatPrice(calculateTotal())}</span></b>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    checkCompletion()
                        ? <div className={`col-lg-4 ${styles['col']} ${styles['final-button']}`} onClick={() => navigate("/build-your-own/complete-product")}>
                            <p className='fw-bolder m-0 fs-5' >Proceed to checkout</p>
                            <FontAwesomeIcon icon={faRightLong} id={`${styles['icon']}`} />
                        </div>
                        : <div className={`col ${styles['col']}`}>
                            <div className="col-1">
                                <h2>3.</h2>
                            </div>
                            <div className="col fs-5">
                                Complete product
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}

export default BuildYourOwnNav;
