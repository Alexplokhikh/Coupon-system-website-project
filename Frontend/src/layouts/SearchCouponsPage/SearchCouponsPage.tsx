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
  }, [couponsPerPage, currentPage, searchUrl]);

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
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("All")}
                  >
                    All
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Clothing")}
                  >
                    Clothing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Footwear")}
                  >
                    Footwear
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Food")}
                  >
                    Food
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Travel")}
                  >
                    Travel
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Beauty")}
                  >
                    Beauty
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Electronics")}
                  >
                    Electronics
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Computer")}
                  >
                    Computer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Security")}
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Automotive")}
                  >
                    Automotive
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => categoryField("Toys")}
                  >
                    Toys
                  </button>
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
