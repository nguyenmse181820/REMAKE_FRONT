import styles from '/src/css/UnauthorizedAccess.module.css';
import backgroundImage from '/src/assets/wedding_rings.jpg';
import { useNavigate } from 'react-router-dom';

const UnauthorizedAccess = () => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid position-relative p-0" id={styles['unauthorized-access']}>
            <h1 className='position-absolute w-100 text-center' id={`${styles['ua-title']}`}>Unauthorized Access</h1>
            <div className='position-absolute w-100 text-center' id={styles['ua-button']}>
                <button onClick={() => navigate('/')}>Go back</button>
            </div>
            <img src={backgroundImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        </div>
    )
}

export default UnauthorizedAccess;