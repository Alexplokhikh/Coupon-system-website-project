import { useEffect, useState } from "react";
import CouponModel from "../../models/CouponModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useSelector } from "react-redux";
import { RootState } from "../../Auth/store/store";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { API_BASE_URL } from "../../api";

export const CouponCheckoutPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = token !== null;

  const [coupon, setCoupon] = useState<CouponModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //  Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  //  Checkout Count State
  const [currentCheckoutsCount, setCurrentCheckoutsCount] = useState(0);
  const [isLoadingCurrentCheckoutsCount, setIsLoadingCurrentCheckoutsCount] =
    useState(true);

  // is Coupon Check Out?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingCouponCheckedOut, setIsLoadingCouponCheckedOut] =
    useState(true);

  const couponId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchCoupon = async () => {
      const baseUrl: string = `${API_BASE_URL}/api/coupons/${couponId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const responseJson = await response.json();

      const loadedCoupon: CouponModel = {
        id: responseJson.id,
        uuid: responseJson.uuid,
        companyId: responseJson.companyId,
        category: responseJson.category,
        title: responseJson.title,
        description: responseJson.description,
        startDate: responseJson.startDate,
        endDate: responseJson.endDate,
        amount: responseJson.amount,
        price: responseJson.price,
        imageUrl: responseJson.imageUrl,
      };

      setCoupon(loadedCoupon);
      setIsLoading(false);
    };
    fetchCoupon().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchCouponReviews = async () => {
      const reviewUrl: string = `${API_BASE_URL}/api/reviews/search/findByCouponId?couponId=${couponId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error("something went wrong!");
      }

      const responseJsonReviews = await responseReviews.json();

      const responseData = responseJsonReviews._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          coupon_id: responseData[key].couponId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);

        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchCouponReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewCoupon = async () => {
      if (isAuthenticated) {
        const url = `${API_BASE_URL}/secure/api/reviews/user/coupon?couponId=${couponId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error("Something went wrong");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewCoupon().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchUserCurrentCheckoutsCount = async () => {
      if (isAuthenticated) {
        const url = `${API_BASE_URL}/secure/api/coupons/currentpurchases/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const currentCheckoutsCountResponse = await fetch(url, requestOptions);
        if (!currentCheckoutsCountResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const currentCheckoutsResponseJson =
          await currentCheckoutsCountResponse.json();
        setCurrentCheckoutsCount(currentCheckoutsResponseJson);
      }
      setIsLoadingCurrentCheckoutsCount(false);
    };
    fetchUserCurrentCheckoutsCount().catch((error: any) => {
      setIsLoadingCurrentCheckoutsCount(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutCoupon = async () => {
      if (isAuthenticated) {
        const url = `${API_BASE_URL}/secure/api/coupons/ischeckedout/byuser?couponId=${couponId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const couponCheckedOut = await fetch(url, requestOptions);

        if (!couponCheckedOut.ok) {
          throw new Error("Something went wrong!");
        }

        const couponCheckedOutResponseJson = await couponCheckedOut.json();
        setIsCheckedOut(couponCheckedOutResponseJson);
      }
      setIsLoadingCouponCheckedOut(false);
    };
    fetchUserCheckedOutCoupon().catch((error: any) => {
      setIsLoadingCouponCheckedOut(false);
      setHttpError(error.message);
    });
  }, [isAuthenticated]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentCheckoutsCount ||
    isLoadingCouponCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container-m5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutCoupon() {
    const url = `${API_BASE_URL}/secure/api/coupons/checkout?couponId=${coupon?.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let couponId: number = 0;
    if (coupon?.id) {
      couponId = coupon.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      couponId,
      reviewDescription,
    );
    const url = `${API_BASE_URL}/secure/api/reviews`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {coupon?.imageUrl ? (
              <img
                src={coupon?.imageUrl}
                width="225"
                height="345"
                alt="coupon"
              />
            ) : (
              <img
                src={require("../../Images/CouponImages/image-1.jpg")}
                width="225"
                height="345"
                alt="coupon"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{coupon?.title}</h2>
              <h5 className="text-primary">{coupon?.companyId}</h5>
              <p className="lead">{coupon?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            coupon={coupon}
            mobile={false}
            currentCheckoutsCount={currentCheckoutsCount}
            isAuthenticated={isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutCoupon}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} couponId={coupon?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {coupon?.imageUrl ? (
            <img src={coupon?.imageUrl} width="225" height="345" alt="coupon" />
          ) : (
            <img
              src={require("../../Images/CouponImages/image-1.jpg")}
              width="225"
              height="345"
              alt="coupon"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{coupon?.title}</h2>
            <h5 className="text-primary">{coupon?.companyId}</h5>
            <p className="lead">{coupon?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          coupon={coupon}
          mobile={true}
          currentCheckoutsCount={currentCheckoutsCount}
          isAuthenticated={isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutCoupon}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} couponId={coupon?.id} mobile={true} />
      </div>
    </div>
  );
};
