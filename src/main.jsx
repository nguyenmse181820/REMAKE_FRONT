import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomDesignPage from './pages/CustomDesignPage';
import NotFoundPage from './pages/NotFoundPage';
import DiamondPriceListPage from './pages/DiamondPriceListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/Profile';
import RequestPage from './pages/RequestPage';
import HistoryPage from './pages/HistoryPage';
import CustomerRequestDetailsPage from './pages/CustomerRequestDetailsPage';
import RequestDetailPage from './pages/RequestDetailsPage';
import ChooseSetting from './pages/build-your-own/ChooseSetting';
import ChooseDiamond from './pages/build-your-own/ChooseDiamond';
import CompleteProduct from './pages/build-your-own/CompleteProduct';
import DiamondDetails from './pages/build-your-own/DiamondDetails';
import SettingDetails from './pages/build-your-own/SettingDetails';
import StaffFrame from './pages/frame/StaffFrame';
import CustomerFrame from './pages/frame/CustomerFrame';
import CashThanksPage from './pages/CashThanksPage';
import OnlineThanksPage from './pages/OnlineThanksPage';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import BuildYourOwnFrame from './pages/frame/BuildYourOwnFrame';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import PaymentHandler from './PaymentHandler';
import ManageRequestsPage from './pages/ManageRequestsPage';
import ManageStaffPage from './pages/admin/ManageStaffPage';
import ManagePricePage from './pages/ManagePricePage';
import OrderDetails from './components/OrderDetails';
import CreateStaff from './pages/admin/CreateStaff';
import MaterialPriceListPage from './pages/MaterialPriceListPage';
import ManageMaterialPrice from './pages/ManageMaterialPrice';
import ManageDesignPrice from './pages/ManageDesignPrice';
import AdminFrame from './pages/frame/AdminFrame';
import Dashboard from './pages/Dashboard';
import ManageCustomer from './pages/admin/ManageCustomer';
import ManageDiamonds from './pages/admin/ManageDiamonds';
import ManageMaterials from './pages/admin/ManageMaterials';
import ManageDesigns from './pages/admin/ManageDesigns';
import EditDiamond from './pages/admin/EditDiamond';
import WaitManager from './pages/request-details-components/WaitManager';
import UnauthorizedAccess from './pages/UnauthorizedAccess';
import GoogleHandler from './GoogleHandler';
import CreateDiamond from './pages/admin/CreateDiamond';


const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerFrame />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />, //Customer exclusive
        errorElement: <NotFoundPage />
      },
      {
        path: 'custom-design',
        element: <CustomDesignPage /> //Customer exclusive
      },
      {
        path: 'diamond-price-list',
        element: <DiamondPriceListPage /> //Customer exclusive
      },
      {
        path: 'material-price-list',
        element: <MaterialPriceListPage />
      },
      {
        path: 'login',
        element: <LoginPage /> //Customer, Staff
      },
      {
        path: 'register',
        element: <RegisterPage /> //Customer
      },
      {
        path: 'cash-completed',
        element: <CashThanksPage />
      },
      {
        path: 'online-completed',
        element: <OnlineThanksPage />
      },
      {
        path: '/unauthorized-access',
        element: <UnauthorizedAccess />
      },
      {
        path: 'build-your-own',
        element: <BuildYourOwnFrame />,
        children: [
          {
            path: 'choose-setting',
            element: <ChooseSetting />
          },
          {
            path: 'choose-diamond',
            element: <ChooseDiamond />
          },
          {
            path: 'complete-product',
            element: <CompleteProduct />
          },
          {
            path: 'diamond-details/:diamondId',
            element: <DiamondDetails />
          },
          {
            path: 'setting-details/:designId',
            element: <SettingDetails />
          }
        ]
      },
      {
        path: '/profile',
        element: <ProfilePage /> //Customer
      },
      {
        path: '/profile/your-request',
        element: <CustomerRequestDetailsPage />
      },
      {
        path: '/profile/your-orders',
        element: <CustomerOrdersPage />
      },
      {
        path: '/profile/your-orders/:orderId',
        element: <OrderDetails />
      },
      {
        path: '/payment-callback',
        element: <PaymentHandler />
      },
      {
        path: '/google-callback',
        element: <GoogleHandler />
      }
    ]
  },
  {
    path: '/staff',
    element: <StaffFrame />,
    children: [
      {
        path: 'request',
        element: <RequestPage /> //Staff
      },
      {
        path: 'history',
        element: <HistoryPage /> // Staff
      },
      {
        path: 'history/:orderId',
        element: <OrderDetails />
      },
      {
        path: 'request/select/:orderId',
        element: <RequestDetailPage />
      },
      {
        path: 'manage-requests',
        element: <ManageRequestsPage />
      },
      {
        path: 'manage-requests/request/:orderId',
        element: <OrderDetails />
      },
      {
        path: 'manage-requests/quote/:orderId',
        element: <WaitManager />
      },
      {
        path: 'manage-price',
        element: <ManagePricePage />
      },
      {
        path: 'manage-material-price',
        element: <ManageMaterialPrice />
      },
      {
        path: 'manage-design-price',
        element: <ManageDesignPrice />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminFrame />,
    children: [
      {
        path: 'manage-staff',
        element: <ManageStaffPage />
      },
      {
        path: 'manage-staff/create',
        element: <CreateStaff />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'manage-customer',
        element: <ManageCustomer />
      },
      {
        path: 'manage-diamonds',
        element: <ManageDiamonds />
      },
      {
        path: 'manage-diamonds/create',
        element: <CreateDiamond/>
      },
      {
        path: 'manage-diamonds/edit/:diamondId',
        element: <EditDiamond />
      },
      {
        path: 'manage-materials',
        element: <ManageMaterials />
      },
      {
        path: 'manage-designs',
        element: <ManageDesigns />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
