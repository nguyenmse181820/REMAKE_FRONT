import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '/src/css/ManageCustomer.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { CircularProgress, Switch } from '@mui/material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import useDocumentTitle from "../../components/Title";
import { validateString } from '../../helper_function/Validation';

const ManageCustomer = () => {

    const [listCustomer, setListCustomer] = useState(null);
    const [listQuery, setListQuery] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState(null);
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);
    const [openDialog, setOpenDialog] = useState(false);
    const [activeCustomer, setActiveCustomer] = useState(null);

    useDocumentTitle("Manage Customers")

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/customer/get-all`, { headers });
            if (response.status === 200) {
                setListCustomer(response.data);
                setListQuery(response.data);
            } else {
                toast.error(`Cannot fetch customer list from server`);
            }
        } catch (error) {
            console.log(error);
            toast.error(`Something went wrong, cannot fetch customers...`);
        }
    }

    const UpdateDialog = () => {
        const [username, setUsername] = useState(activeCustomer !== null ? activeCustomer.account.username : '');
        const [name, setName] = useState(activeCustomer !== null ? activeCustomer.name : '');
        const [address, setAddress] = useState(activeCustomer !== null ? activeCustomer.address : '');
        const [email, setEmail] = useState(activeCustomer !== null ? activeCustomer.account.email : '');
        const validateName = validateString(name, 1, 20);
        const validateAddress = validateString(address, 10, 100);
        const validateEmail = validateString(email, 8, 254, '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');

        const updateCustomer = async () => {
            if (
                validateName.result &&
                validateAddress.result &&
                validateEmail.result
            ) {
                try {
                    console.log(`${import.meta.env.VITE_jpos_back}/api/update`);
                    const headers = {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                    const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/update`, {
                        ...activeCustomer,
                        account: {
                            ...activeCustomer.account,
                            username: username,
                            email: email,
                        },
                        address: address,
                        name: name,
                    }, {
                        headers
                    })
                    if (response.status === 200) {
                        if (response.data > 0) {
                            toast.success(`Update successful`);
                        }
                        fetchData();
                        setOpenDialog(false);
                        toast.success('Updated successfully');
                    }
                } catch (error) {
                    if (error.response.status === 406) {
                        toast.error(`The email ${email} is already linked to another account!`);
                    }
                }
            } else {
                if (!validateName.result) {
                    toast.error('Name: ' + validateName.reason);
                }
                if (!validateAddress.result) {
                    toast.error('Address: ' + validateAddress.reason);
                }
                if (!validateEmail.result) {
                    toast.error('Email: ' + validateEmail.reason);
                }
            }
        }

        return (
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Update Customer
                </DialogTitle>
                <DialogContent>
                    <div className="input-group mt-1 mb-3">
                        <span className={`input-group-text ${styles['input-label']}`}>UserName</span>
                        <input className="form-control" type="text" value={username} disabled={true} />
                    </div>
                    <div className="input-group mt-1 mb-3">
                        <span className={`input-group-text ${styles['input-label']}`}>Name</span>
                        <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-group mt-1 mb-3">
                        <span className={`input-group-text ${styles['input-label']}`}>Address</span>
                        <input className="form-control" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="input-group mt-1 mb-3">
                        <span className={`input-group-text ${styles['input-label']}`}>Email</span>
                        <input className="form-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={updateCustomer}>Submit</Button>
                    <Button onClick={() => setOpenDialog(false)} >Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const toggleAccount = async (customer) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const object = {
                ...customer,
                account: {
                    ...customer.account,
                    status: !customer.account.status
                }
            }
            const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/update`, object, { headers });
            if (response.status === 200) {
                toast.success(`Change status successfully`);
            } else {
                toast.error(`Something went wrong, unable to change status...`);
            }
            setRefresh(r => !r);
        } catch (error) {
            toast.error(`Unable to change status`);
        }
    }

    const deleteCustomer = async (id) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.delete(`${import.meta.env.VITE_jpos_back}/api/customer/delete/${id}`, { headers });
            if (response.status === 200) {
                toast.success(`Delete successfully`);
            } else {
                toast.error(`Deletion unsuccessful`);
            }
            setRefresh(r => !r);
        } catch (error) {
            toast.error(`Something went wrong, cannot delete`);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchData();
        setSearch(null);
    }, [refresh])

    useEffect(() => {
        if (search != null) {
            let query_list = listCustomer;
            query_list = query_list.filter(customer => (customer.customerId.toString() == search || customer.name.toLowerCase().includes(search.toLowerCase())))
            setListQuery(query_list);
        } else {
            setListQuery(listCustomer);
        }
    }, [search])

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col-lg-3" id={`${styles['manage-customer-search-bar']}`}>
                    <input onChange={(e) => setSearch(e.target.value)} className='form-control rounded-0' placeholder='Search customer &#128270;' type="text" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col p-0">
                    <div className="container-fluid border">
                        <div className="row py-2 mb-3 fw-bold border-bottom border-black">
                            <div className="col-1 d-flex justify-content-center align-items-center">ID</div>
                            <div className="col-2 d-flex justify-content-start align-items-center">Name</div>
                            <div className="col d-flex justify-content-start align-items-center">Address</div>
                            <div className="col d-flex justify-content-start align-items-center">Username</div>
                            <div className="col d-flex justify-content-start align-items-center">Email</div>
                            <div className="col d-flex justify-content-center align-items-center">Status</div>
                            <div className="col d-flex justify-content-center align-items-center">Actions</div>
                        </div>
                        {
                            listQuery != null
                                ? listQuery.map((customer, index) => (
                                    <div className="row border-bottom align-middle" key={index}>
                                        <div className="col-1 text-break d-flex justify-content-center align-items-center">{customer.customerId}</div>
                                        <div className="col-2 text-break d-flex justify-content-start align-items-center">{customer.name}</div>
                                        <div className="col text-break d-flex justify-content-start align-items-center">{customer.address}</div>
                                        <div className="col text-break d-flex justify-content-start align-items-center">{customer.account.username}</div>
                                        <div className="col text-break d-flex justify-content-start align-items-center">{customer.account.email}</div>
                                        <div className="col text-break d-flex justify-content-center align-items-center">
                                            <Switch
                                                checked={customer.account.status}
                                                onChange={() => toggleAccount(customer)}
                                                style={{ color: customer.account.status ? '#48AAAD' : 'red' }}
                                            />
                                        </div>
                                        <div className="col text-center d-flex justify-content-center align-items-center" id={`${styles['action-button']}`} onClick={(e) => {
                                            setAnchor(anchor ? null : e.currentTarget);
                                            setActiveCustomer(customer);
                                        }}>
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </div>
                                    </div>
                                ))
                                : <>
                                    <div className="row">
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <CircularProgress />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>

                </div>
                <BasePopup open={open} anchor={anchor}>
                    <div className={`${styles['popup-div']}`}>
                        <button onClick={() => {
                            setOpenDialog(true);
                            setAnchor(null);
                        }}>Update</button>
                        <button onClick={() => deleteCustomer(activeCustomer.customerId)}>Delete</button>
                    </div>
                </BasePopup>
                <UpdateDialog />
            </div>
        </div>
    )
}

export default ManageCustomer;