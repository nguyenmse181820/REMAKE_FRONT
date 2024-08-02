import { faClipboard, faFloppyDisk, faGem, faHammer, faPenToSquare, faRing, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatPrice, formatDate } from '/src/helper_function/ConvertFunction';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


const ManageDesignPrice = () => {

    const [productDesigns, setProductDesigns] = useState(null);
    const [queryList, setQueryList] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');

    const [activeDesign, setActiveDesign] = useState(null);
    const [open, setOpen] = useState(false);

    const openDialog = (design) => {
        setActiveDesign(JSON.parse(JSON.stringify(design)));
        setOpen(true);
    }

    const closeDialog = () => {
        setActiveDesign(null);
        setOpen(false);
    }

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/product-designs/all`, { headers });
            if (!response.data || response.status === 204) {
                toast.info(`Can't fetch data`);
            } else {
                setProductDesigns(response.data);
                setQueryList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const update = async () => {
        try {
            const response = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_jpos_back}/api/product-designs/update`,
                data: activeDesign,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                toast.success(`Updated successfully`);
                closeDialog();
            } else {
                console.log(`Error`)
            }
            setRefresh(r => !r);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
    }, [refresh])

    useEffect(() => {
        if (search.length > 0) {
            let query_list = [...productDesigns];
            query_list = query_list.filter(design => design.designName.toLowerCase().includes(search.toLowerCase()) || design.productDesignId.toString() == search);
            setQueryList(query_list);
        } else {
            setQueryList(productDesigns);
        }
    }, [search])

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col-lg-4">
                    <input type="text" className="form-control rounded-0" placeholder="Search id/name &#128270;" onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <div className="container-fluid border" style={{ minWidth: '1120px' }}>
                        <div className="row border-bottom py-3 mb-3 fw-bold">
                            <div className="col-1 d-flex justify-content-center align-items-center">ID</div>
                            <div className="col-md-3 d-flex justify-content-start align-items-center">Name</div>
                            <div className="col-md-1 d-flex justify-content-center align-items-center">Type</div>
                            <div className="col d-flex justify-content-center align-items-center">Image</div>
                            <div className="col-md-3 d-flex justify-content-center align-items-center">Options</div>
                            <div className="col-md-2 d-flex justify-content-center align-items-center">Actions</div>
                        </div>
                        {
                            queryList !== null
                                ? queryList.map((design, index) => (
                                    <div className="row mb-3 border-bottom" key={index}>
                                        <div className="col-md-1 fw-bold d-flex justify-content-center align-items-center">{design.productDesignId}</div>
                                        <div className="col-md-3 d-flex justify-content-start align-items-center">{design.designName}</div>
                                        <div className="col-md-1 d-flex justify-content-center align-items-center text-capitalize">{design.designType}</div>
                                        <div className="col d-flex justify-content-center align-items-center"><img style={{ width: '6rem', height: '6rem' }} src={design.designFile} /></div>
                                        <div className="col-md-3 d-flex justify-content-center align-items-center">
                                            <div className="container-fluid">
                                                {
                                                    design.productShellDesigns.map((shell, index2) => (
                                                        <div className="row" key={index2}>
                                                            <div className="col text-capitalize d-flex justify-content-start align-items-center overflow-hidden">
                                                                {shell.shellName.replace("shell", "").trim()}
                                                            </div>
                                                            <div className="col d-flex justify-content-end align-items-center">
                                                                {formatPrice(shell.ematerialPrice + shell.ediamondPrice + shell.productionPrice)}
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex justify-content-center align-items-center"><button className="btn btn-primary rounded-0 w-100" onClick={() => openDialog(design)}>Edit</button></div>
                                    </div>
                                ))
                                : <></>
                        }
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={closeDialog}>
                <DialogTitle className="text-center fs-3">Edit Design Price</DialogTitle>
                <DialogContent>
                    <div className="container-fluid">
                        <div className="row mb-3">
                            <div className="col fw-bold">Name</div>
                            <div className="col text-center"><FontAwesomeIcon icon={faGem} /></div>
                            <div className="col text-center"><FontAwesomeIcon icon={faRing} /></div>
                            <div className="col text-center"><FontAwesomeIcon icon={faHammer} /></div>
                            <div className="col text-end fw-bold">Total</div>
                        </div>
                        {
                            activeDesign !== null
                                ? activeDesign.productShellDesigns.map((shell, index) => (
                                    <div className="row mb-3" key={index}>
                                        <div className="col text-capitalize d-flex align-items-center justify-content-start">
                                            {shell.shellName}
                                        </div>
                                        <div className="col">
                                            <input className="form-control rounded-0" type="number" value={shell.ediamondPrice}
                                                onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    if (newPrice >= 0 && newPrice !== null) {
                                                        const updatedDesigns = [...activeDesign.productShellDesigns];
                                                        updatedDesigns[index].ediamondPrice = newPrice;
                                                        setActiveDesign({
                                                            ...activeDesign,
                                                            productShellDesigns: updatedDesigns
                                                        });
                                                    } else {
                                                        toast.error(`Price must be greater than 0 or empty.`);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="form-control rounded-0" type="number" value={shell.ematerialPrice}
                                                onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    if (newPrice >= 0 && newPrice !== null) {
                                                        const updatedDesigns = [...activeDesign.productShellDesigns];
                                                        updatedDesigns[index].ematerialPrice = newPrice;
                                                        setActiveDesign({
                                                            ...activeDesign,
                                                            productShellDesigns: updatedDesigns
                                                        });
                                                    } else {
                                                        toast.error(`Price must be greater than 0 or empty.`);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col">
                                            <input className="form-control rounded-0" type="number" value={shell.productionPrice}
                                                onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    if (newPrice >= 0 && newPrice !== null) {
                                                        const updatedDesigns = [...activeDesign.productShellDesigns];
                                                        updatedDesigns[index].productionPrice = newPrice;
                                                        setActiveDesign({
                                                            ...activeDesign,
                                                            productShellDesigns: updatedDesigns
                                                        });
                                                    } else {
                                                        toast.error(`Price must be greater than 0 or empty.`);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-end">
                                            {formatPrice(shell.ematerialPrice + shell.ediamondPrice + shell.productionPrice)}
                                        </div>
                                    </div>
                                ))
                                : <></>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-success rounded-0" onClick={update}>Update</button>
                    <button className="btn btn-secondary rounded-0" onClick={closeDialog}>Cancel</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ManageDesignPrice;