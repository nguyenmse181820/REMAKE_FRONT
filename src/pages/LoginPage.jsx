import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from '/src/css/LoginPage.module.css';
import { toast } from 'sonner';
import useDocumentTitle from "../components/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [HTMLContent, setHTMLContent] = useState('');
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    useDocumentTitle("Login");

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleKeyPress = (event, field) => {
        if (event.key === 'Enter') {
            if (field === 'username') {
                passwordRef.current.focus();
            } else if (field === 'password') {
                unionLogin();
            }
        }
    };

    const unionLogin = async () => {
        if (username.length > 0 && password.length > 0) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_jpos_back}/api/v1/auth/authenticate`, {
                    username: username,
                    password: password
                });
                if (!response.data || response.status === 204) {
                    toast.error(`Invalid credentials. Please try again`);
                } else {
                    if (response.data.account.customerId !== undefined) {
                        sessionStorage.setItem('customer', JSON.stringify(response.data.account));
                        sessionStorage.setItem('token', response.data.token);
                        navigate("/");
                        return;
                    } else if (response.data.account.staffId !== undefined) {
                        sessionStorage.setItem('staff', JSON.stringify(response.data.account));
                        sessionStorage.setItem('token', response.data.token);
                        if (response.data.account.staffType == 'manage') {
                            navigate("/staff/manage-requests")
                        } else {
                            navigate("/staff/request");
                        }
                        return;
                    } else if (response.data.account.role == 'admin') {
                        sessionStorage.setItem('admin', JSON.stringify(response.data.account));
                        sessionStorage.setItem('token', response.data.token);
                        navigate('/admin/dashboard');
                        return;
                    }
                }
            } catch (error) {
                console.log(error);
                toast.error(`Invalid credentials, please try again!`);
            }
        } else {
            toast.info("Please fill in all forms!");
        }
    };

    const loginGoogle = async () => {
        try {
            window.location.href = `${import.meta.env.VITE_jpos_back}/oauth2/authorization/google`
        } catch (error) {
            console.log(error);
            console.log('error');
        }
    };

    return (
        <div className={`container-fluid d-flex align-items-center justify-content-center ${styles.fullHeight}`}>
            <div className={`card p-3 mt-3 ${styles.centerCard} rounded-0`}>
                <div className="mt-3 mb-3 text-center">
                    <h2 className="fw-bold">LOGIN</h2>
                </div>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <textarea
                        value={username}
                        onChange={handleUsername}
                        maxLength={255}
                        className="form-control rounded-0"
                        rows="1"
                        cols="30"
                        style={{ resize: 'none' }}
                        ref={usernameRef}
                        onKeyDown={(e) => handleKeyPress(e, 'username')}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        value={password}
                        onChange={handlePassword}
                        type="password"
                        className="form-control rounded-0"
                        ref={passwordRef}
                        onKeyDown={(e) => handleKeyPress(e, 'password')}
                    />
                </div>
                <div className="mb-3 row">
                    <div className="col">
                        <button onClick={unionLogin} className={`w-100 ${styles['button-custom']}`}>
                            <span>Login</span>
                        </button>
                    </div>
                    <div className="col">
                        <Link to="/register">
                            <button className={`w-100 ${styles['button-custom']}`}><span>Register</span></button>
                        </Link>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <button onClick={loginGoogle} className={`w-100 ${styles['button-custom']}`}> <span><FontAwesomeIcon icon={faGoogle} /> Sign in with Google</span></button>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col" dangerouslySetInnerHTML={{ __html: HTMLContent }}>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
