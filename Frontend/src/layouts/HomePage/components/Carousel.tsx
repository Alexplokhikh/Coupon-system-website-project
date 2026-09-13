import { ReturnCoupon } from "./Carousel/ReturnCoupon";
import React, { useEffect, useState } from "react";
import CouponModel from "../../../models/CouponModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../api";

export const Carousel = () => {
  const [coupons, setCoupons] = useState<CouponModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      const baseUrl: string = `${API_BASE_URL}/api/coupons`;
      const url: string = `${baseUrl}?page=0&size=9`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.coupons;

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
  }, []);

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

  if (coupons.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>No coupons are currently available.</h3>
        <Link className="btn btn-outline-secondary btn-lg mt-3" to="/search">
          Search Coupons
        </Link>
      </div>
    );
  }

  const desktopSlides: CouponModel[][] = [];

  for (let index = 0; index < coupons.length; index += 3) {
    desktopSlides.push(coupons.slice(index, index + 3));
  }

  return (
    <div className="container-mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>check our hot coupons!</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5
            d-none d-lg-block"
        data-bs-interval="false"
      >
        {/*Desktop*/}
        <div className="carousel-inner">
          {desktopSlides.map((slide, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={slide.map((coupon) => coupon.id).join("-")}
            >
              <div className="row d-flex justify-content-center align-items-center">
                {slide.map((coupon) => (
                  <ReturnCoupon coupon={coupon} key={coupon.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/*Mobile*/}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          <ReturnCoupon coupon={coupons[0]} key={coupons[0].id} />
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
};
