import { useNavigate } from 'react-router-dom';
import styles from '/src/css/CreateStaff.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { validateString } from '../../helper_function/Validation';
import { Select } from '@mui/material';

const STAFF_TYPE = ['sale', 'design', 'produce', 'manage']

const CreateStaff = () => {

    const [username, setUsername] = useState('');
    const validateUsername = validateString(username, 5, 16, null);
    const [email, setEmail] = useState('');
    const validateEmail = validateString(email, 5, 254, '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
    const [password, setPassword] = useState('');
    const validatePassword = validateString(password, 8, 16);
    const [name, setName] = useState('');
    const validateName = validateString(name, 5, 20);
    const [phone, setPhone] = useState('');
    const validatePhone = validateString(phone, 8, 11, null, '^\\d+$');
    const [staffType, setStaffType] = useState("Select staff type");
    const [staffTypeList, setStaffTypeList] = useState([]);

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (
            validateUsername.result &&
            validateEmail.result &&
            validatePassword.result &&
            validateName.result &&
            validatePhone.result &&
            staffType !== "Select staff type"
        ) {
            try {
                const headers = {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
                const object = {
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    phone: phone,
                    staffType: staffType
                }
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/staff/create`, object, { headers });
                if (response.status === 200) {
                    toast.success(`Creation successful`);
                    navigate(-1);
                } else {
                    toast.error(`Username must be unique`);
                }
                console.log(object);
            } catch (error) {
                toast.error(`Something went wrong. Creation failed`);
            }
        } else {
            toast.info(`Please fulfill the requirements`);
        }
    }
    const fetchStaffTypeList = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            const response = await axios.get(`${import.meta.env.VITE_jpos_back}/api/staff/get-staff-types`, { headers });
            if (response.status === 200) {
                setStaffTypeList(response.data);
            } else {
                toast.error(`Fetch staff types failed. Please try again`);
            }

        }
        catch (error) {
            toast.error(`Fetch staff types failed. Please try again`);
        }
    }
    useEffect(() => {
        fetchStaffTypeList();
    }, [])

    return (
        <div className="container-fluid" id={`${styles['create-staff']}`}>
            <div className="row mb-3">
                <div className="row">

                    <h1 className="d-flex align-items-center justify-content-center p-0 mt-5 mb-5 col">
                        <FontAwesomeIcon onClick={() => navigate(-1)} className='me-3 mb-1' icon={faLeftLong} id={`${styles['back-btn']}`} />
                        <span className="text-center flex-grow-1">Create Staff</span></h1>
                </div>
                <div className="row mb-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Username</span>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='form-control' />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateUsername.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Name</span>
                                <input value={name} onChange={(e) => setName(e.target.value)} className='form-control' type="text" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateName.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Email</span>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' type="email" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validateEmail.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Password</span>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' type="text" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validatePassword.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Phone</span>
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' type="text" />
                            </div>
                            <div className="form-text fs-6 text-danger">{validatePhone.reason}</div>
                        </div>
                        <div className="mb-3">
                            <div className={`input-group ${styles['input-group']}`}>
                                <span className='input-group-text'>Staff type</span>
                                <select value={staffType} onChange={(e) => setStaffType(e.target.value)} className='form-select'>
                                    <option value="Select staff type"> Select staff type</option>
                                    {
                                        staffTypeList !== null ?
                                            staffTypeList.map((staff_type, index) => (
                                                <option key={index} value={staff_type}>
                                                    {staff_type} Staff
                                                </option>
                                            )) : <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <button className='mt-2 btn btn-primary w-100' onClick={handleCreate}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateStaff;