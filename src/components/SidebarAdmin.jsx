import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faClockRotateLeft, faCircleExclamation, faUsers, faMoneyBill, faGem, faGauge, faDiamond, faRing, faHammer, faWrench } from '@fortawesome/free-solid-svg-icons';
import img from '../assets/FullLogo.png';
import smallLogo from '/src/assets/Logo.png';
import styles from '../css/Sidebar.module.css';
import { useEffect, useState } from 'react';

const SidebarAdmin = ({ styling, width, setWidth }) => {

    const navigate = useNavigate();
    const location = useLocation().pathname.split('/');
    const admin = sessionStorage.getItem('admin') !== null ? JSON.parse(sessionStorage.getItem('admin')) : null;
    const [collapse, setCollapse] = useState(true);

    const logout = () => {
        sessionStorage.clear();
        navigate('/');
    }

    return (
        <>
            <div className="d-flex flex-column p-3 vh-100" style={styling}
                onMouseEnter={() => {
                    setWidth('230px');
                    setCollapse(false);
                }}
                onMouseLeave={() => {
                    setWidth('100px');
                    setCollapse(true);
                }}
            >

                <Link to="#" className="d-flex align-items-center mb-4 text-decoration-none w-100">
                    {
                        collapse
                        ? <img src={smallLogo} className='img-fluid mx-auto mt-3' style={{ width: '40px' }} />
                        : <img src={img} className='img-fluid mx-auto mt-3' style={{ width: '100px' }} />
                    }
                </Link>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className={`text-truncate container-fluid p-0 ${collapse ? 'text-center fs-4' : ''}`}>
                        <Link to="/admin/dashboard" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('dashboard') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faGauge} />
                            {collapse ? '' : 'Dashboard'}
                        </Link>
                        <Link to="/admin/manage-staff" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-staff') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faWrench} />
                            {collapse ? '' : 'Manage staff'}
                        </Link>
                        <Link to="/admin/manage-customer" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-customer') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faUsers} />
                            {collapse ? '' : 'Manage customer'}
                        </Link>
                        <Link to="/admin/manage-diamonds" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-diamonds') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faGem} />
                            {collapse ? '' : 'Manage diamonds'}
                        </Link>
                        <Link to="/admin/manage-materials" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-materials') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faHammer} />
                            {collapse ? '' : 'Manage materials'}
                        </Link>
                        <Link to="/admin/manage-designs" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-designs') ? styles['active'] : ''}`}>
                            <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faRing} />
                            {collapse ? '' : 'Manage designs'}
                        </Link>
                    </li>
                </ul>
                {
                    collapse
                        ? <></>
                        : <div className="dropdown">
                            <a href="#" className={`${styles['user']} d-flex align-items-center text-decoration-none dropdown-toggle`} id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">

                                <h4 className='text-capitalize'><strong>{admin.username}</strong></h4>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                                <li><a onClick={logout} className="dropdown-item" href="#">Sign out</a></li>
                            </ul>
                        </div>
                }
            </div>
        </>
    )
}

export default SidebarAdmin;