import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

const StaffFrame = () => {

    const navigate = useNavigate();
    const [width, setWidth] = useState('100px');

    const styling = {
        width: width,
        position: 'fixed',
        color: '#48AAAD',
        transition: '0.3s',
        borderRight: '1px solid #dee2e6'
    };

    useEffect(() => {
        if (sessionStorage.getItem('staff') === null) {
            navigate('/unauthorized-access');
        }
    }, [])

    if (sessionStorage.getItem('staff') !== null) {
        return (
            <div style={{ fontSize: '16px' }}>
                <Toaster position="top-center" richColors expand={true} />
                <Sidebar styling={styling} width={width} setWidth={setWidth} />
                <div className="p-3" style={{ marginLeft: width, transition: '0.3s' }}>
                    <Outlet />
                </div>
            </div>
        )
    }

}

export default StaffFrame;