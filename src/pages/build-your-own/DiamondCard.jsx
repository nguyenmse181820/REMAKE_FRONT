import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '/src/css/DiamondCard.module.css';
import { formatPrice } from '../../helper_function/ConvertFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnity } from '@fortawesome/free-brands-svg-icons';

const DiamondCard = ({ diamond, isSelected, onClick }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.card} ${isSelected ? styles.selected : ''}`} onClick={() => onClick(diamond.diamondId, !isSelected)}>
            <div className='position-relative'>

                <img crossOrigin='anonymous' style={{ height: 'auto', width: '100%' }} src={diamond.image.split("|")[0]} alt="diamond" />

                <FontAwesomeIcon hidden={diamond.image.split("|").length <= 1} icon={faUnity} style={{ marginLeft: '1rem', marginTop: '1rem', fontSize: '2rem' }} className='position-absolute start-0 top-0' />
            </div>
            <div className={styles.cardBody}>
                <p className={`fs-6  ${styles.cardTitle}`}> {diamond.origin.charAt(0).toUpperCase() + diamond.origin.slice(1).toLowerCase().replace("_", " ")} {diamond.caratWeight} {diamond.color}-{diamond.clarity} {diamond.cut.replace("_", " ")} Cut {diamond.shape} Diamond</p>
                <div className='text-center'>
                    <div className={`${styles.cardStatus}`}>
                        {isSelected ? 'Selected' : 'Select'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiamondCard;
