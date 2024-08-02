import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DiamondCard from './DiamondCard';
import styles from '/src/css/ChooseDiamonds.module.css';
import { formatPrice } from '../../helper_function/ConvertFunction';
import { CircularProgress, LinearProgress, Pagination, Slider } from '@mui/material';
import useDocumentTitle from '../../components/Title';

import asscher from '/src/assets/svg/Asscher.svg';
import cushion from '/src/assets/svg/Cushion.svg';
import emerald from '/src/assets/svg/Emerald.svg';
import heart from '/src/assets/svg/Heart.svg';
import marquise from '/src/assets/svg/Marquise.svg';
import oval from '/src/assets/svg/Oval.svg';
import pear from '/src/assets/svg/Pear.svg';
import princess from '/src/assets/svg/Princess.svg';
import radiant from '/src/assets/svg/Radiant.svg';
import round from '/src/assets/svg/Round.svg';

const SHAPES_IMAGES = [
    { name: 'Round', image: round },
    { name: 'Princess', image: princess },
    { name: 'Cushion', image: cushion },
    { name: 'Emerald', image: emerald },
    { name: 'Oval', image: oval },
    { name: 'Radiant', image: radiant },
    { name: 'Asscher', image: asscher },
    { name: 'Marquise', image: marquise },
    { name: 'Heart', image: heart },
    { name: 'Pear', image: pear },
];
const SHAPES = ['round', 'princess', 'cushion', 'emerald', 'oval', 'radiant', 'asscher', 'marquise', 'heart', 'pear'];
const CLARITIES = ['I3', 'I2', 'I1', 'SI3', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
const COLORS = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'];
const CUTS = ['Fair', 'Good', 'Very_Good', 'Excellent'];
const ORIGINS = ['NATURAL', 'LAB_GROWN']
const MIN_PRICE = 200;
const MAX_PRICE = 5000000;
const PRICE_STEP = 200;

const MIN_CARAT = 0.05;
const MAX_CARAT = 10.05;
const CARAT_STEP = 0.1 * 3;
let carat_ranges = []

for (let i = MIN_CARAT; i <= MAX_CARAT; i += CARAT_STEP) {
    let first_num = i.toFixed(2);
    let second_num = (i + CARAT_STEP).toFixed(2);
    carat_ranges = [...carat_ranges, first_num + "-" + second_num];
}

const DEFAULT_PAGE_NO = 0;
const DEFAULT_PAGE_SIZE = 40;

const ChooseDiamond = () => {

    const navigate = useNavigate();
    const [diamondList, setDiamondList] = useState([]);

    const [activeShape, setActiveShape] = useState(null);

    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

    const [carat, setCarat] = useState(0);

    const [beginColor, setBeginColor] = useState(0);
    const [endColor, setEndColor] = useState(COLORS.length - 1);

    const [beginClarity, setBeginClarity] = useState(0);
    const [endClarity, setEndClarity] = useState(CLARITIES.length - 1);

    const [beginCut, setBeginCut] = useState(0);
    const [endCut, setEndCut] = useState(CUTS.length - 1);

    const [origin, setOrigin] = useState(ORIGINS[0])

    const [pageNo, setPageNo] = useState(DEFAULT_PAGE_NO);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const totalPage = parseInt(diamondList.length/pageSize)+1

    const [isFinishedLoading, setIsFinishedLoading] = useState(true);

    useDocumentTitle('Find The Right Diamond For You');

    const fetchQuery = async () => {
        setIsFinishedLoading(false);
        try {
            let carat_split = carat_ranges[carat].split("-");
            const query = {
                origin: origin,
                shapeList: activeShape !== null ? [activeShape.toLowerCase()] : SHAPES,
                colorList: [...COLORS.slice(beginColor, endColor), COLORS[endColor]],
                clarityList: [...CLARITIES.slice(beginClarity, endClarity), CLARITIES[endClarity]],
                cutList: [...CUTS.slice(beginCut, endCut), CUTS[endCut]],
                minCarat: parseFloat(carat_split[0]),
                maxCarat: parseFloat(carat_split[1]),
                minPrice: minPrice,
                maxPrice: maxPrice
            }
            console.log(query);
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_jpos_back}/public/diamond/get-diamond-with-price-by-4C`,
                data: query
            });
            if (response.status === 200) {
                setDiamondList(d => response.data);
            } else {
                console.log('error');
            }

        } catch (error) {
            console.log(error);
        }
        setIsFinishedLoading(true);
    }

    const isSelected = (id) => {
        if (sessionStorage.getItem('selected_diamonds') === null) {
            return false;
        } else {
            return JSON.parse(sessionStorage.getItem('selected_diamonds')).filter(d => d.diamondId == id).length > 0;
        }
    }


    const resetFilters = () => {
        setCarat(0);

        setMinPrice(MIN_PRICE);
        setMaxPrice(MAX_PRICE);

        setBeginClarity(0);
        setEndClarity(CLARITIES.length - 1);

        setBeginCut(0);
        setEndCut(CUTS.length - 1);

        setActiveShape(null);

        setBeginColor(0);
        setEndColor(COLORS.length - 1);

        setOrigin(ORIGINS[0]);

        setPageNo(DEFAULT_PAGE_NO);
        setPageSize(DEFAULT_PAGE_SIZE);
    }

    const DiamondList = () => {

        if (isFinishedLoading && diamondList.length > 0) {
            return diamondList.slice(pageNo*pageSize,pageNo*pageSize + pageSize).map((entry, index) => (
                <div key={index} className="col-md-4 col-lg-3 mb-4">
                    <DiamondCard
                        diamond={entry.diamond}
                        isSelected={isSelected(entry.diamond.diamondId)}
                        onClick={() => navigate(`/build-your-own/diamond-details/${entry.diamond.diamondId}`)}
                    />
                </div>
            ))
        } else if(isFinishedLoading) {
            return (
                <div className="col">
                    <p className='fs-4 text-center'>No diamonds available for this setting.</p>
                </div>
            )
        } else {
            return (
                <LinearProgress/>
            )
        }
    }

useEffect(() => {
    if (sessionStorage.getItem('selected_product') == null) {
        toast.info(`Please pick a setting first`);
        navigate('/build-your-own/choose-setting');
    } else {
        fetchQuery();
    }
}, [])

useEffect(() => {
    fetchQuery();
}, [origin, activeShape, carat, beginColor, endColor, beginClarity, endClarity, beginCut, endCut, minPrice, maxPrice])

console.log(diamondList);

return (
    <>
        <div className={`${styles.container} container`} style={{ minWidth: '1000px' }}>
            <div className="diamond-finder text-center">
                <h3 className='ms-3' style={{ textAlign: 'center' }}>Diamond Finder</h3>
                <p style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>Use our diamond search feature to find GIA-graded, conflict-free loose diamonds of the highest quality. Browse thousands of options and use the filters to narrow down the selection by carat, cut, colour, clarity, shape and price.</p>
            </div>
            <div className="row text-center mb-4 mt-4">
                <div className="col mx-auto">
                    <div className="btn-group" role="group" aria-label="Diamond Origin">
                        <button
                            type="button"
                            className={`btn ${origin === "NATURAL" ? styles['btn-custom'] : styles['btn-outline-custom']}`}
                            onClick={() => setOrigin("NATURAL")}
                            style={{ width: '150px' }}
                        >
                            Natural
                        </button>
                        <button
                            type="button"
                            className={`btn ${origin === "LAB_GROWN" ? styles['btn-custom'] : styles['btn-outline-custom']}`}
                            onClick={() => setOrigin("LAB_GROWN")}
                            style={{ width: '150px' }}
                        >
                            Lab Grown
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <b>Shape</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            {SHAPES_IMAGES.map((value, index) =>
                                <div key={index} className={`col-3 ${styles['shape']} d-flex flex-column justify-content-center align-items-center ${activeShape == value.name.toLowerCase() ? styles['active'] : ''} `} onClick={() => {
                                    if (activeShape === value.name.toLowerCase()) {
                                        setActiveShape(null);
                                    } else {
                                        setActiveShape(value.name.toLowerCase());
                                    }
                                }}>
                                    <img crossOrigin='anonymous' className='img-fluid' src={value.image} alt="" />
                                    <span className='mt-2'>{value.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <b>Carat weight</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col text-start fw-bold">{MIN_CARAT}</div>
                            <div className="col text-end fw-bold">{MAX_CARAT}</div>
                        </div>

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
                </div>
                <div className="col-4">
                    <b>Color</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col text-start">{COLORS[0]}</div>
                            <div className="col text-end">{COLORS[COLORS.length - 1]}</div>
                        </div>

                        <Slider value={[beginColor, endColor]} min={0} max={COLORS.length - 1} onChange={(e) => {
                            setBeginColor(e.target.value[0]);
                            setEndColor(e.target.value[1]);
                        }}
                            style={{
                                color: '#2D9596',
                            }}
                            marks={
                                COLORS.map((value, index) =>
                                ({
                                    value: index,
                                    label: value
                                })
                                )
                            }
                            step={null}
                            className='col me-5' />

                    </div>
                </div>
            </div>
            <div className="row">

                <div className="col-4">
                    <b>Clarity</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col p-0 text-start">{CLARITIES[0]}</div>
                            <div className="col p-0 text-end">{CLARITIES[CLARITIES.length - 1]}</div>
                        </div>
                        <Slider value={[beginClarity, endClarity]} min={0} max={CLARITIES.length - 1} onChange={(e) => {
                            setBeginClarity(e.target.value[0]);
                            setEndClarity(e.target.value[1]);
                        }}
                            style={{
                                color: '#2D9596',
                            }}
                            step={null}
                            marks={
                                CLARITIES.map((value, index) => (
                                    {
                                        value: index,
                                        label: value
                                    }
                                ))
                            }
                            className='col me-5' />
                    </div>
                </div>
                <div className="col-4">
                    <b>Cut</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col p-0 text-start">{CUTS[0]}</div>
                            <div className="col p-0 text-end">{CUTS[CUTS.length - 1]}</div>
                        </div>
                        <Slider value={[beginCut, endCut]} min={0} max={CUTS.length - 1} onChange={(e) => {
                            setBeginCut(e.target.value[0]);
                            setEndCut(e.target.value[1]);
                        }}
                            style={{
                                color: '#2D9596',
                            }}
                            step={null}
                            marks={
                                CUTS.map((value, index) => (
                                    {
                                        value: index,
                                        label: value.replace("_", " ")
                                    }
                                ))
                            }
                            className='col me-5' />

                    </div>
                </div>
                <div className="col-4">
                    <b>Price</b>
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col p-0 text-start">{formatPrice(MIN_PRICE)}</div>
                            <div className="col p-0 text-end">{formatPrice(MAX_PRICE)}</div>
                        </div>
                        <Slider value={[minPrice, maxPrice]} min={MIN_PRICE} max={MAX_PRICE} onChange={(e) => {
                            setMinPrice(e.target.value[0]);
                            setMaxPrice(e.target.value[1]);
                        }}
                            style={{
                                color: '#2D9596',
                            }}
                            step={PRICE_STEP}
                            valueLabelDisplay='auto'
                            valueLabelFormat={(value) => formatPrice(value)}
                            marks={
                                [
                                    {
                                        value: MIN_PRICE,
                                        label: "Min"
                                    },
                                    {
                                        value: MAX_PRICE,
                                        label: "Max"
                                    }
                                ]
                            }
                            className='col me-5' />
                        <div className="row gap-5">
                            <input type="number" min={MIN_PRICE} max={maxPrice} className='col form-control text-end' step={PRICE_STEP} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                            <input type="number" min={minPrice} max={MAX_PRICE} className='col form-control text-end' step={PRICE_STEP} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col text-start">
                    <button className='btn' style={{ backgroundColor: '#48AAAD' }} onClick={resetFilters}>Reset filters</button>
                </div>
                <div className='col'>
                        <div className="d-flex justify-content-end mt-3">
                            <div className='me-3'>
                                <Pagination count={totalPage} page={pageNo+1} onChange={(event, value) => {
                                    setPageNo(value-1)
                                }} />
                            </div>
                            <div className='row'>
                                <span className='col text-center p-0' style={{ lineHeight: '2rem' }}>Page size</span>
                                <input className="form-control col text-end p-0" style={{ height: '1.5rem', marginTop: '0.3rem', marginRight: '1rem' }} type="number" min="10" max="100" step="5" value={pageSize} onChange={(e) => setPageSize(e.target.value)} />
                            </div>
                        </div>
                    </div>
            </div>
            <div className='row'>
                <DiamondList/>
            </div>
        </div>
    </>
);
}

export default ChooseDiamond;
