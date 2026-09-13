import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { RootState } from "../../Auth/store/store";
import { ExtractJWT } from "../Utils/ExtractJWT";
import { CustomerButtons } from "./CustomerButtons";
import { CompanyButtons } from "./CompanyButtons";

export const Navbar = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const role = token ? ExtractJWT(token, "roles") : null;
  const isCompany = role === "COMPANY" || role === "[COMPANY]";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Coupon System</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Search Coupons
              </NavLink>
            </li>
          </ul>
          <ul className="d-inline-flex navbar-nav ms-auto">
            {!token ? (
              <li className="d-inline-flex nav-item m-1">
                <Link
                  type="button"
                  to="/login"
                  className="btn btn-outline-light"
                >
                  Sign in
                </Link>
              </li>
            ) : !isCompany ? (
              <CustomerButtons />
            ) : (
              <CompanyButtons />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
