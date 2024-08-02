import styles from '/src/css/ManageStaffPage.module.css';
import { useEffect, useState } from "react";
import { toast } from 'sonner';
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../components/Title";
import { validateString } from "../../helper_function/Validation";

const DEPARTMENT = {
    'sale': 'Sales',
    'design': 'Design',
    'produce': 'Production',
    'manage': 'Management'
}


const ManageStaffPage = () => {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState(null);
    const [queryList, setQueryList] = useState(null);
    const [search, setSearch] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [activeStaff, setActiveStaff] = useState(null);
    const [refresh, setRefresh] = useState(false);
    useDocumentTitle("Manage Staffs")

    const UpdateDialog = () => {

        const [name, setName] = useState(activeStaff !== null ? activeStaff.name : '');
        const [email, setEmail] = useState(activeStaff != null ? activeStaff.account.email : '');
        const [password, setPassword] = useState('');
        const [phone, setPhone] = useState(activeStaff !== null ? activeStaff.phone : '');
        const [staffType, setStaffType] = useState(activeStaff !== null ? activeStaff.staffType : '');

        const validateEmail = validateString(email, 8, 254, '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
        const validatePassword = validateString(password, 8, 16);
        const validateName = validateString(name, 8, 20);
        const validatePhone = validateString(phone, 9, 11, null, '^\\d+$');

        const updateStaff = async () => {
            if (
                validateEmail.result &&
                (validatePassword.result || password.length == 0) &&
                validateName.result &&
                validatePhone.result
            ) {
                try {
                    const object = {
                        ...activeStaff,
                        name: name,
                        phone: phone,
                        staffType: staffType,
                        account: {
                            ...activeStaff.account,
                            email: email,
                            password: password.length == 0 ? activeStaff.account.password : password
                        }
                    }
                    const response = await axios({
                        url: `${import.meta.env.VITE_jpos_back}/api/staff/update`,
                        method: 'put',
                        data: object,
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    })
                    if (response.status === 200) {
                        if (response.data > 0) {
                            toast.success(`Update successful`);
                        }
                        fetchData();
                        setOpenDialog(false);
                        toast.success("Updated successfully");
                    }
                } catch (error) {
                    if (error.response.status === 406) {
                        toast.error(`The email ${email} is already linked to another account!`);
                    }
                }
            } else {
                toast.info(`Please fulfill all requirements`);
            }
        }

        if (activeStaff != null) {
            return (
                <Dialog sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "0",
                    }
                }} open={openDialog} onClose={() => setOpenDialog(false)} fullWidth={true}>
                    <DialogTitle className="text-uppercase text-center text-white" style={{ backgroundColor: '#D3D3D3' }}>
                        Edit {activeStaff.name}
                    </DialogTitle>
                    <DialogContent>
                        <div className="container-fluid mt-3">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control rounded-0" value={name} onChange={(e) => setName(e.target.value)} />
                                    <div className="form-text text-danger">{validateName.reason}</div>
                                </div>
                                <div className="col">
                                    <label className="form-label">Email address</label>
                                    <input type="text" className="form-control rounded-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <div className="form-text text-danger">{validateEmail.reason}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">New password</label>
                                    <input type="password" className="form-control rounded-0" placeholder="Enter new password..." onChange={(e) => setPassword(e.target.value)} />
                                    <div className="form-text text-danger">{validatePassword.reason}</div>
                                </div>
                                <div className="col">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control rounded-0" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <div className="form-text text-danger">{validatePhone.reason}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">Department</label>
                                    <select className="form-select rounded-0" type="text" value={staffType} onChange={(e) => setStaffType(e.target.value)} >
                                        {
                                            ['sale', 'design', 'produce', 'manage'].map((value, index) => (
                                                <option className="rounded-0" key={index} value={value}>{DEPARTMENT[value]}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={updateStaff}>Save</button>
                        <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={() => setOpenDialog(false)} >Cancel</button>
                    </DialogActions>
                </Dialog >
            )
        }
    }

    const toggleAccount = async (staff) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.put(`${import.meta.env.VITE_jpos_back}/api/staff/update`,
                {
                    ...staff,
                    account: {
                        ...staff.account,
                        status: !staff.account.status
                    }
                },
                {
                    headers
                }
            )
            if (response.status === 200) {
                toast.success(`Changed staff's status`);
            } else {
                toast.error(`Can't change status`);
            }
            setRefresh(r => !r);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchData = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/staff/find-all`, { headers });
            if (!response.data || response.status == 204) {
                toast.info(`No info`);
            } else {
                let employees = response.data;
                setEmployees(employees);
                setQueryList(employees);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteStaff = async (id) => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.delete(`${import.meta.env.VITE_jpos_back}/api/staff/delete/${id}`, { headers });
            if (response.status === 200) {
                toast.success(`Delete successfully`);
            } else {
                toast.error(`Unable to delete staff`);
            }
            setAnchor(null);
            setRefresh(r => !r);
        } catch (error) {
            toast.error(`Can't delete staff`);
        }
    }

    useEffect(() => {
        if (search.length > 0) {
            let query_list = [...employees];
            query_list = query_list.filter(staff => (staff.staffId.toString() == search || staff.name.toLowerCase().includes(search.toLowerCase())));
            setQueryList(query_list);
        } else {
            setQueryList(employees);
        }
    }, [search])

    useEffect(() => {
        fetchData();
    }, [refresh])

    return (
        <div className="container-fluid" id={`${styles['manage-staff']}`}>
            <div className="row mb-3">
                <div className="col-3 p-0">
                    <input placeholder={`Search Employee`} onChange={(e) => setSearch(e.target.value)} type="text" className="form-control rounded-0" />
                </div>
                <div className="col">
                    <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={() => navigate("create")}>Create new staff</button>
                </div>
            </div>
            <div className="row mb-3">

                <table className="table border text-center align-middle fs-6">
                    <thead>
                        <tr>
                            <th >ID</th>
                            <th className="text-start">Name</th>
                            <th className="text-start">Username</th>
                            <th className="text-start">Email</th>
                            <th className="text-start">Department</th>
                            <th className="text-start">Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            queryList != null
                                ? queryList.map((value, index) => (
                                    <tr key={index}>
                                        <td >{value.staffId}</td>
                                        <td className="text-start">{value.name}</td>
                                        <td className="text-start">{value.account.username}</td>
                                        <td className="text-start">{value.account.email}</td>
                                        <td className="text-start">{DEPARTMENT[value.staffType]}</td>
                                        <td className="text-start">{value.phone}</td>
                                        <td className="text-center">
                                            <Switch
                                                checked={value.account.status}
                                                onChange={() => toggleAccount(value)}
                                                style={{ color: value.account.status ? '#48AAAD' : 'red' }}
                                            />
                                        </td>
                                        <td>
                                            <button className={`btn rounded-0 ${styles['staffButton']}`} onClick={() => {
                                                setActiveStaff(value);
                                                setOpenDialog(true);
                                            }}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                                : <></>
                        }
                    </tbody>
                </table>
                <UpdateDialog />
            </div>
        </div>
    )
}

export default ManageStaffPage;