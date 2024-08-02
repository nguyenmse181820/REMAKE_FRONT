import React from 'react';
import styles from '/src/css/Footer.module.css';
import textLogo from '/src/assets/textLogo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <div className="container">
        <hr />
        <div className="row mb-5">
          
          <p className='fw-semibold text-center'><i>&copy; 2024 Bijoux Inc.</i></p>
        </div>
        
        <div className={`d-flex justify-content-center align-items-center ${styles.textCenter}`}>
          <img src={textLogo} alt="Text Logo" className="mx-auto d-block" style={{ width: '70vw', height: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
