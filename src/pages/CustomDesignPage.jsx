import NavigationBar from "../components/NavigationBar";
import { useState, useEffect, act } from 'react';
import { Toaster, toast } from 'sonner';
import img from '../assets/jewelry_manufacturing_process.png';
import img1 from '../assets/computer sample.png';
import img2 from '../assets/3d_printed_jewerly.png';
import img3 from '../assets/heated.png';
import img4 from '../assets/crafted_ring.png';
import img5 from '../assets/custom_process.jpg';
import img6 from '../assets/polishing_fine_jewerly.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../components/Title";
import styles from '/src/css/CustomDesignPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const CustomDesignPage = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(JSON.parse(sessionStorage.getItem('customer')));

    const [designFiles, setDesignFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(500);
    const [processing, setProcessing] = useState(false);

    const [activeImage, setActiveImage] = useState(0);

    useDocumentTitle("Design Your Own Jewelry");

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const uploadImages = async () => {
        if (sessionStorage.getItem('customer') == null) {
            toast.info(`Please sign in to continue`);
            navigate("/login");
            return;
        }
        setImageUrls([]);
        setProcessing(true);
        try {
            if (designFiles.length > 0) {
                for (const file of designFiles) {
                    const formData = new FormData();
                    formData.append("file", file)
                    const headers = {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                    const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/upload`, formData, { headers });
                    if (!response.data || response.status === 204) {
                        throw new Error("Upload file failed. Backend fail");
                    }
                    setImageUrls(arr => [...arr, response.data]);
                }
            } else {
                toast.info(`Please select at least 1 image!`);
            }
        } catch (error) {
            console.log(error);
        }
        setProcessing(false);
    }

    const handleImageMove = (direction) => {
        if (direction) {
            setActiveImage(n => n + 1);
        } else {
            setActiveImage(n => n - 1);
        }
    }

    const submitForm = () => {
        if (customer == null) {
            toast.info(`Please log in to continue!`);
            navigate("/login");
        } else {
            if (description.trim().length > 0 &&
                budget >= 500
                && imageUrls.length > 0
            ) {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                axios.post(`${import.meta.env.VITE_jpos_back}/api/send-request`,
                    {
                        customerId: customer.customerId,
                        designFile: imageUrls.join("|"),
                        description: description,
                        budget: budget
                    },
                    {
                        headers
                    }
                ).then(
                    response => {
                        toast.success('Form submitted successfully!');
                        setDesignFiles([]);
                        setDescription('');
                        setBudget(500);
                        setImageUrls([]);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        toast.error("Something went wrong! Please try again");
                    }
                )
            } else {
                if (imageUrls.length <= 0) {
                    toast.error(`Please select at least one image!`);
                }
                if (description.trim().length <= 0) {
                    toast.error(`Description cannot be empty! You need to describe your product`);
                }
                if (budget < 500) {
                    toast.error(`Budget must be minimum $500 (We don't make custom models for under)`);
                }
            }
        }
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md" style={{ marginLeft: '5vw' }}>
                        <h1 className="text-center">Design your own</h1>
                        <div>
                            <div className="mb-3">
                                <label className="form-label">Give us reference images of your idea</label>
                                <input type="file" className="form-control rounded-0 mb-3" multiple accept="image/*" onChange={(e) => setDesignFiles(e.target.files)} />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <button onClick={() => handleImageMove(false)} disabled={activeImage == 0} hidden={imageUrls.length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                    <div style={{ height: '400px', width: '400px' }}>
                                        {
                                            imageUrls.length > 0
                                                ? imageUrls.map((image, index) => {
                                                    if (activeImage == index) {
                                                        return (
                                                            <img className="img-fluid" key={index} src={image} crossOrigin="anonymous" style={{ width: 'auto', height: "100%" }} />
                                                        )
                                                    } else {
                                                        return (
                                                            <img className="img-fluid" key={index} src={image} crossOrigin="anonymous" style={{ display: 'none' }} />
                                                        )
                                                    }
                                                })
                                                : <p className="m-3">Image Not provided</p>
                                        }
                                    </div>
                                    <button onClick={() => handleImageMove(true)} disabled={activeImage == imageUrls.length - 1} hidden={imageUrls.length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                </div>
                                {
                                    processing
                                        ? < button className={`w-100 ${styles['custom-button']}`} style={{ border: "none" }} type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            <span role="status">Loading...</span>
                                        </button>
                                        : <button className={`w-100 ${styles['custom-button']}`} style={{ borderColor: '#48AAAD' }} onClick={uploadImages} >Upload image</button>
                                }
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Describe details of what you want</label>
                                <textarea style={{ resize: "none" }} className="form-control rounded-0" value={description} onChange={handleDescription} rows='5' cols='30' aria-label="description"></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">What's your budget? Minimum value: $500</label>
                                <input className="form-control rounded-0" type="number" min={500} value={budget} onChange={(e) => setBudget(e.target.value)} />
                            </div>
                            <div>
                                <button className={`w-100 ${styles['dark-custom-button']}`} onClick={submitForm}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md" style={{ marginRight: '5vw' }}>
                        <img src={img} className="img-fluid" />
                    </div>
                </div>
                <div>
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">Designing a 3D Jewelry Model</h2>
                            <p style={{ textAlign: 'justify' }}>
                                After the initial idea and/or sketch is developed, it's time to start work on the digital model.
                                Depending on the complexity of the project and how busy the studio or artist is, this can take
                                anywhere from a day to a week.
                            </p>
                            <p style={{ textAlign: 'justify' }}>
                                While this step is great for you to see your jewelry before committing to full production, keep in
                                mind the 3d model is made for functionality first, not aesthetics, so it might not look as pretty as
                                your finished piece! That being said, you can always request a more detailed render.
                            </p>
                            <img src={img1} className="img-fluid mt-3" />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">3D Wax Printing Your Jewelry</h2>
                            <p style={{ textAlign: 'justify' }}>
                                Not only was the previous step's 3D model intended for your preview, but it also forms the foundation for the subsequent
                                step—the wax model. The majority of contemporary jewelry manufacturing involves the producer creating a resin-based wax model
                                using a 3D printer, which often takes no longer than 48 hours.
                            </p>
                            <img src={img2} className="img-fluid mt-3" />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">Casting the wax model into Metal</h2>
                            <p style={{ textAlign: 'justify' }}>The jewelry is put through the casting process in the following phase. At this point, your creation begins to resemble jewelry that
                                you may find in a store. The wax is removed and replaced with your preferred metal—typically platinum, silver, or gold—in a molten state.
                                After that, the metal on your jewelry hardens into its shape. We refer to this process as "lost wax" casting.
                            </p>
                            <img src={img3} className="img-fluid mt-3" />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">Basic Jewelry Assembly</h2>
                            <p style={{ textAlign: 'justify' }}>
                                It may take three days to three weeks for your jewelry to be finally fabricated after it has completed the design and casting stages.
                                The jeweler now refines the ring's, necklace's, or other piece's main framework. In order to expose the metal beneath the casting skin,
                                the jeweler files it down. Even if casting turned the jewelry into fine metal, the jeweler still needs to check that the piece can support gemstones
                                in a functional manner and make any necessary aesthetic adjustments.
                            </p>
                            <p>
                                When the jewelry is finished mounting, the stones can be placed. Before setting, any enameling or further design work on the object would be completed.
                            </p>
                            <img src={img4} className="img-fluid mt-3" />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">The Stone Setting Process</h2>
                            <p style={{ textAlign: 'justify' }}>
                                The diamond setter inserts the diamonds or other jewels to your item in this final stage. He inserts the center stone into the mount with great care.
                                Before setting, the setter must manually drill for any side stones that may be involved. They next placed each individual stone under a microscope.
                            </p>
                            <img src={img5} className="img-fluid mt-3" />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-8 text-center">
                            <h2 className="mb-4">Polishing, Finishing, and Quality Assurance</h2>
                            <p style={{ textAlign: 'justify' }}>
                                A polisher works to ensure that the metal is flawlessly polished and as shiny as possible during the last stage. Final embellishments like engravings are
                                also applied. At last, the jewelry is examined and every aspect is examined to ensure that the production process was successful.
                            </p>
                            <img src={img6} className="img-fluid mt-3" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomDesignPage;
