import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const EditDiamond = () => {
    const diamondId = useParams().diamondId;
    const [diamond, setDiamond] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/diamond/get-by-id/${diamondId}`, { headers });
            if (response.status === 200) {
                setDiamond(response.data);
            } else {
                toast.error(`Unable to fetch diamond`);
            }
        } catch (error) {
            toast.error(`Unable to fetch diamond`);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (diamond == null) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <button onClick={() => navigate(-1)} className="btn btn-primary">Go back</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        Loading...
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container-fluid">
                <div className="row mb-3">
                    <div className="col-lg-4">
                        <button onClick={() => navigate(-1)} className="btn btn-primary">Go back</button>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <div className="input-group mb-3">
                            <span className="input-group-text">ID</span>
                            <input className="form-control" value={diamond.diamondId} type="text" disabled={true} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Code</span>
                            <input className="form-control" value={diamond.diamondCode} onChange={(e) => setDiamond(d => ({ ...d, diamondCode: e.target.value }))} type="text" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Name</span>
                            <input className="form-control" value={diamond.diamondName} onChange={(e) => setDiamond(d => ({ ...d, diamondName: e.target.value }))} type="text" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Shape</span>
                            <select>

                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Origin</span>
                            <input className="form-control" value={diamond.diamondName} onChange={(e) => setDiamond(d => ({ ...d, diamondName: e.target.value }))} type="text" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditDiamond;