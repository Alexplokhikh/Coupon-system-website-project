import React from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchCouponsPage } from "./layouts/SearchCouponsPage/SearchCouponsPage";
import { CouponCheckoutPage } from "./layouts/CouponCheckoutPage/CouponCheckoutPage";
import { Login } from "./Auth/components/Login";
import { RegisterCompany } from "./Auth/components/RegisterCompany";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { useSelector } from "react-redux";
import { RootState } from "./Auth/store/store";
import { ReviewListPage } from "./layouts/CouponCheckoutPage/ReviewListPage/ReviewListPage";
import { ProfilePage } from "./layouts/ProfilePage/ProfilePage";
import { ManagePage } from "./layouts/ManagePage/ManagePage";
import { RegisterPath } from "./Auth/components/RegisterPath";
import { RegisterCustomer } from "./Auth/components/RegisterCustomer";
import { ExtractJWT } from "./layouts/Utils/ExtractJWT";

function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  const role = token ? ExtractJWT(token, "roles") : null;
  const isCompany = role === "COMPANY" || role === "[COMPANY]";

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={token ? <HomePage /> : <Login />} />
          <Route path="/reviews/:couponId" element={<ReviewListPage />} />
          <Route path="/search" element={<SearchCouponsPage />} />
          <Route path="/checkout/:couponId" element={<CouponCheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPath />} />
          <Route path="/register-company" element={<RegisterCompany />} />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route
            path="/profile"
            element={
              token ? isCompany ? <ManagePage /> : <ProfilePage /> : <Login />
            }
          />
          <Route
            path="/manage"
            element={
              token ? isCompany ? <ManagePage /> : <ProfilePage /> : <Login />
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
