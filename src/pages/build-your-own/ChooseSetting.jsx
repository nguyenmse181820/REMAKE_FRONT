import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import ProductCard from './ProductCard';
import styles from '/src/css/ChooseSettings.module.css';
import useDocumentTitle from '../../components/Title';
import { CircularProgress, LinearProgress } from '@mui/material';

const ChooseSetting = () => {

    const navigate = useNavigate();
    const [designList, setDesignList] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useDocumentTitle('Build Your Own Ring');
    useEffect(() => {
        // if (sessionStorage.getItem('customer') !== null) {

        //     fetchData();
        // } else {
        //     toast.info(`Please log in to continue`);
        //     navigate('/login');
        //     return;
        // }
        fetchData();
    }, [activeCategory])

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/product-designs/all`);
            if (!response.data || response.status === 204) {
                toast.error("NO items in database");
            } else {
                //console.log(response.data);
                if (activeCategory == null) {
                    setDesignList(response.data);
                } else {
                    setDesignList(response.data.filter(design => design.designType === activeCategory))
                }
            }

        } catch (error) {
            toast.error("Error, cannot fetch design list");
        }
    }

    return (
        <>
            <NavigationBar />
            <div className={`${styles.container} container`} style={{minWidth: '1000px'}}>
                {/* <div className="diamond-finder text-center mb-3">
                        <h3 className='ms-3' style={{ textAlign: 'center' }}>Ring Settings</h3>
                        <p style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>Search hundreds of engagement ring settings to find the perfect ring. Styles range from solitaire to vintage-inspired to everything in between.</p>
                    </div> */}
                <div className="container-fluid mb-5">
                    <div className={`row text-center ${styles['category-selector']}`}>
                        <div className={`col ${activeCategory == null ? styles['active'] : ''}`} onClick={() => setActiveCategory(null)}>
                            ALL
                        </div>
                        <div className={`col ${activeCategory == 'necklace' ? styles['active'] : ''}`} onClick={() => setActiveCategory('necklace')}>
                            NECKLACES & PENDANTS
                        </div>
                        <div className={`col ${activeCategory == 'earrings' ? styles['active'] : ''}`} onClick={() => setActiveCategory('earrings')}>
                            EARRINGS
                        </div>
                        <div className={`col ${activeCategory == 'bracelets' ? styles['active'] : ''}`} onClick={() => setActiveCategory('bracelets')}>
                            BRACELETS
                        </div>
                        <div className={`col ${activeCategory == 'ring' ? styles['active'] : ''}`} onClick={() => setActiveCategory('ring')}>
                            RINGS
                        </div>
                    </div>
                </div>
                {designList.length > 0 ? (
                    <div className={`${styles.content} row`}>
                        {designList.map(design => (
                            <div key={design.productDesignId} className="col-md-4 col-lg-3 mb-4">
                                <ProductCard design={design} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col d-flex justify-content-center align-items-center">
                                <CircularProgress/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ChooseSetting;