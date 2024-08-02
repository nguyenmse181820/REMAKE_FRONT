import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '../../helper_function/ConvertFunction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faChevronLeft, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from '/src/css/WaitSaleStaff.module.css';
import empty_image from '/src/assets/empty_image.jpg';
import { fetchDiamondPrice, fetchMaterialPrice } from '../../helper_function/FetchPriceFunctions';
import useDocumentTitle from '../../components/Title';
import { LinearProgress, Pagination, Slider } from '@mui/material';

const DEFAULT_PAGE_NO = 0;
const DEFAULT_PAGE_SIZE = 40;

const MIN_CARAT = 0.05;
const MAX_CARAT = 5.05;
const CARAT_STEP = 0.1;
let carat_ranges = []

for (let i = MIN_CARAT; i <= MAX_CARAT; i += CARAT_STEP) {
    let first_num = i.toFixed(2);
    let second_num = (i + CARAT_STEP).toFixed(2);
    carat_ranges = [...carat_ranges, first_num + "-" + second_num];
}

const WaitSaleStaff = ({ order }) => {

    const navigate = useNavigate();

    const [staff, setStaff] = useState(JSON.parse(sessionStorage.getItem('staff')));
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');

    const [materialWeight, setMaterialWeight] = useState(0);
    const [currentMaterial, setCurrentMaterial] = useState('');
    const [extraPrice, setExtraPrice] = useState({ material: 0, diamond: 0, production: 0, markupRate: 1.0 });
    const [materialList, setMaterialList] = useState([]);

    const [diamondList, setDiamondList] = useState([]);
    const [chosenDiamonds, setChosenDiamonds] = useState([]);
    const [chosenMaterials, setChosenMaterials] = useState([]);
    const [totalMaterialPrice, setTotalMaterialPrice] = useState(0);
    const [totalDiamondPrice, setTotalDiamondPrice] = useState(0);

    const [shape, setShape] = useState('all');
    const shapes = ['round', 'princess', 'cushion', 'emerald', 'oval', 'radiant', 'asscher', 'marquise', 'heart', 'pear'];

    const [minPrice, setMinPrice] = useState(200);
    const [maxPrice, setMaxPrice] = useState(5000000);

    const [carat, setCarat] = useState(0);

    const colors = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'];
    const [beginColor, setBeginColor] = useState(0);
    const [endColor, setEndColor] = useState(colors.length - 1);

    const clarities = ['I3', 'I2', 'I1', 'SI3', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
    const [beginClarity, setBeginClarity] = useState(0);
    const [endClarity, setEndClarity] = useState(clarities.length - 1);

    const cuts = ['Fair', 'Good', 'Very_Good', 'Excellent'];
    const [beginCut, setBeginCut] = useState(0);
    const [endCut, setEndCut] = useState(cuts.length - 1);

    const [origin, setOrigin] = useState('NATURAL')
    const origins = ['NATURAL', 'LAB_GROWN']

    const [pageNo, setPageNo] = useState(DEFAULT_PAGE_NO);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const totalPage = parseInt(diamondList.length / pageSize) + 1

    const [processing, setProcessing] = useState(false);
    const [isFinishedLoading, setIsFinishedLoading] = useState(true);

    useDocumentTitle("Manager Request Quotation");

    console.log(diamondList);

    const DiamondList = () => {
        if (diamondList.length > 0) {
            return diamondList.slice(pageNo * pageSize, pageNo * pageSize + pageSize).map((diamond, index) => (
                <tr key={index}>
                    <td className='col-md'>{diamond.diamond.diamondId}</td>
                    <td className='col-md'>{diamond.diamond.shape.charAt(0).toUpperCase() + diamond.diamond.shape.slice(1)}</td>
                    <td className='col-md'>{diamond.diamond.color}-{diamond.diamond.clarity} {diamond.diamond.cut.replace("_", " ")} {diamond.diamond.caratWeight} Carat</td>
                    <td className='col-md'>{formatPrice(diamond.latestPrice)}</td>
                    <td className='col-md'>{formatDate(diamond.effectiveDate)}</td>
                    <td className='col-md'>
                        {
                            chosenDiamonds.find(d => d.id == diamond.diamond.diamondId) == null
                                ? <>
                                    <button
                                        className='btn btn-success rounded-0'
                                        onClick={() => {
                                            setChosenDiamonds(l => [...l,
                                            {
                                                id: diamond.diamond.diamondId,
                                                name: `${diamond.diamond.shape.charAt(0).toUpperCase() + diamond.diamond.shape.slice(1)} ${diamond.diamond.color}-${diamond.diamond.clarity} ${diamond.diamond.cut.replace("_", " ")} ${diamond.diamond.caratWeight} Carat`,
                                                price: diamond.latestPrice
                                            }
                                            ])
                                            setTotalDiamondPrice(p => p + diamond.latestPrice);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </>
                                : <>
                                    <button
                                        className='btn btn-danger rounded-0'
                                        onClick={() => {
                                            setChosenDiamonds(l => l.filter(entry => entry.id !== diamond.diamond.diamondId));
                                            setTotalDiamondPrice(p => p - diamond.latestPrice);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </>
                        }
                    </td>
                </tr>
            ))
        } else if (isFinishedLoading) {
            return (
                <tr>
                    <td colSpan={6}><p className='fs-4 text-center'>No diamonds available for this setting.</p></td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td colSpan={6}>
                        <LinearProgress />
                    </td>
                </tr>
            )
        }
    }

    const fetchQuery = async () => {
        setIsFinishedLoading(false);
        let carat_split = carat_ranges[carat].split("-");
        const query = {
            origin: origin,
            shapeList: shape == "all" ? shapes : [shape],
            colorList: [...colors.slice(beginColor, endColor), colors[endColor]],
            clarityList: [...clarities.slice(beginClarity, endClarity), clarities[endClarity]],
            cutList: [...cuts.slice(beginCut, endCut), cuts[endCut]],
            minCarat: parseFloat(carat_split[0]),
            maxCarat: parseFloat(carat_split[1]),
            minPrice: minPrice,
            maxPrice: maxPrice
        }
        console.log(query);
        try {
            setDiamondList([]);
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/diamond/get-diamond-with-price-by-4C`, query, { headers });
            if (!response.data || response.status === 204) {
                console.log(`Cannot fetch diamonds`);
            } else {
                console.log(response.data);
                setDiamondList(d => response.data);
            }
        } catch (error) {
            console.log(error);
        }
        setIsFinishedLoading(true);
    }

    useEffect(() => {
        fetchQuery();
    }, [shape, origin, beginColor, endColor, beginClarity, endClarity, carat, minPrice, maxPrice])

    useEffect(() => {
        fetchMaterials();
    }, [])

    const finalSubmit = async () => {
        if (productName.trim().length > 0 &&
            productType.trim().length > 0 &&
            chosenDiamonds.length > 0 &&
            chosenMaterials.length > 0 &&
            extraPrice.production >= 0 &&
            extraPrice.diamond >= 0 &&
            extraPrice.markupRate > 0 &&
            extraPrice.material >= 0) {
            try {
                setProcessing(true);
                const productDTO = {
                    productName: productName,
                    productType: productType,
                    ediamondPrice: extraPrice.diamond,
                    ematerialPrice: extraPrice.material,
                    productionPrice: extraPrice.production,
                    markupRate: extraPrice.markupRate,
                    diamondIds: chosenDiamonds.map(diamond => diamond.id),
                    materialsIds: chosenMaterials.map(material => ({ first: material.id, second: material.weight }))
                }

                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/product/save`, productDTO, { headers });
                if (!response.data || response.status === 204) {
                    throw new Error(`Product creation failed. Backend did not return id`);
                }

                const finalOrder = {
                    ...order,
                    productionPrice: extraPrice.production,
                    markupRate: extraPrice.markupRate,
                    taxFee: (totalDiamondPrice + totalMaterialPrice + extraPrice.material + extraPrice.diamond + extraPrice.production) * extraPrice.markupRate * 0.1,
                    totalAmount: (totalDiamondPrice + totalMaterialPrice + extraPrice.material + extraPrice.diamond + extraPrice.production) * extraPrice.markupRate * 1.1,
                    ematerialPrice: extraPrice.material,
                    ediamondPrice: extraPrice.diamond,
                    qdiamondPrice: totalDiamondPrice,
                    qmaterialPrice: totalMaterialPrice
                }


                const response2 = await axios.post(`${import.meta.env.VITE_jpos_back}/api/sales/orders/${staff.staffId}/${response.data}`, finalOrder, { headers });
                if (!response.data || response.status === 204) {
                    throw new Error(`Order update failed. Backend did not return order`);
                }
                navigate("/staff/request");

            } catch (error) {
                toast.error(`Something went wrong! Can't complete order`);
                console.log(error);
            }
        } else {
            if (productName.trim().length <= 0) {
                toast.info(`Product needs a name!`);
            }
            if (productType.trim().length <= 0) {
                toast.info(`You haven't selected any product type`);
            }
            if (extraPrice.markupRate <= 0) {
                toast.info(`Markup rate cannot be below 0`);
            }
            if (chosenDiamonds.length <= 0) {
                toast.info(`You haven't chosen any diamonds`);
            }
            if (chosenMaterials.length <= 0) {
                toast.info(`You haven't chosen any materials`);
            }
        }
        setProcessing(false);
    }

    const removeMaterial = (id, price) => {
        setChosenMaterials(oldList => oldList.filter(material => material.id !== id));
        setTotalMaterialPrice(prevPrice => prevPrice - price);
    }

    const chooseMaterial = async () => {
        if (!chosenMaterials.some(material => material.id === currentMaterial)) {
            if (currentMaterial.length > 0 && materialWeight > 0) {
                const price = await fetchMaterialPrice(currentMaterial) * materialWeight;
                const newMaterial = {
                    id: currentMaterial,
                    weight: materialWeight,
                    price: price
                }
                setChosenMaterials(oldList => [...oldList, newMaterial]);
                setTotalMaterialPrice(prevPrice => prevPrice + newMaterial.price);
            } else {
                toast.info(`Please fill in material and weight`);
            }
        } else {
            toast.error(`Material already added`);
        }
    }

    const fetchMaterials = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/material/all`, { headers });
            if (response.status === 204) {
                console.log("No data");
            } else {
                setMaterialList(response.data);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleMaterial = (event) => {
        setCurrentMaterial(event.target.value);
    }

    const handleMaterialWeight = (event) => {
        setMaterialWeight(event.target.value);
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
        <div className={`${styles['wait-sale-staff']}`}>
            <div className="row">
                <h1 className='fw-bold'>
                    <FontAwesomeIcon onClick={() => navigate('/staff/request')} icon={faChevronLeft} className='me-3' id={`${styles['go-back-icon']}`} />
                    Request Quotation
                </h1>
            </div>
            <div className='container-fluid'>
                <div className='row'>
                    <h4 className="text-center fw-bold mb-4 mt-4">CUSTOMER INFORMATION</h4><hr />
                    <div className="col-md">
                        <p className='fs-5 fw-semibold'>
                            Full Customer Name
                        </p>
                        <p className="px-3 fs-6">{order.customer.name}</p>
                        <p className='fs-5 fw-semibold'>
                            Description
                        </p>
                        <textarea readOnly value={order.description.trim()} style={{ resize: "none" }} className="form-control mb-3 px-3 fs-6 rounded-0" rows='10' cols='30' aria-label="description"></textarea>
                        <p className='fs-5 fw-semibold'>
                            Budget
                        </p>
                        <p className="px-3 fs-6">{formatPrice(order.budget)}</p>
                    </div>
                    <div className='col-md'>
                        <p className='fs-5 fw-semibold'>
                            Reference image
                        </p>
                        {
                            order.designFile === null
                                ? <>
                                    <img className='img-fluid d-block mx-auto' src={order.designFile === null ? empty_image : order.designFile} alt="" style={{ width: 'auto', height: '400px' }} />
                                </>
                                : <>
                                    <div className="d-flex justify-content-between border">
                                        <button onClick={() => handleReferenceImageMove(false)} disabled={activeReferenceImage == 0} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretLeft} /></button>
                                        <div style={{height: '400px'}}>
                                            {
                                                order.designFile.split("|").map((image, index) => {
                                                    if (index == activeReferenceImage) {
                                                        return <img key={index} className='img-fluid' src={image} alt="" style={{ width: 'auto', height: '100%' }} />
                                                    } else {
                                                        return <img key={index} className='img-fluid' src={image} alt="" style={{ width: '100%', height: 'auto', display: 'none' }} />
                                                    }
                                                })
                                            }
                                        </div>
                                        <button onClick={() => handleReferenceImageMove(true)} disabled={activeReferenceImage == order.designFile.split("|").length - 1} hidden={order.designFile.split("|").length <= 0} className={`${styles['image-btn']}`}><FontAwesomeIcon icon={faCaretRight} /></button>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <h4 className="text-center fw-bold mb-4 mt-4">ORDER INFORMATION</h4><hr />
                <div className="col-md-7">
                    <div className="container-fluid">
                        <p className='fs-5 fw-semibold'>Basic information</p>
                        <div className="row mb-2">
                            <div className="col-md fs-6 ms-4">Product name</div>
                            <div className="col-md"><input className='form-control rounded-0' type='text' placeholder='Enter name...' value={productName} onChange={(e) => setProductName(e.target.value)} /></div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md fs-6 ms-4">Product type</div>
                            <div className="col-md">
                                <select value={productType} onChange={(e) => setProductType(e.target.value)} className="form-select rounded-0">
                                    <option value=''>Choose product type</option>
                                    {['ring', 'necklace', 'earrings', 'bracelets'].map(value => (<option key={value} value={value}>{value}</option>))}
                                </select>
                            </div>
                        </div>
                        <p className='fs-5 fw-semibold'>Main Diamond Quality</p>

                        <div className="row mb-2">
                            <div className="col-md fs-6 ms-4">Shape</div>
                            <select value={shape} onChange={(e) => setShape(e.target.value)} className='form-select rounded-0 col mx-3 fs-6 ms-4'>
                                <option value="all">All</option>
                                {shapes.map((value, index) =>
                                    <option key={index} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
                                )}
                            </select>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md fs-6 ms-4">Origin</div>
                            <select value={origin} onChange={(e) => setOrigin(e.target.value)} className='form-select rounded-0 col mx-3 fs-6 ms-4'>
                                {origins.map((value, index) =>
                                    <option key={index} value={value}>{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replaceAll("_", " ")}</option>
                                )}
                            </select>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-3 fs-6 ms-4">Color</div>
                            <Slider
                                value={[beginColor, endColor]}
                                min={0}
                                max={colors.length - 1}
                                onChange={(e) => {
                                    setBeginColor(e.target.value[0]);
                                    setEndColor(e.target.value[1]);
                                }}
                                style={{
                                    color: '#2D9596',
                                }}
                                marks={
                                    colors.map((value, index) =>
                                    ({
                                        value: index,
                                        label: value
                                    })
                                    )
                                }
                                step={null}
                                className='col-md me-5'
                            />
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-3 fs-6 ms-4">Clarity</div>
                            <Slider
                                value={[beginClarity, endClarity]}
                                min={0}
                                max={clarities.length - 1}
                                onChange={(e) => {
                                    setBeginClarity(e.target.value[0])
                                    setEndClarity(e.target.value[1])
                                }}
                                style={{
                                    color: '#2D9596',
                                }}
                                step={null}
                                marks={
                                    clarities.map((value, index) => (
                                        {
                                            value: index,
                                            label: value
                                        }
                                    ))
                                }
                                className='col-md me-5'
                            />
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-3 fs-6 ms-4">Cut</div>
                            <Slider
                                value={[beginCut, endCut]}
                                min={0}
                                max={cuts.length - 1}
                                onChange={(e) => {
                                    setBeginCut(e.target.value[0]);
                                    setEndCut(e.target.value[1]);
                                }}
                                style={{
                                    color: '#2D9596',
                                }}
                                step={null}
                                marks={
                                    cuts.map((value, index) => (
                                        {
                                            value: index,
                                            label: value.replace("_", " ")
                                        }
                                    ))
                                }
                                className='col-md me-5'
                            />
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-3 fs-6 ms-4">Carat</div>
                            <Slider
                                value={carat}
                                min={0}
                                step={1}
                                max={carat_ranges.length - 1}
                                style={{
                                    color: '#2D9596',
                                }}
                                onChange={(e) => {
                                    setCarat(e.target.value);
                                }}
                                className='col me-5'
                                valueLabelDisplay='off'
                            />
                            <p className='text-center fs-3'>{carat_ranges[carat].replace("-", " - ")}</p>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-3 fs-6 ms-4">Price</div>
                            <Slider
                                value={[minPrice, maxPrice]}
                                min={200}
                                max={5000000}
                                onChange={(e) => {
                                    setMinPrice(e.target.value[0]);
                                    setMaxPrice(e.target.value[1]);
                                }}
                                style={{
                                    color: '#2D9596',
                                }}
                                className='col-md me-5'
                                step={1}

                                valueLabelDisplay='auto'
                                marks={
                                    [
                                        {
                                            value: 200,
                                            label: "Min: 200"
                                        },
                                        {
                                            value: 5000000,
                                            label: "Max: 5,000,000"
                                        }
                                    ]
                                }
                            />
                        </div>

                        <div className='row mb-2'>
                            <div className="col-md">
                                <p className='fs-5 fw-semibold'>Chosen diamonds</p>
                                <ul style={{ listStyle: "none" }}>
                                    {
                                        chosenDiamonds.map((entry, index) => (
                                            <li className='fs-6 ms-4' key={index}>{entry.id} - {entry.name} - {formatPrice(entry.price)}</li>
                                        ))
                                    }
                                </ul>
                                <div className="row mb-2">
                                    <p className='fs-4 fw-bold'>
                                        Price: {formatPrice(totalDiamondPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="col-md-5">
                    <div>
                        <p className='fs-5 fw-semibold'>
                            Material
                        </p>
                        <div className="col-md mb-2">
                            <select value={currentMaterial} onChange={handleMaterial} className="form-select rounded-0">
                                <option value=''>Choose material</option>
                                {materialList.map(
                                    material => (
                                        <option key={material.materialId} value={material.materialId}>{material.materialName}</option>
                                    )
                                )}
                            </select>
                        </div>
                        <p className='fs-5 fw-semibold'>
                            Weight (g)
                        </p>
                        <div className="col-md mb-2">
                            <input
                                value={materialWeight}
                                onChange={handleMaterialWeight}
                                type="number"
                                className="form-control rounded-0"
                                id="floatingInputValue"
                                placeholder="0.0"
                                step="0.1"
                            />
                        </div>


                        <div className='col-md'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr className='text-center'>
                                        <th className='fs-5 fw-semibold'>ID</th>
                                        <th className='fs-5 fw-semibold'>Weight</th>
                                        <th className='fs-5 fw-semibold'>Price</th>
                                        <th className='fs-5 fw-semibold'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {chosenMaterials.map(
                                        material => (
                                            <tr key={material.id}>
                                                <td>{material.id}</td>
                                                <td>{material.weight}</td>
                                                <td>{formatPrice(material.price)}</td>
                                                <td><button className={`fs-6 w-100 ${styles['custom-button']}`} onClick={() => removeMaterial(material.id, material.price)} >REMOVE</button></td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={chooseMaterial} type="button" className={` w-100 ${styles['custom-button']}`}>
                            ADD
                        </button>
                        <div className="col-md d-flex justify-content-between align-items-center">
                            <p className="fs-4 fw-semibold">Price:</p>
                            <p>{formatPrice(totalMaterialPrice)}</p>
                        </div>
                    </div>


                    <div>
                        <p className='fs-5 fw-semibold'>
                            Extra
                        </p>
                        <div className="form-floating col-md mb-2">
                            <input
                                type="number"
                                className="form-control rounded-0"
                                id="floatingInputValue"
                                placeholder="1.0"
                                value={extraPrice.diamond}
                                onChange={(event) => setExtraPrice(
                                    (prevExtraPrice) => (
                                        { ...prevExtraPrice, diamond: parseFloat(event.target.value.length === 0 ? '0' : event.target.value) }
                                    )
                                )}
                            />
                            <label>Extra Diamond</label>
                        </div>
                        <div className="form-floating col-md mb-2">
                            <input
                                type="number"
                                className="form-control rounded-0"
                                id="floatingInputValue"
                                placeholder="1.0"
                                value={extraPrice.material}
                                onChange={(event) => setExtraPrice(
                                    (prevExtraPrice) => (
                                        { ...prevExtraPrice, material: parseFloat(event.target.value.length === 0 ? '0' : event.target.value) }
                                    )
                                )}
                            />
                            <label>Extra Material</label>
                        </div>
                        <div className="col-md d-flex justify-content-between align-items-center">
                            <p className="fs-4 fw-semibold">Price:</p>
                            <p>{formatPrice(extraPrice.diamond + extraPrice.material)}</p>
                        </div>
                    </div>

                    <div>
                        <p className='fs-5 fw-semibold'>
                            Production
                        </p>
                        <form className="form-floating col-md mb-2">
                            <input
                                type="number"
                                className="form-control rounded-0"
                                id="floatingInputValue"
                                placeholder="1.0"
                                value={extraPrice.production}
                                onChange={(event) => setExtraPrice(
                                    (prevExtraPrice) => (
                                        { ...prevExtraPrice, production: parseFloat(event.target.value.length === 0 ? '0' : event.target.value) }
                                    )
                                )}
                            />
                            <label>Production price</label>
                        </form>
                    </div>
                    <div>
                        <p className='fs-5 fw-semibold'>
                            Markup rate
                        </p>
                        <form className="form-floating col-md mb-2">
                            <input
                                type="number"
                                className="form-control rounded-0"
                                id="floatingInputValue"
                                placeholder="1.0"
                                step="0.1"
                                value={extraPrice.markupRate}
                                onChange={(event) => setExtraPrice(
                                    (prevExtraPrice) => (
                                        { ...prevExtraPrice, markupRate: parseFloat(event.target.value.length === 0 ? '0' : event.target.value) }
                                    )
                                )} />
                            <label>Rate</label>
                        </form>
                    </div>
                    <div className="col-md d-flex justify-content-between align-items-center">
                        <p className='fs-5 fw-semibold'>Product price</p>
                        <p>{formatPrice((totalDiamondPrice + totalMaterialPrice + extraPrice.material + extraPrice.diamond + extraPrice.production) * extraPrice.markupRate)}</p>
                    </div>
                    <div className="col-md d-flex justify-content-between align-items-center">
                        <p className="fw-bold">Total amount &#40;10% tax&#41;</p>
                        <p>{formatPrice((totalDiamondPrice + totalMaterialPrice + extraPrice.material + extraPrice.diamond + extraPrice.production) * extraPrice.markupRate * 1.1)}</p>
                    </div>
                    {
                        processing
                            ? <button className={` w-100 ${styles['custom-button']}`} type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Loading...</span>
                            </button>
                            : <button type="button" className={` w-100 ${styles['custom-button']}`} onClick={finalSubmit}>
                                REQUEST MANAGER
                            </button>
                    }

                </div>
            </div>
            <Pagination count={totalPage} page={pageNo + 1} onChange={(event, value) => {
                setPageNo(value - 1)
            }} />
            <div className="row mb-2 px-3">
                <table className='table col-md text-center'>
                    <thead>
                        <tr>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>ID</th>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>Shape</th>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>4C</th>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>Price</th>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>Eff.Date</th>
                            <th className='fw-semibold' style={{ backgroundColor: "#48AAAD", color: "white" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DiamondList />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WaitSaleStaff;