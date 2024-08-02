import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GoogleHandler = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const processData = async () => {
        try {
            sessionStorage.clear();
            const method = location.search[1];
            let resp = {}

            if(method != 'F') {
                resp = JSON.parse(atob(location.search.slice(2)));
            } else {
                toast.error("Your account has been disabled");
                navigate("/login");
                return;
            }
            
            if (method == 'S') {
                const response = await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_jpos_back}/api/v1/auth/register`,
                    data: resp
                });
                if (response.status === 200) {
                    sessionStorage.setItem('customer', JSON.stringify(response.data.account));
                    sessionStorage.setItem('token', response.data.token);
                }
            } else if (method == 'L') {
                sessionStorage.setItem('customer', JSON.stringify(resp.account));
                sessionStorage.setItem('token',resp.token);
            } 
            navigate("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        processData();
    }, [])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <h1>Handling request...</h1>
                </div>
            </div>
        </div>
    )

}

export default GoogleHandler;