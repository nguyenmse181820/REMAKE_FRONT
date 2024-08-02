import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidebarAdmin from "../../components/SidebarAdmin";
import { Toaster } from "sonner";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

const AdminFrame = () => {

    const navigate = useNavigate();
    const[width, setWidth] = useState('100px');

    const styling = {
        width: width,
        position: 'fixed',
        color: '#48AAAD',
        transition: '0.3s',
        borderRight: '1px solid #dee2e6'
    };

    useEffect(() => {
        if (sessionStorage.getItem('admin') === null) {
            navigate('/unauthorized-access');
        }
    }, [])

    if (sessionStorage.getItem('admin') !== null) {
        return (
            <div style={{ fontSize: '16px' }}>
                <Toaster position="top-center" richColors expand={false} />
                <SidebarAdmin styling={styling} width={width} setWidth={setWidth}/>
                <div className="p-3" style={{marginLeft: width, transition: '0.3s'}}>
                    <Outlet />
                </div>
            </div>
        )
    }
}

export default AdminFrame;