import { Button, LinearProgress, Pagination, setRef, Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDocumentTitle from "../../components/Title";
import styles from '../../css/ManageDiamonds.module.css';

const ManageDiamonds = () => {
    const [diamonds, setDiamonds] = useState([]);
    const [queryList, setQueryList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const totalPage = parseInt(diamonds.length / pageSize) + 1

    useDocumentTitle("Manage Diamonds");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/diamond/get-all?pageNo=${pageNo}&pageSize=${pageSize}`, { headers });
            if (response.status === 200) {
                setDiamonds(response.data);
                setQueryList(response.data);
            } else {
                toast.error(`Unable to get diamonds`);
            }
        } catch (error) {
            toast.error(`Failed to fetch data`);
        }
    }


    const deleteFunction = async (selectedDiamond) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const object = {
                ...selectedDiamond,
                active: !selectedDiamond.active
            }
            const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/diamond/update`, object, { headers });
            if (response.status === 200) {
                toast.success(`Update status`);
            } else {
                toast.error(`Unable to update status`);
            }
            setRefresh(r => !r);
        } catch (error) {
            toast.error(`Unable to update`);
        }
    }

    useEffect(() => {
        fetchData();
    }, [refresh])

    useEffect(() => {
        if (search.length > 0) {
            let query_list = [...diamonds];
            query_list = query_list.filter(d => d.diamondId.toString() == search || d.diamondCode.toLowerCase().includes(search.toLowerCase()) || d.diamondName.toLowerCase().includes(search.toLowerCase()));
            setQueryList(query_list);
        } else {
            setQueryList(diamonds);
        }
        setPageNo(0);
    }, [search])

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col-lg-4 p-0 ">
                    <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search Diamond Id/Code &#128270;" className="form-control rounded-0" />
                </div>
                <div className="col">
                    <button className="btn btn-primary rounded-0" onClick={() => {
                        navigate('create')
                    }}>Create new diamond</button>
                </div>
                <div className="col">
                    <Pagination count={totalPage} page={pageNo + 1} onChange={(event, value) => {
                        setPageNo(value - 1)
                    }} />
                </div>
            </div>
            <div className="row mb-3">

                <table className="border text-start table align-middle">
                    <thead className="text-center">
                        <tr>
                            <th className="text-start">ID</th>
                            <th className="text-start">Code</th>
                            <th className="text-start">Name</th>
                            <th className="">Color</th>
                            <th className="">Cut</th>
                            <th className="">Clarity</th>
                            <th className="">Weight (g)</th>
                            <th className="">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            queryList.length > 0
                                ? queryList.slice(pageNo * pageSize, pageNo * pageSize + pageSize).map((diamond, index) => (
                                    <tr key={index}>
                                        <td className="col-md-1">{diamond.diamondId}</td>
                                        <td className="col-md-2">{diamond.diamondCode}</td>
                                        <td className="col-md-4">{diamond.diamondName}</td>
                                        <td className="text-center">{diamond.color}</td>
                                        <td className="text-center">{diamond.cut.replace("_", " ")}</td>
                                        <td className="text-center">{diamond.clarity}</td>
                                        <td className="text-center">{diamond.caratWeight}</td>
                                        <td className="text-center">
                                            <Switch
                                                checked={diamond.active}
                                                onChange={() => deleteFunction(diamond)}
                                                style={{ color: diamond.active ? '#48AAAD' : 'red' }}
                                            />
                                        </td>
                                    </tr>
                                ))
                                : <>
                                    <tr>
                                        <td colSpan={8}><LinearProgress /></td>
                                    </tr>
                                </>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageDiamonds;