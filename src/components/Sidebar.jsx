import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faClockRotateLeft, faCircleExclamation, faGem, faHammer, faRing, faCube } from '@fortawesome/free-solid-svg-icons';
import img from '../assets/FullLogo.png';
import smallLogo from '/src/assets/Logo.png';
import styles from '../css/Sidebar.module.css';
import { useState } from 'react';

const Sidebar = ({ styling, width, setWidth }) => {

    const navigate = useNavigate();
    const location = useLocation().pathname.split('/');
    const [staff, setStaff] = useState(JSON.parse(sessionStorage.getItem('staff')));
    const [collapse, setCollapse] = useState(true);

    const logout = () => {
        sessionStorage.clear();
        navigate('/');
    }
    return (
        <>
            <div className="d-flex flex-column p-3 vh-100"
                style={styling}
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
                    {
                        staff.staffType !== 'manage'
                            ? <>
                                <li className={`text-truncate container-fluid p-0 ${collapse ? 'text-center fs-4' : ''}`}>
                                    <Link to="/staff/request" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('request') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faInbox} />
                                        {collapse ? '' : 'Requests'}
                                    </Link>
                                    <Link to="/staff/history" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('history') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faClockRotateLeft} />
                                        {collapse ? '' : 'History'}
                                    </Link>
                                </li>
                            </>
                            : <>
                                <li className={`text-truncate container-fluid p-0 ${collapse ? 'text-center fs-4' : ''}`}>
                                    <Link to="/staff/manage-requests" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-requests') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faCircleExclamation} />
                                        {collapse ? '' : 'Manage requests'}
                                    </Link>
                                    <Link to="/staff/manage-price" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-price') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faGem} />
                                        {collapse ? '' : 'Diamond prices'}
                                    </Link>
                                    <Link to="/staff/manage-material-price" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-material-price') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faRing} />
                                        {collapse ? '' : 'Material prices'}
                                    </Link>
                                    <Link to="/staff/manage-design-price" className={`rounded-0 ${styles['nav-link']} nav-link ${collapse ? '' : 'py-3 pe-3'} my-1 ${location.includes('manage-design-price') ? styles['active'] : ''}`}>
                                        <FontAwesomeIcon className={`${collapse ? '' : 'me-3'}`} icon={faCube} />
                                        {collapse ? '' : 'Design prices'}
                                    </Link>
                                </li>
                            </>
                    }
                </ul>
                {
                    collapse
                        ? <></>
                        : <div className="dropdown">
                            <a href="#" className={`${styles['user']} text-truncate d-flex align-items-center text-decoration-none dropdown-toggle`} id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <h4><strong>{staff.name}</strong></h4>
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

export default Sidebar;