import { useNavigate } from "react-router-dom";
import { formatDate, formatPrice } from '../../helper_function/ConvertFunction'
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import empty_image from '/src/assets/empty_image.jpg';
import styles from '/src/css/ManagerApproved.module.css';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";


const ManagerApproved = ({ order }) => {

  const navigate = useNavigate();

  const forwardQuotation = () => {
    const headers = {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
    axios.post(`${import.meta.env.VITE_jpos_back}/api/${order.id}/forward-quotation`, {}, { headers })
      .then(
        response => {
          console.log(response.data);
          navigate('/staff/request');
        }
      ).catch(
        error => {
          console.log(error);
        }
      )
  }

  //--------------------------------IMAGE THING---------------------------------------------------
  const [activeReferenceImage, setActiveReferenceImage] = useState(0);

  const handleReferenceImageMove = (direction) => {
    if (direction) {
      setActiveReferenceImage(n => n + 1);
    } else {
      setActiveReferenceImage(n => n - 1);
    }
  }
  //--------------------------------IMAGE THING---------------------------------------------------


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className='fw-bold'>
            <FontAwesomeIcon onClick={() => navigate(-1)} icon={faChevronLeft} className='me-3' id={`${styles['go-back-icon']}`} />
            Forward quotation
          </h1>
        </div>
        <div className="row mt-3">
          <div className="col-md-8">
            <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
            <h5 className='fw-semibold'>Customer name</h5>
            <p className='fs-6 ms-4'>[ID: {order.customer.customerId}] {order.customer.name}</p>
            <h5 className='fw-semibold'>Customer address</h5>
            <p className='fs-6 ms-4'>{order.customer.address}</p>
            <h5 className='fw-semibold'>Budget</h5>
            <p className='fs-6 ms-4'>{formatPrice(order.budget)}</p>
            <h5 className='fw-semibold'>Description</h5>
            <p className='fs-6'>{order.description}</p>
            <h5 className='fw-semibold'>Reference image</h5>
            {
              order.designFile === null
                ? <>
                  <img className='img-fluid' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: '100%', height: 'auto' }} />
                </>
                : <>
                  <div className="d-flex justify-content-between">
                    <button onClick={() => handleReferenceImageMove(false)} disabled={activeReferenceImage == 0} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                    <div style={{height: '400px'}}>
                      {
                        order.designFile.split("|").map((image, index) => {
                          if (index == activeReferenceImage) {
                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%' }} />
                          } else {
                            return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%', display: 'none' }} />
                          }
                        })
                      }
                    </div>
                    <button onClick={() => handleReferenceImageMove(true)} disabled={activeReferenceImage == order.designFile.split("|").length - 1} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                  </div>
                </>
            }
          </div>
          <div className="col-md-4">
            <h4 className="text-center fw-bold mb-4 mt-4">ORDER SUMMARY</h4><hr />
            {order.product !== null
              ? order.product.diamonds.map(diamond =>
                <div key={diamond.diamondId}>
                  <h5 className='fw-semibold mb-4'>Diamond #{diamond.diamondId}</h5>
                  <div className='fs-6'>
                    <p className={styles.listItem}><span>Shape:</span> <span>{diamond.shape.charAt(0).toUpperCase() + diamond.shape.slice(1)}</span></p>
                    <p className={styles.listItem}><span>Clarity:</span> <span>{diamond.clarity}</span></p>
                    <p className={styles.listItem}><span>Color:</span> <span>{diamond.color}</span></p>
                    <p className={styles.listItem}><span>Cut:</span> <span>{diamond.cut}</span></p>
                  </div>
                </div>
              )
              : <></>
            }
            <h5 className={styles.listItem}><span>Quotation price:</span> <span style={{ color: 'red' }}>{order.qdiamondPrice === null ? 'None' : formatPrice(order.qdiamondPrice)}</span></h5>
            <h5 className={styles.listItem}><span>Order price:</span> <span style={{ color: '#48AAAD' }}>{order.odiamondPrice === null ? 'None' : formatPrice(order.odiamondPrice)}</span></h5>
            <hr />
            {order.product !== null
              ? order.product.materials.map(material =>
                <div key={material.material.materialId}>
                  <h5 className='fw-semibold mb-4'>Material #{material.material.materialId}</h5>
                  <div className='fs-6' style={{ listStyle: "none" }}>
                    <p className={styles.listItem}><span>Name:</span> <span>{material.material.materialName.replaceAll("_", " ")}</span></p>
                    <p className={styles.listItem}><span>Weight:</span> <span>{material.weight}</span></p>
                  </div>
                </div>
              )
              : <>
              </>
            }
            <h5 className={styles.listItem}><span>Quotation price:</span> <span style={{ color: 'red' }}>{order.qmaterialPrice === null ? 'None' : formatPrice(order.qmaterialPrice)}</span></h5>
            <h5 className={styles.listItem}><span>Order price:</span> <span style={{ color: '#48AAAD' }}>{order.omaterialPrice === null ? 'None' : formatPrice(order.omaterialPrice)}</span></h5>
            <hr />
            <h5 className='fw-semibold mb-4'>Extra</h5>
            <div className='fs-6' style={{ listStyle: "none" }}>
              <p className={styles.listItem}><span>Extra diamonds:</span> <span>{order.ediamondPrice === null ? "None" : formatPrice(order.ediamondPrice)}</span></p>
              <p className={styles.listItem}><span>Extra materials:</span> <span>{order.ematerialPrice === null ? "None" : formatPrice(order.ematerialPrice)}</span></p>
              <p className={styles.listItem}><span>Production price:</span> <span>{order.productionPrice === null ? "None" : formatPrice(order.productionPrice)}</span></p>
            </div>

            <hr /><h5 className={styles.listItem}><span>Tax fee (10% VAT):</span> <span>{order.taxFee === null ? 'None' : formatPrice(order.taxFee)}</span></h5>
            <h5 className={styles.listItem}><span>TOTAL PRICE {formatDate(order.qdate)}:</span> <span style={{ color: '#48AAAD' }}>{order.totalAmount === null ? "None" : formatPrice(order.totalAmount)}</span></h5>
            <div className='col'>
              <button onClick={forwardQuotation} className='btn w-100' style={{ backgroundColor: '#48AAAD', color: 'white' }}>Forward to {order.customer.name}</button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};
export default ManagerApproved;
