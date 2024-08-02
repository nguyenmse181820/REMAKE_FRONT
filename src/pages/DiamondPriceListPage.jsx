import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import axios from 'axios';
import { formatDate, formatPrice } from "../helper_function/ConvertFunction";
import useDocumentTitle from "../components/Title";
import { Pagination } from "@mui/material";
import styles from '/src/css/DiamondPriceListPage.module.css';
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
import { toast } from "sonner";

const SHAPES_IMAGES = [
    { name: 'round', image: round },
    { name: 'princess', image: princess },
    { name: 'cushion', image: cushion },
    { name: 'emerald', image: emerald },
    { name: 'oval', image: oval },
    { name: 'radiant', image: radiant },
    { name: 'asscher', image: asscher },
    { name: 'marquise', image: marquise },
    { name: 'heart', image: heart },
    { name: 'pear', image: pear },
];
//Selection above
const SHAPES = ['round', 'princess', 'cushion', 'emerald', 'oval', 'radiant', 'asscher', 'marquise', 'heart', 'pear'];
const ORIGINS = ['LAB_GROWN', 'NATURAL'];

//Combination of these create a table
const CUTS = ['Fair', 'Good', 'Very_Good', 'Excellent'];
const MIN_CARAT = 0.05;
const CARAT_STEP = 0.1;
const MAX_CARAT = 10;
let CARAT_RANGE = []
for (let i = MIN_CARAT; i <= MAX_CARAT; i += CARAT_STEP) {
    let first_num = parseFloat(i).toFixed(2);
    let second_num = parseFloat(i + CARAT_STEP).toFixed(2);
    CARAT_RANGE = [...CARAT_RANGE, [first_num, second_num]];
}

//A single table
const CLARITIES = ['I3', 'I2', 'I1', 'SI3', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL']; //Column
const COLORS = ['K', 'J', 'I', 'H', 'G', 'F', 'E', 'D']; //Row

const DiamondPriceListPage = () => {

    const [activeOrigin, setActiveOrigin] = useState(ORIGINS[0]);
    const [activeShape, setActiveShape] = useState(SHAPES[0]);
    const [activeRange, setActiveRange] = useState([0, 19]);

    const [diamondPrices, setDiamondPrices] = useState([]);

    useDocumentTitle("Bijoux Diamond Price List");

    const fetchData = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_jpos_back}/public/diamond-price/${activeOrigin}/${activeShape}/${CARAT_RANGE[activeRange[0]][0]}-${CARAT_RANGE[activeRange[1]][1]}`
            })
            if (response.status === 200) {
                setDiamondPrices(response.data);
            } else {
                console.log(`Error`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [activeOrigin, activeShape, activeRange])

    return (
        <div className={`container ${styles['diamond-price-list']}`}>
            <div className="row mb-3" id={`${styles['origin-row']}`}>
                {
                    ORIGINS.map((value, index) => (
                        <div onClick={() => setActiveOrigin(value)} key={index} id={`${styles['origin-div']}`} className={`col p-0 text-center ${value == activeOrigin ? styles['active'] : ''}`}>
                            <span>{value.replace("_", " ")}</span>
                        </div>
                    ))
                }
            </div>
            <div className="row gap-5 mb-3">
                {SHAPES_IMAGES.map((value, index) => (
                    <div onClick={() => setActiveShape(value.name)} key={index} className={`col ${value.name == activeShape ? styles['active'] : ''}`} id={`${styles['shape-div']}`}>
                        <img src={value.image} alt="" />
                        <span>{value.name[0].toUpperCase() + value.name.slice(1)}</span>
                    </div>
                ))}
            </div>
            <div className="row mb-3 gap-3">
                <button onClick={() => setActiveRange([0, 19])} className="btn btn-light col d-flex align-items-center justify-content-center fw-bold fs-4">
                    {CARAT_RANGE[0][0]} - {CARAT_RANGE[19][1]}
                </button>
                <button onClick={() => setActiveRange([20, 39])} className="btn btn-light col d-flex align-items-center justify-content-center fw-bold fs-4">
                    {CARAT_RANGE[20][0]} - {CARAT_RANGE[39][1]}
                </button>
                <button onClick={() => setActiveRange([40, 59])} className="btn btn-light col d-flex align-items-center justify-content-center fw-bold fs-4">
                    {CARAT_RANGE[40][0]} - {CARAT_RANGE[59][1]}
                </button>
                <button onClick={() => setActiveRange([60, 79])} className="btn btn-light col d-flex align-items-center justify-content-center fw-bold fs-4">
                    {CARAT_RANGE[60][0]} - {CARAT_RANGE[79][1]}
                </button>
                <button onClick={() => setActiveRange([80, 99])} className="btn btn-light col d-flex align-items-center justify-content-center fw-bold fs-4">
                    {CARAT_RANGE[80][0]} - {CARAT_RANGE[99][1]}
                </button>
            </div>
            {
                CARAT_RANGE.slice(activeRange[0], activeRange[1] + 1).map((caratRangeValue, index) => (
                    <div key={index} className={`row mb-3`}>
                        <h4>{activeOrigin.replace("_", " ")} {activeShape.toUpperCase()} EXCELLENT CUT {caratRangeValue[0]} - {caratRangeValue[1]} Ct</h4>
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>{caratRangeValue[0]} - {caratRangeValue[1]} Ct</th>
                                    {
                                        COLORS.map((caratRangeValue, index) => (
                                            <th key={index}>
                                                {caratRangeValue}
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    CLARITIES.map((clarityValue, index) => (
                                        <tr key={index}>
                                            <th>{clarityValue}</th>
                                            {
                                                COLORS.map((colorValue, index) => (
                                                    <td key={index}>
                                                        {
                                                            diamondPrices != null
                                                                ? diamondPrices.find(price => price.color == colorValue && price.clarity == clarityValue && caratRangeValue[0] == price.caratWeightFrom && caratRangeValue[1] == price.caratWeightTo) != null
                                                                    ? formatPrice(diamondPrices.find(price => price.color == colorValue && price.clarity == clarityValue && caratRangeValue[0] == price.caratWeightFrom && caratRangeValue[1] == price.caratWeightTo).price)
                                                                    : 'NaN'
                                                                : 'NaN'
                                                        }
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ))
            }
        </div>
    );
};

export default DiamondPriceListPage;
