import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '/src/css/DiamondDetails.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLeft, faTruckFast, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { fetchDiamondPrice } from '../../helper_function/FetchPriceFunctions';
import { formatPrice } from '../../helper_function/ConvertFunction';
import { faUnity } from '@fortawesome/free-brands-svg-icons';
import { CircularProgress } from '@mui/material';

const DiamondDetails = () => {
    const { diamondId } = useParams();
    const [diamond, setDiamond] = useState(null);
    const [diamondPrice, setDiamondPrice] = useState(null);

    const [activeImage, setActiveImage] = useState(0)
    const [spinning, setSpinning] = useState(false);
    const isForwardDirection = useRef(false)
    const prevX = useRef(0)

    const navigate = useNavigate();
    const selectedProduct = sessionStorage.getItem('selected_product') !== null ? JSON.parse(sessionStorage.getItem('selected_product')) : null;

    useEffect(() => {
        if (selectedProduct === null) {
            toast.info(`Please pick a setting first`);
            navigate('/build-your-own/choose-setting');
        } else {
            fetchDiamond();
        }
    }, [diamondId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (diamond) {
            document.title = diamond.caratWeight + ' Carat ' + diamond.shape + ' ' + diamond.origin + ' Diamond';
        } else {
            document.title = 'Diamond Details';
        }
    }, [diamond]);

    //Image stuff

    const handleCursorMoveImage = (e) => {
        const x = e.clientX

        if (prevX.current < x) {
            isForwardDirection.current = true;
            moveImage(true);
        } else {
            isForwardDirection.current = false;
            moveImage(false);
        }

        prevX.current = x
    }

    const moveImage = (isForward) => {
        if (diamond != null) {
            if (isForward) {
                setActiveImage(n => (n + 1) % diamond.image.split("|").slice(1).length)
            } else {
                setActiveImage(n => n == 0 ? diamond.image.split("|").slice(1).length - 1 : n - 1)
            }
        }
    }

    useEffect(() => {
        if (diamond != null && spinning) {
            const interval = setInterval(() => {
                moveImage(isForwardDirection.current)
            }, 50);

            return () => clearInterval(interval);
        }
    }, [diamond, spinning]);
    //Image stuff

    const fetchDiamond = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/diamond/get-by-id/${diamondId}`);
            if (!response.data || response.status === 204) {
                console.error(`Cannot find diamond with ID ${diamondId}`);
            } else {
                const result = response.data;
                const diamondPrice = await fetchDiamondPrice(result.origin, result.shape, result.caratWeight, result.color, result.clarity, result.cut);
                //console.log('Fetched Diamond Data:', response.data);
                setDiamond(result);
                setDiamondPrice(diamondPrice);

            }
        } catch (error) {
            console.error('An error occurred while fetching the diamond data:', error);
        }
    };

    const isSelected = () => {
        if (sessionStorage.getItem('selected_diamonds') == null) {
            return false;
        } else {

            const selected_diamonds = JSON.parse(sessionStorage.getItem('selected_diamonds'));
            return selected_diamonds.filter(d => d.diamondId == diamondId).length > 0;
        }
    }

    const selectDiamond = () => {
        let selected_diamonds = [];
        if (sessionStorage.getItem('selected_diamonds') !== null) {
            selected_diamonds = JSON.parse(sessionStorage.getItem('selected_diamonds'));
        }
        selected_diamonds = [
            ...selected_diamonds,
            {
                ...diamond,
                price: diamondPrice
            }
        ]
        if (selected_diamonds.length <= selectedProduct.selectedShell.diamondQuantity) {
            sessionStorage.setItem('selected_diamonds', JSON.stringify(selected_diamonds));
        } else {
            toast.info(`You have already selected ${selectedProduct.selectedShell.diamondQuantity} out of ${selectedProduct.selectedShell.diamondQuantity} diamonds!`);
        }
        navigate("/build-your-own/choose-diamond");
    }

    const removeSelection = () => {
        let selected_diamonds = JSON.parse(sessionStorage.getItem('selected_diamonds'));
        selected_diamonds = selected_diamonds.filter(d => d.diamondId != diamondId)
        if (selected_diamonds.length > 0) {
            sessionStorage.setItem('selected_diamonds', JSON.stringify(selected_diamonds));
        } else {
            sessionStorage.removeItem('selected_diamonds');
        }
        navigate("/build-your-own/choose-diamond");
    }


    if (diamond === null || diamondPrice == null) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col d-flex justify-content-center align-items-center">
                        <CircularProgress/>
                    </div>
                </div>
            </div>
        )
    } else {

        return (
            <>
                <div className='container'>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <div className={`${styles[`imageSection`]} col-md-6`}>
                                {
                                    spinning == false
                                        ? <div className="position-relative">
                                            <img style={{ cursor: 'pointer' }} src={diamond.image.split("|")[0]} alt="Diamond" className={styles.diamondImage} onClick={() => {
                                                if (diamond.image.split("|").length > 1) {
                                                    setSpinning(true);
                                                }
                                            }} >
                                            </img>
                                            <FontAwesomeIcon hidden={diamond.image.split("|").length <= 1} icon={faUnity} style={{ marginLeft: '1rem', marginTop: '1rem', fontSize: '2rem' }} className='position-absolute start-0 top-0' />
                                        </div>
                                        : <div style={{ cursor: 'grab' }} onClick={() => setSpinning(false)} onMouseMove={handleCursorMoveImage}>
                                            {
                                                diamond.image.split("|").length > 1
                                                    ? diamond.image.split("|").slice(1).map((link, index) => {
                                                        if (index == activeImage) {
                                                            return (
                                                                <img className={styles.diamondImage} key={index} src={link} />
                                                            )
                                                        } else {
                                                            return (
                                                                <img className={styles.diamondImage} key={index} src={link} style={{ display: "none" }} />
                                                            )
                                                        }
                                                    })
                                                    : <></>
                                            }
                                        </div>
                                }
                                <div className={styles.specs}>
                                    <p className={styles.specItem}><span>Shape:</span><span>{diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}</span></p>
                                    <p className={styles.specItem}><span>Cut:</span><span>{diamond.cut}</span></p>
                                    <p className={styles.specItem}><span>Color:</span><span>{diamond.color}</span></p>
                                    <p className={styles.specItem}><span>Clarity:</span><span>{diamond.clarity}</span></p>
                                    <p className={styles.specItem}><span>Carat Weight:</span><span>{diamond.caratWeight}</span></p>
                                    <p className={styles.specItem}><span>Polish:</span><span>{diamond.polish}</span></p>
                                    <p className={styles.specItem}><span>Symmetry:</span><span>{diamond.symmetry}</span></p>
                                    <p className={styles.specItem}><span>Fluorescence:</span><span>{diamond.fluorescence}</span></p>
                                    <p className={styles.specItem}><span>Origin:</span><span>{diamond.origin}</span></p>
                                </div>

                            </div>
                            <div className={`${styles[`detailsSection`]} col-md-6`}>
                                <p className={`fs-2 ${styles.diamondTitle}`}>{diamond.diamondName}</p>
                                <p className={`fs-4 ${styles.diamondTitle}`}>{diamond.origin.charAt(0).toUpperCase() + diamond.origin.slice(1).toLowerCase().replace("_", " ")} {diamond.caratWeight} {diamond.color}-{diamond.clarity} {diamond.cut.replace("_", " ")} Cut {diamond.shape} Diamond</p>
                                <div>
                                    <p className={`mb-3 ${styles.price}`}>{formatPrice(diamondPrice)} (Diamond Price)</p>
                                </div>
                                <div className={`mt-4 mb-5 ${styles.option}`}>
                                    <b>Flexible Payment Options:</b> 3 Interest-Free Payments of {formatPrice(diamondPrice / 3)}
                                </div>
                                <div className={`mb-3 ${styles.buttonsSection}`}>
                                    <div className='row'>
                                        <div className='col'>
                                            {
                                                isSelected()
                                                    ? <button onClick={removeSelection} className={styles.removeButton}>Remove selection</button>
                                                    : <button onClick={selectDiamond} className={styles.primaryButton}>Select this diamond</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={`row ${styles.paymentOptions}`}>
                                    <p className="fs-5">Your order includes:</p>
                                    <div className={styles.optionBox}>
                                        <div className={styles.iconContainer}>
                                            <FontAwesomeIcon icon={faTruckFast} />
                                        </div>
                                        <div className={styles.textContainer}>
                                            <p><b>Free Shipping</b></p>
                                            <p>We're committed to making your entire experience a pleasant one, from shopping to shipping.</p>
                                        </div>
                                    </div>
                                    <div className={styles.optionBox}>
                                        <div className={styles.iconContainer}>
                                            <FontAwesomeIcon icon={faChartBar} />
                                        </div>
                                        <div className={styles.textContainer}>
                                            <p><b>Appraisal Included</b></p>
                                            <p>An appraisal is a document stating the approximate monetary value of your item. It is only available for items over $800.</p>
                                        </div>
                                    </div>
                                    <div className={styles.optionBox}>
                                        <div className={styles.iconContainer}>
                                            <FontAwesomeIcon icon={faRightLeft} />
                                        </div>
                                        <div className={styles.textContainer}>
                                            <p><b>Free Returns</b></p>
                                            <p>Our commitment to you does not end at delivery. We offer free returns (U.S and Canada) to make your experience as easy as possible.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default DiamondDetails;
