import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, setRef } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { validateInteger, validateString } from "../../helper_function/Validation";
import { INFINITY } from "chart.js/helpers";
import useDocumentTitle from "../../components/Title";
import styles from '/src/css/ManageMaterials.module.css';

const ManageMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [queryList, setQueryList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [activeMaterial, setActiveMaterial] = useState({ materialId: -1, materialName: '' });
    const validateMaterialId = validateInteger(activeMaterial.materialId, 1, INFINITY);
    const validateMaterialName = validateString(activeMaterial.materialName, 4, 50, null, '^[A-Za-z0-9_]+$');

    useDocumentTitle("Manage Materials")

    const [open, setOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const openDialog = (material) => {
        setActiveMaterial(JSON.parse(JSON.stringify(material)));
        setOpen(true);
    }

    const openDialogCreate = () => {
        setActiveMaterial({ materialId: -1, materialName: '' });
        setOpenCreate(true);
    }

    const closeDialog = () => {
        setActiveMaterial({ materialId: -1, materialName: '' });
        setOpen(false);
        setOpenCreate(false);
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log(`${import.meta.env.VITE_jpos_back}/public/material/all`)
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_jpos_back}/public/material/all`,
            })
            if (response.status === 200) {
                setMaterials(response.data);
                setQueryList(response.data);
            } else {
                console.log(`Error`);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const update = async () => {
        if (
            validateMaterialId.result &&
            validateMaterialName.result
        ) {
            try {
                const response = await axios({
                    method: 'put',
                    url: `${import.meta.env.VITE_jpos_back}/api/material/${activeMaterial.materialId}`,
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    data: activeMaterial
                });
                if (response.status === 200) {
                    toast.success(`Update complete`);
                    closeDialog();
                } else {
                    console.log('error');
                }
                setRefresh(r => !r);
            } catch (error) {
                console.log(error);
                toast.error(`Unable to update`);
            }
        } else {
            toast.error(`Please fulfill all requirements`);
        }
    }

    const create = async () => {
        if (validateMaterialName.result) {
            try {
                const response = await axios({
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    url: `${import.meta.env.VITE_jpos_back}/api/material/add`,
                    data: activeMaterial
                })
                if (response.status === 200) {
                    toast.success('Create complete');
                    closeDialog();
                } else {
                    console.log('error');
                }
                setRefresh(r => !r);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error(`Please fulfill all requirements`);
        }
    }

    useEffect(() => {
        fetchData();
    }, [refresh])

    useEffect(() => {
        setLoading(true);
        if (search.length > 0) {
            let query_list = [...materials];
            query_list = query_list.filter(m => m.materialId.toString() == search || m.materialName.replaceAll("_","").toLowerCase().includes(search.replaceAll(" ","").replaceAll("_","").toLowerCase()));
            setQueryList(query_list);
        } else {
            setQueryList(materials);
        }
        setLoading(false);
    }, [search])

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col-3 p-0">
                    <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search material ID/name... &#128270;" className="rounded-0 form-control" />
                </div>
                <div className="col">
                    <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={openDialogCreate}>Create new material</button>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-5 p-0">
                    <table className="table border text-center align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                queryList.length > 0
                                    ? queryList.map((material, index) => (
                                        <tr key={index}>
                                            <td>
                                                {material.materialId}
                                            </td>
                                            <td className="text-capitalize">
                                                {material.materialName.replace("_", " ")}
                                            </td>
                                            <td className="align-items-center">
                                                <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={() => openDialog(material)}>Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                    : loading
                                        ? <tr>
                                            <td colSpan={3}>
                                                <LinearProgress />
                                            </td>
                                        </tr>
                                        : <tr>
                                            <td colSpan={3}>
                                                No results
                                            </td>
                                        </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Dialog sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "0",
                }
            }} maxWidth="xs" open={open} onClose={closeDialog} fullWidth={true}>
                <DialogTitle className="text-center">EDIT MATERIAL</DialogTitle>
                <DialogContent>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <label className="form-label">Name</label>
                                <input className="rounded-0 form-control" onChange={(e) => setActiveMaterial(m => ({ ...m, materialName: e.target.value }))} value={activeMaterial.materialName} type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-text text-start text-danger">{validateMaterialName.reason}</div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className={`btn rounded-0 btn-success`} onClick={update}>UPDATE</button>
                    <button className="btn btn-secondary rounded-0" onClick={closeDialog}>CANCEL</button>
                </DialogActions>
            </Dialog>

            <Dialog sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "0",
                }
            }} maxWidth="xs" fullWidth={true} open={openCreate} onClose={closeDialog}>
                <DialogTitle className="text-center">CREATE MATERIAL</DialogTitle>
                <DialogContent>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <label className="form-label">Name</label>
                                <input className="form-control rounded-0" onChange={(e) => setActiveMaterial(m => ({ ...m, materialName: e.target.value }))} value={activeMaterial.materialName} type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-text text-start text-danger">{validateMaterialName.reason}</div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className={`btn rounded-0 btn-success`} onClick={create}>UPDATE</button>
                    <button className="btn btn-secondary rounded-0" onClick={closeDialog}>CANCEL</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ManageMaterials;