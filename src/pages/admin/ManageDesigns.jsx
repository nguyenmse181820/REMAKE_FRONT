import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, setRef } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { validateDouble, validateInteger, validateString } from "../../helper_function/Validation";
import useDocumentTitle from "../../components/Title";
import styles from '/src/css/ManageDesigns.module.css';
import { fetchDesignType } from "../../helper_function/EnumFunction";

const ManageDesigns = () => {
    const [designs, setDesigns] = useState(null);
    const [queryList, setQueryList] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [materials, setMaterials] = useState([]);
    const [listDesignType, setListDesignType] = useState([]);
    const [activeShell, setActiveShell] = useState(0);

    //console.log(designs);

    useDocumentTitle("Manage Designs");

    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [activeDesign, setActiveDesign] = useState(null);

    const openUpdateDialog = (design) => {
        setIsOpenUpdate(true);
        setActiveDesign(JSON.parse(JSON.stringify(design)));
    }

    const closeUpdateDialog = () => {
        setIsOpenUpdate(false);
        setActiveDesign(null);
        setActiveShell(0);
    }

    const fetchMaterials = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_jpos_back}/public/material/all`
            })
            if (response.status === 200) {
                setMaterials(response.data);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/product-designs/all`, { headers });
            const list_design_type = await fetchDesignType();
            if (response.status === 200) {
                setDesigns(response.data);
                setQueryList(response.data);
                setListDesignType(list_design_type);
            } else {
                console.log('error');
            }
        } catch (error) {
            toast.error(`Failed to fetch data`);
        }
    }

    const addDesign = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_jpos_back}/api/product-designs/add`,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                data: {
                    designFile: 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
                    designName: 'New Design',
                    designType: listDesignType[0],
                    productShellDesigns: []
                }
            })
            if (response.status === 200) {
                setRefresh(r => !r);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteDesign = async (id) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${import.meta.env.VITE_jpos_back}/api/product-designs/${id}`,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                setRefresh(r => !r);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const UpdateDialog = () => {
        const id = activeDesign.productDesignId;
        const [designFile, setDesignFile] = useState(activeDesign.designFile);
        const [designName, setDesignName] = useState(activeDesign.designName);
        const [designType, setDesignType] = useState(activeDesign.designType);
        const [productShellDesigns, setProductShellDesigns] = useState(activeDesign.productShellDesigns);

        const validateDesignFile = validateString(designFile, 16, Math.INFINITY);
        const validateDesignName = validateString(designName, 4, Math.INFINITY);
        const validateDesignType = validateString(designType, 1, Math.INFINITY);

        console.log(activeDesign);

        const addNewShell = () => {
            setProductShellDesigns(s => [...s, {
                diamondQuantity: 1,
                ediamondPrice: 0,
                ematerialPrice: 0,
                image: null,
                markupRate: 1,
                productShellMaterials: [],
                productionPrice: 0,
                shellName: 'New shell'
            }])
            setActiveShell(productShellDesigns.length);
        }

        const deleteShell = async (id) => {
            try {
                const response = await axios({
                    method: 'delete',
                    url: `${import.meta.env.VITE_jpos_back}/api/shells/${id}`,
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                if (response.status === 200) {
                    toast.success("Delete successfully");
                    closeUpdateDialog();
                }
                setRefresh(r => !r);
            } catch (error) {
                toast.error('error');
            }
        }

        const update = async () => {
            if (
                validateDesignName.result &&
                validateDesignFile.result &&
                validateDesignType.result
            ) {
                try {
                    const response = await axios({
                        url: `${import.meta.env.VITE_jpos_back}/api/product-designs/update`,
                        method: 'put',
                        data: {
                            ...activeDesign,
                            designFile: designFile,
                            designName: designName,
                            designType: designType,
                            productShellDesigns: productShellDesigns.filter(shell => shell.productShellDesignId == productShellDesigns[activeShell].productShellDesignId)
                        },
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });
                    if (response.status === 200) {
                        toast.success('Update successful');

                    } else {
                        console.log('error');
                    }
                    setRefresh(r => !r);
                } catch (error) {
                    toast.error(`Unable to update`);
                }
            } else {
                toast.info(`Please fulfill all requirements first!`);
            }
        }

        return (
            <Dialog fullWidth={true} maxWidth="lg" open={isOpenUpdate} onClose={closeUpdateDialog}>
                <DialogTitle className="text-center">EDIT DESIGN</DialogTitle>
                <DialogContent>
                    <div className="container-fluid">
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Design ID</label>
                                <input value={id} type="text" className="form-control rounded-0" disabled />
                            </div>
                            <div className="col">
                                <label className="form-label">Design Name</label>
                                <input value={designName} onChange={(e) => setDesignName(e.target.value)} type="text" className="form-control rounded-0" />
                                <span className="form-text text-danger">{validateDesignName.reason}</span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Type</label>
                                <select className="form-select rounded-0" value={designType} onChange={(e) => setDesignType(e.target.value)}>
                                    {
                                        listDesignType.length > 0
                                            ? listDesignType.map((value, index) => (
                                                <option key={index} value={value} className="text-capitalize">{value}</option>
                                            )) : <></>
                                    }
                                </select>
                                <span className="text-danger form-text">{!validateDesignType.result ? 'Please select one' : ''}</span>
                            </div>
                            <div className="col">
                                <label className="form-label">Cover Image</label>
                                <input value={designFile} onChange={(e) => setDesignFile(e.target.value)} type="text" className="form-control rounded-0" />
                                <span className="text-danger form-text">{validateDesignFile.reason}</span>
                            </div>
                        </div>
                        {
                            productShellDesigns != null
                                ? productShellDesigns.length > 0
                                    ? productShellDesigns.map((shell, index) => (
                                        <div key={index} className="row mb-3">
                                            <div className="container-fluid">
                                                <div className="row mb-1">
                                                    <div className="col fw-bold">
                                                        Shell #{index + 1}
                                                        {
                                                            activeShell !== index
                                                                ? <>
                                                                    <button onClick={() => {
                                                                        setActiveShell(index);
                                                                        update();
                                                                    }} className="ms-3 btn btn-info rounded-0">Edit</button>
                                                                </>
                                                                : <>
                                                                    <button className="ms-3 btn btn-success rounded-0" disabled={true}>Selected</button>
                                                                </>
                                                        }
                                                        <button onClick={() => deleteShell(shell.productShellDesignId)} className="ms-3 btn btn-danger rounded-0" disabled={productShellDesigns.length <= 1}>Delete this shell</button>
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        <label className="form-label">Shell Name</label>
                                                        <input className="form-control rounded-0" disabled={activeShell !== index} type="text" value={shell.shellName} onChange={(e) => {
                                                            let value = e.target.value;
                                                            if (value == null || value.length <= 0) {
                                                                toast.error("Name cannot be empty");
                                                            } else {
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].shellName = value;
                                                                setProductShellDesigns(shell_list);
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        <label className="form-label">Diamond quantity</label>
                                                        <input disabled={activeShell !== index} type="number" min={1} value={shell.diamondQuantity} onChange={(e) => {
                                                            try {
                                                                let value = parseInt(e.target.value);
                                                                value = isNaN(value) ? 1 : value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].diamondQuantity = Math.max(value, 1);
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                toast.error(error);
                                                            }
                                                        }} className="form-control rounded-0" />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Extra diamond price ($)</label>
                                                        <input disabled={activeShell !== index} type="number" step={0.01} min={0} value={shell.ediamondPrice} className="form-control rounded-0" onChange={(e) => {
                                                            try {
                                                                let value = parseFloat(e.target.value);
                                                                value = isNaN(value) ? 0 : value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].ediamondPrice = Math.max(value, 0);
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                toast.error(error);
                                                            }
                                                        }} />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Extra material price ($)</label>
                                                        <input disabled={activeShell !== index} type="number" min={0} value={shell.ematerialPrice} className="form-control rounded-0" onChange={(e) => {
                                                            try {
                                                                let value = parseFloat(e.target.value);
                                                                value = isNaN(value) ? 0 : value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].ematerialPrice = Math.max(value, 0);
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                toast.error(error);
                                                            }
                                                        }} />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Production price ($)</label>
                                                        <input disabled={activeShell !== index} type="number" min={0} value={shell.productionPrice} className="form-control rounded-0" onChange={(e) => {
                                                            try {
                                                                let value = parseFloat(e.target.value);
                                                                value = isNaN(value) ? 0 : value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].productionPrice = Math.max(value, 0);
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                toast.error(error);
                                                            }
                                                        }} />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Markup rate</label>
                                                        <input disabled={activeShell !== index} type="number" min={0.01} step={0.01} value={shell.markupRate} className="form-control rounded-0" onChange={(e) => {
                                                            try {
                                                                let value = parseFloat(e.target.value);
                                                                value = isNaN(value) ? 0.01 : value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].markupRate = Math.max(value, 0.01);
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                toast.error(error);
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        <label className="form-label">Image</label>
                                                        <input className="form-control rounded-0" disabled={activeShell !== index} type="text" value={shell.image} onChange={(e) => {
                                                            try {
                                                                let value = e.target.value;
                                                                const shell_list = [...productShellDesigns];
                                                                shell_list[index].image = value;
                                                                setProductShellDesigns(shell_list);
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col">
                                                        Materials
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        {
                                                            shell.productShellMaterials.length > 0
                                                                ? shell.productShellMaterials.map((material, index2) => (
                                                                    <div key={index2} className="row mb-1">
                                                                        <div className="input-group rounded-0">
                                                                            <span className="input-group-text rounded-0">Name</span>
                                                                            <select disabled={activeShell !== index} className="form-select rounded-0" value={JSON.stringify(material.material)} onChange={(e) => {
                                                                                let shell_list = [...productShellDesigns];
                                                                                shell_list[index].productShellMaterials[index2].material = JSON.parse(e.target.value);
                                                                                shell_list[index].productShellMaterials[index2].id.materialId = JSON.parse(e.target.value).materialId;
                                                                                setProductShellDesigns(shell_list);
                                                                            }}>
                                                                                {
                                                                                    materials.length > 0
                                                                                        ? materials.map((m, mIndex) => (
                                                                                            <option key={mIndex} value={JSON.stringify(m)}>
                                                                                                {m.materialId} - {m.materialName}
                                                                                            </option>
                                                                                        ))
                                                                                        : <></>
                                                                                }
                                                                            </select>
                                                                            <span className="input-group-text rounded-0">Weight (g)</span>
                                                                            <input disabled={activeShell !== index} className="form-control rounded-0" type="number" min={0.01} value={material.weight} onChange={(e) => {
                                                                                try {
                                                                                    let value = parseFloat(e.target.value);
                                                                                    value = isNaN(value) ? 0.01 : value;
                                                                                    const shell_list = [...productShellDesigns];
                                                                                    shell_list[index].productShellMaterials[index2].weight = Math.max(value, 0.01);
                                                                                    setProductShellDesigns(shell_list);
                                                                                } catch (error) {
                                                                                    toast.error(error);
                                                                                }
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                )) : <></>
                                                        }
                                                    </div>
                                                    <div className="col">
                                                        <button disabled={activeShell !== index} onClick={() => {
                                                            let shell_list = [...productShellDesigns];
                                                            let closest_material = materials.filter(m => !shell_list[index].productShellMaterials.map(mm => mm.material.materialId).includes(m.materialId));
                                                            shell_list[index].productShellMaterials = [...shell_list[index].productShellMaterials, {
                                                                id: {
                                                                    shellId: shell_list[index].productShellDesignId,
                                                                    materialId: closest_material[0].materialId
                                                                },
                                                                material: closest_material[0],
                                                                weight: 0.01
                                                            }];
                                                            setProductShellDesigns(shell_list);
                                                        }} className="btn btn-dark rounded-0">Add new material</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <></>
                                : <></>
                        }
                        <div className="row mb-3">
                            <div className="col">
                                <button onClick={addNewShell} className="btn btn-success rounded-0 w-100">Add a new shell</button>
                            </div>
                        </div>
                        <div className="row mt-5 mb-3">
                            <div className="col">
                                <button className="btn btn-danger rounded-0 w-100" onClick={() => {
                                    deleteDesign(id);
                                    closeUpdateDialog();
                                }}>Delete this design</button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-success rounded-0" onClick={() => {
                        update();
                        closeUpdateDialog();
                    }}>Save</button>
                    <button className="btn btn-danger rounded-0" onClick={closeUpdateDialog}>Cancel</button>
                </DialogActions>
            </Dialog>
        )
    }

    useEffect(() => {
        fetchData();
        fetchMaterials();
    }, [refresh])

    useEffect(() => {
        if (search.length > 0) {
            let query_list = [...designs].filter(q => q.designName.toLowerCase().includes(search.toLowerCase()) || q.productDesignId.toString() == search);
            setQueryList(query_list);
        } else {
            setQueryList(designs);
        }
    }, [search])

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col p-0" style={{ maxWidth: '400px' }}>
                    <input onChange={(e) => setSearch(e.target.value)} placeholder="Search for design... &#128270;" className="form-control rounded-0" type="text" />
                </div>
                <div className="col">
                    <button onClick={addDesign} className={`btn rounded-0 ${styles['staffButton']}`}>Add new design</button>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col p-0">
                    <table className="table border">
                        <thead className="text-center">
                            <tr>
                                <th className="col-md-1">ID</th>
                                <th className="col-md-3">Name</th>
                                <th className="col-md-2">Type</th>
                                <th className="col-md-3">Image</th>
                                <th className="col-md-2">Shells</th>
                                <th className="col-md-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                queryList != null
                                    ? queryList.sort((a, b) => b.productDesignId - a.productDesignId).map((design, index) => (
                                        <tr key={index}>
                                            <td className="text-center align-content-lg-center">{design.productDesignId}</td>
                                            <td className="align-content-lg-center">{design.designName}</td>
                                            <td className="text-capitalize text-center align-content-lg-center">{design.designType}</td>
                                            <td className="justify-content-center">
                                                <img className="d-block mx-auto" src={design.designFile} alt="" style={{ width: '100%', height: 'auto' }} />
                                            </td>
                                            <td className="align-content-lg-center">
                                                <div className="container-fluid text-center ">
                                                    {
                                                        design.productShellDesigns.map((shell, index2) => (
                                                            <div key={index2}>
                                                                <div className="text-capitalize">
                                                                    {shell.shellName.replace("shell", " ").trim()}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                            <td className="align-content-lg-center">
                                                <button onClick={() => openUpdateDialog(design)} className={`btn rounded-0 ${styles['staffButton']}`}>
                                                    EDIT
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    : <>
                                        <tr>
                                            <td colSpan={6}>
                                                <LinearProgress />
                                            </td>
                                        </tr>
                                    </>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                activeDesign != null
                    ? <UpdateDialog />
                    : <></>
            }
        </div>
    )
}

export default ManageDesigns;