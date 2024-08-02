import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from "../assets/textLogo.png";
import styles from '/src/css/NavigationBar.module.css';

const NavigationBar = () => {
    const location = useLocation().pathname;
    const [customer, setCustomer] = useState(JSON.parse(sessionStorage.getItem('customer')));
    const navigate = useNavigate();
    const [dropDown, setDropdown] = useState(false);

    useEffect(() => {
        setCustomer(JSON.parse(sessionStorage.getItem('customer')));
    }, [location])

    return (
        <>
            <nav className={`${styles['navbar']} navbar navbar-expand-xl fixed-top`}>
                <div className="container-fluid">
                    <Link to='/' className={`${styles['navbar-brand']} navbar-brand`}><img src={logo} alt="Logo" style={{ width: '16vw', height: 'auto' }} /></Link>

                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel"><img src={logo} alt="Logo" style={{ width: '95px', height: 'auto' }} /></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <Link className={`${styles[`nav-link`]} nav-link mx-lg-2 active`} aria-current="page" to="/">HOME</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`${styles['nav-link']} nav-link mx-lg-2`} to="/diamond-price-list">DIAMOND PRICE LIST</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`${styles['nav-link']} nav-link mx-lg-2`} to="/material-price-list">MATERIAL PRICE LIST</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`${styles[`nav-link`]} nav-link mx-lg-2`} to="/custom-design">CUSTOM DESIGN</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`${styles[`nav-link`]} nav-link mx-lg-2`} to="/build-your-own/choose-setting">BUILD JEWELERY</Link>
                                </li>
                                {
                                    customer !== null
                                        ? <>
                                            <li className="nav-item">
                                                <Link className={`${styles[`nav-link`]} nav-link mx-lg-2`} to="/profile">ACCOUNT</Link>
                                            </li>
                                        </>
                                        : <>
                                        </>
                                }

                            </ul>
                        </div>
                    </div>
                    <div className='navbar-bar'>
                        <div className={`${styles['login-button']} login-button`}>
                            {
                                customer != null
                                    ? <>
                                        <div className="nav-item dropdown">
                                            <div className={`${styles['nav-link']} nav-link dropdown-toggle`} role="button" aria-expanded="false" onClick={() => setDropdown(d => !d)}>
                                                {customer.name}
                                            </div>
                                            <ul className={dropDown == false ? "dropdown-menu" : "dropdown-menu show"}>
                                                <li><a className="dropdown-item" onClick={() => {
                                                    sessionStorage.clear();
                                                    setCustomer(null);
                                                    navigate("/");
                                                }} style={{ cursor: 'pointer' }}>Logout</a></li>
                                            </ul>
                                        </div>
                                    </>
                                    : <>
                                        <div className='nav-item'>
                                            <Link className={`${styles[`nav-login`]} nav-login`} to='/login'>LOGIN/REGISTER</Link>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                    <button className={styles['navbar-toggler'] + " navbar-toggler"} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        </>
    )

}

export default NavigationBar;