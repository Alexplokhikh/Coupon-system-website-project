import React, { useState } from "react";
import { Button } from "reactstrap";
import { AddCoupon } from "./components/AddCoupon";

export const ManagePage = () => {
  const [changeQuantityClick, setChangeQuantityClick] = useState(false);
  const [addCouponClick, setAddCouponClick] = useState(true);

  function addCouponClickFunc() {
    setChangeQuantityClick(false);
    setAddCouponClick(true);
  }

  function changeQuantityClickFunc() {
    setChangeQuantityClick(true);
    setAddCouponClick(false);
  }

  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Catalog</h3>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <Button
              onClick={addCouponClickFunc}
              className="nav-link active"
              id="nav-add-coupon-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-coupon"
              type="button"
              role="tab"
              aria-controls="nav-add-coupon"
              aria-selected="true"
            >
              Create new Coupon
            </Button>
            <Button
              onClick={changeQuantityClickFunc}
              className="nav-link"
              id="nav-quantity-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-coupon"
              type="button"
              role="tab"
              aria-controls="nav-quantity"
              aria-selected="false"
            >
              Change Quantity
            </Button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-coupon-tab"
          >
            {addCouponClick ? (
              <>
                <AddCoupon />
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            className="tab-pane fade"
            id="nav-quantity"
            role="tabpanel"
            aria-labelledby="nav-quantity-tab"
          >
            {changeQuantityClick ? <>Change Quantity</> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};
