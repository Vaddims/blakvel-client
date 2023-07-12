import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useAppDispatch } from "../../middleware/hooks/reduxAppHooks"
import { UserRole } from "../../models/user.model"
import AdminOverview from "../../pages/AdminOverview"
import AdminProductManagement from "../../pages/AdminProductManagement"
import AdminProductTagManagement from "../../pages/AdminProductTagManagement"
import Catalog from "../../pages/Catalog"
import Contact from "../../pages/Contact"
import CreateProduct from "../../pages/CreateProduct"
import { CreateProductTag } from "../../pages/CreateProductTag"
import InspectProduct from "../../pages/InspectProduct";
import { InspectProductTag } from "../../pages/InspectProductTag"
import Landing from "../../pages/Landing"
import Login from "../../pages/Login"
import PageNotFound from "../../pages/PageNotFound"
import Product from "../../pages/Product"
import { ProductInspectionRouter } from "../../pages/ProductInspectionRouter"
import Signup from "../../pages/Signup"
// import { useGetAccessTokenQuery } from "../../services/api/usersApi";
import { useAuthentication } from "../../middleware/hooks/useAuthentication"
import ShoppingCart from "../../pages/ShoppingCart"
import Order from "../../pages/Order"
import Orders from "../../pages/Orders"
import AdminOrderManagement from "../../pages/AdminOrderManagement"
import AdminUserManagement from "../../pages/AdminUserManagement"
import AdminOrderInspection from "../../pages/AdminOrderInspection"
import ProductsSwitcher from "../ProductsSwitcher"
import InspectUserProfile from "../../pages/InspectUserProfile"
import ItemSaleProcess from "../../pages/ItemSaleProcess"
import UserQRCode from "../../pages/UserQRCode"
import AdminSupportManagement from "../../pages/AdminSupportManagement"

const AppRoutes: React.FC = () => {
  const { user } = useAuthentication();

  const createRoleProtectedRoute = (...roles: UserRole[]) => (
    <ProtectedRoute 
      allowed={!!user && (roles.length === 0 || roles.some((role) => user?.role === role))} 
      redirectPath='/auth/login' 
    />
  );

  const authProtectedRoute = createRoleProtectedRoute();
  const adminProtectedRoute = createRoleProtectedRoute(UserRole.Admin);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />

        <Route path="products">
          <Route index element={<ProductsSwitcher />} />
          <Route path=":id">
            <Route index element={<Product />} />
            <Route path="inspect" element={adminProtectedRoute}>
              <Route index element={<InspectProduct />} />
            </Route>
          </Route>
          <Route path="create" element={adminProtectedRoute}>
            <Route index element={<CreateProduct />} />
          </Route>
        </Route>

        <Route path="item-sale-process">
          <Route index element={<ItemSaleProcess />} />
        </Route>

        <Route path='product-tags'>
          <Route path=":id">
            <Route path="inspect" element={adminProtectedRoute}>
              <Route index element={<InspectProductTag />} />
            </Route>
          </Route>
          <Route path="create">
            <Route element={adminProtectedRoute}>
              <Route index element={<CreateProductTag />} />
            </Route>
          </Route>
        </Route>

        <Route path='orders'>
          <Route path=':orderId'>
            <Route path='inspect'>
              <Route index element={<AdminOrderInspection />} />
            </Route>
          </Route>
        </Route>

        <Route path="contact" element={<Contact />} />

        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route path="admin-panel" element={adminProtectedRoute}>
          <Route index element={<AdminOverview />} />
          <Route path="product-management">
            <Route index element={<AdminProductManagement />} />
          </Route>
          <Route path="tag-management">
            <Route index element={<AdminProductTagManagement />} />
            <Route path="inspect" />
          </Route>
          <Route path="order-management">
            <Route index element={<AdminOrderManagement />} />
          </Route>
          <Route path="user-management">
            <Route index element={<AdminUserManagement />} />
          </Route>
          <Route path="support-management">
            <Route index element={<AdminSupportManagement />} />
          </Route>
        </Route>

        <Route path='user' element={authProtectedRoute} >
          <Route index element={<InspectUserProfile />} />
          <Route path='qr-code' element={<UserQRCode />} />
          <Route path='cart' element={<ShoppingCart />} />
          <Route path='orders'>
            <Route index element={<Orders />} />
            <Route path=':orderId'>
              <Route index element={<Order />} />
            </Route>
          </Route>
        </Route>

        <Route path="users">
          <Route path=":id">
            <Route path="inspect">
              <Route index element={<InspectUserProfile />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;