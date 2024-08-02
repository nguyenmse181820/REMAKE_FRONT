import { Outlet, useLocation, useNavigate } from "react-router-dom"
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import { Toaster } from 'sonner';
import { useEffect } from "react";


const CustomerFrame = () => {

    const location = useLocation().pathname;
    const navigate = useNavigate();
    const allowedPaths = ['/', '/diamond-price-list', '/material-price-list', '/custom-design', '/unauthorized-access', '/login', '/register', '/google-callback', '/build-your-own/choose-setting', '/build-your-own/choose-setting',];

    useEffect(() => {
        if (sessionStorage.getItem('customer') == null) {
            if (!(
                location.includes('/') ||
                location.includes('/diamond-price-list') ||
                location.includes('/material-price-list') ||
                location.includes('/custom-design') ||
                location.includes('/unauthorized-access') ||
                location.includes('/login') ||
                location.includes('/register') ||
                location.includes('/google-callback') ||
                location.includes('/build-your-own')
            )) {
                console.log(`Unathorized`);
                navigate('/unauthorized-access');
                return;
            }
        }
    }, [])


    const ScrollToTop = () => {
        const { pathname } = useLocation();

        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);

        return null;
    }

    return (
        <div>
            <Toaster position="top-center" richColors expand={true} />
            <NavigationBar />
            <div style={{ paddingTop: '15vh' }}>
                <Outlet />
            </div>
            <Footer />
            <ScrollToTop />
        </div>

    )
}

export default CustomerFrame;