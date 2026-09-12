import { useSelector } from "react-redux";
import { RootState } from "../../../Auth/store/store";
import { useEffect, useState } from "react";
import ProfileCurrentPurchases from "../../../models/ProfileCurrentPurchases";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { PurchasesModal } from "./PurchasesModal";
import { API_BASE_URL } from "../../../api";

export const Purchases = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = token !== null;

  const [httpError, setHttpError] = useState(null);

  //  Current Purchases
  const [profileCurrentPurchases, setProfileCurrentPurchases] = useState<
    ProfileCurrentPurchases[]
  >([]);
  const [isLoadingUserPurchases, setIsLoadingUserPurchases] = useState(true);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentPurchases = async () => {
      if (isAuthenticated) {
        const url = `${API_BASE_URL}/secure/api/coupons/currentpurchases`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const profileCurrentPurchasesResponse = await fetch(
          url,
          requestOptions,
        );
        if (!profileCurrentPurchasesResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const profileCurrentPurchasesResponseJson =
          await profileCurrentPurchasesResponse.json();
        setProfileCurrentPurchases(profileCurrentPurchasesResponseJson);
      }
      setIsLoadingUserPurchases(false);
    };
    fetchUserCurrentPurchases().catch((error: any) => {
      setIsLoadingUserPurchases(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [isAuthenticated, checkout]);

  if (isLoadingUserPurchases) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function removeCoupon(couponId: number) {
    const url = `${API_BASE_URL}/secure/api/coupons/remove?couponId=${couponId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const removeResponse = await fetch(url, requestOptions);
    if (!removeResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setCheckout(!checkout);
  }

  return (
    <div>
      {/*Desktop*/}
      <div className="d-none d-lg-block mt-2">
        {profileCurrentPurchases.length > 0 ? (
          <>
            <h5>Current Purchases: </h5>

            {profileCurrentPurchases.map((profileCurrentPurchases) => (
              <div key={profileCurrentPurchases.coupon.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {profileCurrentPurchases.coupon?.imageUrl ? (
                      <img
                        src={profileCurrentPurchases.coupon?.imageUrl}
                        width="225"
                        height="350"
                        alt="Coupon"
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/CouponImages/image-1.jpg")}
                        width="225"
                        height="350"
                      />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Options</h4>
                        {profileCurrentPurchases.daysLeft > 0 && (
                          <p className="text-secondary">
                            Due in {profileCurrentPurchases.daysLeft} days
                          </p>
                        )}
                        <div className="list-group mt-3">
                          <Button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${profileCurrentPurchases.coupon.id}`}
                          >
                            Manage Purchase
                          </Button>
                          <Link
                            to={"/search"}
                            className="list-group-item list-group-item-action"
                          >
                            Search more coupons
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">
                        Help others find their next cost saving by leaving a
                        review:
                      </p>
                      <Link
                        className="btn btn-primary"
                        to={`/checkout/${profileCurrentPurchases.coupon.id}`}
                      >
                        Leave a review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <PurchasesModal
                  profileCurrentPurchase={profileCurrentPurchases}
                  mobile={false}
                  removeCoupon={removeCoupon}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no purchases</h3>
            <Link className="btn btn-primary" to={`/search`}>
              Search for a new coupon
            </Link>
          </>
        )}
      </div>

      {/*Mobile*/}
      <div className="container d-lg-none mt-2">
        {profileCurrentPurchases.length > 0 ? (
          <>
            <h5 className="mb-3">Current Purchases: </h5>

            {profileCurrentPurchases.map((profileCurrentPurchases) => (
              <div key={profileCurrentPurchases.coupon.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {profileCurrentPurchases.coupon?.imageUrl ? (
                    <img
                      src={profileCurrentPurchases.coupon?.imageUrl}
                      width="225"
                      height="350"
                      alt="Coupon"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/CouponImages/image-1.jpg")}
                      width="225"
                      height="350"
                    />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body container">
                    <div className="mt-3">
                      <h4>Options</h4>
                      {profileCurrentPurchases.daysLeft > 0 && (
                        <p className="text-secondary">
                          Due in {profileCurrentPurchases.daysLeft} days
                        </p>
                      )}
                      <div className="list-group mt-3">
                        <Button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${profileCurrentPurchases.coupon.id}`}
                        >
                          Manage Purchase
                        </Button>
                        <Link
                          to={"/search"}
                          className="list-group-item list-group-item-action"
                        >
                          Search more coupons
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">
                      Help others find their next cost saving by leaving a
                      review:
                    </p>
                    <Link
                      className="btn btn-primary"
                      to={`/checkout/${profileCurrentPurchases.coupon.id}`}
                    >
                      Leave a review
                    </Link>
                  </div>
                </div>
                <hr />
                <PurchasesModal
                  profileCurrentPurchase={profileCurrentPurchases}
                  mobile={true}
                  removeCoupon={removeCoupon}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no purchases</h3>
            <Link className="btn btn-primary" to={`/search`}>
              Search for a new coupon
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
