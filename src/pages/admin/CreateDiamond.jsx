import { useEffect, useState } from "react";
import { validateString } from "../../helper_function/Validation";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import axios from "axios";
import styles from "../../css/CreateDiamond.module.css";

const CreateDiamond = () => {
    const [diamondCode, setDiamondCode] = useState('D');
    const validateDiamondCode = validateString(diamondCode, 4, 4, /^D\d{3}$/);
    const [diamondName, setDiamondName] = useState('');
    const validateDiamondName = validateString(diamondName, 8, 255, null);
    const [shape, setShape] = useState('Select shape');
    const [origin, setOrigin] = useState('Select origin');
    const [proportions, setProportions] = useState('None');
    const validateProportions = validateString(proportions, 1, 25, null);
    const [clarity, setClarity] = useState('Select clarity');
    const [color, setColor] = useState('Select color');
    const [cut, setCut] = useState('Select cut');
    const [caratWeight, setCaratWeight] = useState('');
    const [fluorescence, setFluorescence] = useState('Select fluorescence');
    const [polish, setPolish] = useState('Select polish');
    const [symmetry, setSymmetry] = useState('Select symmetry');
    const [note, setNote] = useState('None');
    const [image, setImage] = useState('');
    const [active, setActive] = useState(true);

    const [shapeList, setShapeList] = useState([]);
    const [originList, setOriginList] = useState([]);
    const [clarityList, setClarityList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [cutList, setCutList] = useState([]);
    const [fluorescenceList, setFluorescenceList] = useState([]);
    const [polishList, setPolishList] = useState([]);
    const [symmetryList, setSymmetryList] = useState([]);

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (
            validateDiamondCode.result &&
            validateDiamondName.result &&
            validateProportions.result &&
            shape !== 'Select shape' &&
            origin !== 'Select origin' &&
            clarity !== 'Select clarity' &&
            color !== 'Select color' &&
            cut !== 'Select cut' &&
            fluorescence !== 'Select fluorescence' &&
            polish !== 'Select polish' &&
            symmetry !== 'Select symmetry'
        ) {
            try {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const object = {
                    diamondCode: diamondCode,
                    diamondName: diamondName,
                    shape: shape,
                    origin: origin,
                    proportions: proportions,
                    clarity: clarity,
                    cut : cut,
                    color: color,
                    caratWeight: caratWeight,
                    fluorescence: fluorescence,
                    polish: polish,
                    symmetry: symmetry,
                    note: note,
                    image: image,
                    active: active
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/diamond/create`, object, { headers });
                if (response.status === 200) {
                    toast.success(`Creation successful`);
                    navigate(-1);
                } else {
                    toast.error(`Diamond code must be unique`);
                    console.log(response);
                }
            } catch (error) {
                toast.error(`Something went wrong. Creation failed`);
            }
        } else {
            toast.info(`Please fulfill the requirements`);
        }
    }
    
    const fetchShapeList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/shape/get-shape`);
            if(response.status === 200) {
                setShapeList(response.data);
            } else {
                toast.error(`Fetch shapes failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }
    
    const fetchCutList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/cut/get-cut`);
            if(response.status === 200) {
                setCutList(response.data);
            } else {
                toast.error(`Fetch cuts failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }

    const fetchOriginList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/origin/get-origin`);
            if(response.status === 200) {
                setOriginList(response.data);
            } else {
                toast.error(`Fetch origins failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }

    const fetchClarityList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/clarity/get-clarity`);
            if(response.status === 200) {
                setClarityList(response.data);
            } else {
                toast.error(`Fetch clarity failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }

    const fetchColorList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/color/get-color`);
            if(response.status === 200) {
                setColorList(response.data);
            } else {
                toast.error(`Fetch color failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }
    
    const fetchFluorescenceList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/fluorescence/get-fluorescence`);
            if(response.status === 200) {
                setFluorescenceList(response.data);
            } else {
                toast.error(`Fetch fluorescence failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }
    
    const fetchPolishList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/polish/get-polish`);
            if(response.status === 200) {
                setPolishList(response.data);
            } else {
                toast.error(`Fetch polish failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }

    const fetchSymmetryList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/public/symmetry/get-symmetry`);
            if(response.status === 200) {
                setSymmetryList(response.data);
            } else {
                toast.error(`Fetch symmetry failed. Please try again`);
            }
        } catch (error) {
            toast.error(`Something went wrong. Fetching failed`);
        }
    }
    
    useEffect(() => {
        fetchShapeList();
        fetchOriginList();
        fetchClarityList();
        fetchColorList();
        fetchCutList();
        fetchFluorescenceList();
        fetchPolishList();
        fetchSymmetryList();
    }, [])

    return (
        <div className="container-fluid">

            <div className="row">

                <h1 className="d-flex align-items-center justify-content-center p-0 mt-5 mb-5 col">
                    <FontAwesomeIcon onClick={() => navigate(-1)} className='me-3 mb-1' icon={faLeftLong} id={`${styles['back-btn']}`} />
                    <span className="text-center flex-grow-1">Create Diamond</span></h1>
            </div>
            <div className="row">
                <div className="row mb-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Diamond Code</span>
                                <input value={diamondCode} onChange={(e) => setDiamondCode(e.target.value)} type="text" className='form-control' />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateDiamondCode.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Diamond Name</span>
                                <input value={diamondName} onChange={(e) => setDiamondName(e.target.value)} className='form-control' type="text" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateDiamondName.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Proportions</span>
                                <input value={proportions} onChange={(e) => setProportions(e.target.value)} className='form-control' type="text" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateProportions.reason}</div>
                        </div>
                        
                        
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Shape</span>
                                <select value={shape} onChange={(e) => setShape(e.target.value)} className='form-select'>
                                    <option value="Select shape"> Select shape</option>
                                    {   
                                        shapeList !== null ?
                                        shapeList.map((shapes, index) => (
                                            <option key={index} value={shapes}>
                                                {shapes}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Origin</span>
                                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className='form-select'>
                                    <option value="Select origin"> Select origin</option>
                                    {   
                                        originList !== null ?
                                        originList.map((origins, index) => (
                                            <option key={index} value={origins}>
                                                {origins}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Clarity</span>
                                <select value={clarity} onChange={(e) => setClarity(e.target.value)} className='form-select'>
                                    <option value="Select clarity"> Select clarity</option>
                                    {   
                                        clarityList !== null ?
                                        clarityList.map((clarity, index) => (
                                            <option key={index} value={clarity}>
                                                {clarity}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Color</span>
                                <select value={color} onChange={(e) => setColor(e.target.value)} className='form-select'>
                                    <option value="Select color"> Select color</option>
                                    {   
                                        colorList !== null ?
                                        colorList.map((color, index) => (
                                            <option key={index} value={color}>
                                                {color}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Cut</span>
                                <select value={cut} onChange={(e) => setCut(e.target.value)} className='form-select'>
                                    <option value="Select cut"> Select cut</option>
                                    {   
                                        cutList !== null ?
                                        cutList.map((cut, index) => (
                                            <option key={index} value={cut}>
                                                {cut}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Fluorescence</span>
                                <select value={fluorescence} onChange={(e) => setFluorescence(e.target.value)} className='form-select'>
                                    <option value="Select fluorescence"> Select fluorescence</option>
                                    {   
                                        fluorescenceList !== null ?
                                        fluorescenceList.map((fluorescence, index) => (
                                            <option key={index} value={fluorescence}>
                                                {fluorescence}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Polish</span>
                                <select value={polish} onChange={(e) => setPolish(e.target.value)} className='form-select'>
                                    <option value="Select polish"> Select polish</option>
                                    {   
                                        polishList !== null ?
                                        polishList.map((polish, index) => (
                                            <option key={index} value={polish}>
                                                {polish}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Symmetry</span>
                                <select value={symmetry} onChange={(e) => setSymmetry(e.target.value)} className='form-select'>
                                    <option value="Select symmetry"> Select symmetry</option>
                                    {   
                                        symmetryList !== null ?
                                        symmetryList.map((symmetry, index) => (
                                            <option key={index} value={symmetry}>
                                                {symmetry}
                                            </option>
                                        )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Carat weight</span>
                                <input value={caratWeight} onChange={(e) => setCaratWeight(e.target.value)} className='form-control' type="text" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Note</span>
                                <input value={note} onChange={(e) => setNote(e.target.value)} className='form-control' type="text" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Image</span>
                                <input value={image} onChange={(e) => setImage(e.target.value)} className='form-control' type="text" />
                            </div>
                        </div>
                        <button className='mt-2 btn btn-primary w-100' onClick={handleCreate}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateDiamond;