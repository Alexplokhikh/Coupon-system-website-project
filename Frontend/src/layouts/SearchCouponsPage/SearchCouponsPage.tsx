import React, { useEffect, useState } from "react";
import CouponModel from "../../models/CouponModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchCoupon } from "./components/SearchCoupon";
import { Pagination } from "../Utils/Pagination";
import { API_BASE_URL } from "../../api";

export const SearchCouponsPage = () => {
  const [coupons, setCoupons] = useState<CouponModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(5);
  const [totalAmountOfCoupons, setTotalAmountOfCoupons] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [categorySelection, setCategorySelection] = useState("coupon category");

  useEffect(() => {
    const fetchCoupons = async () => {
      const baseUrl: string = `${API_BASE_URL}/api/coupons`;
      let url: string = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${couponsPerPage}`;
      } else {
        url = baseUrl + searchUrl;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.coupons;

      setTotalAmountOfCoupons(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loadedCoupons: CouponModel[] = [];

      for (const key in responseData) {
        loadedCoupons.push({
          id: responseData[key].id,
          uuid: responseData[key].uuid,
          companyId: responseData[key].companyId,
          category: responseData[key].category,
          title: responseData[key].title,
          description: responseData[key].description,
          startDate: responseData[key].startDate,
          endDate: responseData[key].endDate,
          amount: responseData[key].amount,
          price: responseData[key].price,
          imageUrl: responseData[key].imageUrl,
        });
      }
      setCoupons(loadedCoupons);
      setIsLoading(false);
    };
    fetchCoupons().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container-m5">
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandleChange = () => {
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=0&size=${couponsPerPage}`,
      );
    }
  };

  const categoryField = (value: string) => {
    if (
      value.toLowerCase() === "clothing" ||
      value.toLowerCase() === "footwear" ||
      value.toLowerCase() === "food" ||
      value.toLowerCase() === "electronics" ||
      value.toLowerCase() === "travel" ||
      value.toLowerCase() === "beauty" ||
      value.toLowerCase() === "computer" ||
      value.toLowerCase() === "security" ||
      value.toLowerCase() === "automotive" ||
      value.toLowerCase() === "toys"
    ) {
      setCategorySelection(value);
      setSearchUrl(
        `/search/findByCategoryContaining?category=${value}&page=0&size=${couponsPerPage}`,
      );
    } else {
      setCategorySelection("All");
      setSearchUrl(`?page=0&size=${couponsPerPage}`);
    }
  };

  const indexOfLastCoupon: number = currentPage * couponsPerPage;
  const indexOfFirstCoupon: number = indexOfLastCoupon - couponsPerPage;
  let lastItem =
    couponsPerPage * currentPage <= totalAmountOfCoupons
      ? couponsPerPage * currentPage
      : totalAmountOfCoupons;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-6">
            <div className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-labelledby="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-outline-success"
                onClick={() => searchHandleChange()}
              >
                Search
              </button>
            </div>
          </div>
          <div className="col-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {categorySelection}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li onClick={() => categoryField("All")}>
                  <a className="dropdown-item" href="#">
                    All
                  </a>
                </li>
                <li onClick={() => categoryField("Clothing")}>
                  <a className="dropdown-item" href="#">
                    Clothing
                  </a>
                </li>
                <li onClick={() => categoryField("Footwear")}>
                  <a className="dropdown-item" href="#">
                    Footwear
                  </a>
                </li>
                <li onClick={() => categoryField("Food")}>
                  <a className="dropdown-item" href="#">
                    Food
                  </a>
                </li>
                <li onClick={() => categoryField("Travel")}>
                  <a className="dropdown-item" href="#">
                    Travel
                  </a>
                </li>
                <li onClick={() => categoryField("Beauty")}>
                  <a className="dropdown-item" href="#">
                    Beauty
                  </a>
                </li>
                <li onClick={() => categoryField("Electronics")}>
                  <a className="dropdown-item" href="#">
                    Electronics
                  </a>
                </li>
                <li onClick={() => categoryField("Computer")}>
                  <a className="dropdown-item" href="#">
                    Computer
                  </a>
                </li>
                <li onClick={() => categoryField("Security")}>
                  <a className="dropdown-item" href="#">
                    Security
                  </a>
                </li>
                <li onClick={() => categoryField("Automotive")}>
                  <a className="dropdown-item" href="#">
                    Automotive
                  </a>
                </li>
                <li onClick={() => categoryField("Toys")}>
                  <a className="dropdown-item" href="#">
                    Toys
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h5>Number of results: ({totalAmountOfCoupons})</h5>
        </div>
        <p>
          {indexOfFirstCoupon + 1} to {lastItem} of {totalAmountOfCoupons}{" "}
          items:
        </p>
        {coupons.map((coupon) => (
          <SearchCoupon coupon={coupon} key={coupon.id} />
        ))}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};
