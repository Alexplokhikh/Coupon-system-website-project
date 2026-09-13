import { useSelector } from "react-redux";
import { RootState } from "../../../Auth/store/store";
import { useState } from "react";
import { Button, Form } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ExtractJWT } from "../../Utils/ExtractJWT";
import addCouponRequest from "../../../models/AddCouponRequest";
import AddCouponRequest from "../../../models/AddCouponRequest";
import { API_BASE_URL } from "../../../api";

export const AddCoupon = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = token !== null;

  const isCompany =
    (isAuthenticated && ExtractJWT(token, "roles") === "COMPANY") ||
    (isAuthenticated && ExtractJWT(token, "roles") === "[COMPANY]");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Category");
  const [amount, setAmount] = useState(0);
  const [image, setImage] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [price, setPrice] = useState(0);

  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  async function base64Convert(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }

  async function submitCoupon() {
    const url = `${API_BASE_URL}/secure/api/company/add/coupon`;
    if (
      isCompany &&
      title !== "" &&
      company !== 0 &&
      category !== "Category" &&
      description !== "" &&
      amount > 0 &&
      price > 0 &&
      startDate != null &&
      endDate != null
    ) {
      const coupon: addCouponRequest = new AddCouponRequest(
        company,
        category,
        title,
        description,
        startDate,
        endDate,
        amount,
        price,
        image,
      );
      coupon.imageUrl = image;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coupon),
      };

      const submitNewCouponResponse = await fetch(url, requestOptions);
      if (!submitNewCouponResponse.ok) {
        throw new Error("Something went wrong!");
      }
      setTitle("");
      setCompany(0);
      setDescription("");
      setAmount(0);
      setCategory("Category");
      setImage(null);
      setStartDate(null);
      setEndDate(null);
      setPrice(0);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Coupon Added Successfully
        </div>
      )}
      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          All Fields must be filled!
        </div>
      )}
      <div className="card">
        <div className="card-header">Add new Coupon</div>
        <div className="card-body">
          <Form method="POST">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  required
                  onChange={(e) => setCompany(Number(e.target.value))}
                  value={company}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <Button
                  className="form-control btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </Button>
                <ul
                  id="addCouponId"
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Clothing")}
                      className="dropdown-item"
                    >
                      Clothing
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Footwear")}
                      className="dropdown-item"
                    >
                      Footwear
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Food")}
                      className="dropdown-item"
                    >
                      Food
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Travel")}
                      className="dropdown-item"
                    >
                      Travel
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Beauty")}
                      className="dropdown-item"
                    >
                      Beauty
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Electronics")}
                      className="dropdown-item"
                    >
                      Electronics
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Computer")}
                      className="dropdown-item"
                    >
                      Computer
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Security")}
                      className="dropdown-item"
                    >
                      Security
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Automotive")}
                      className="dropdown-item"
                    >
                      Automotive
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => categoryField("Toys")}
                      className="dropdown-item"
                    >
                      Toys
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextArea1"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  required
                  onChange={(e) => setPrice(Number(e.target.value))}
                  value={price}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  required
                  onChange={(e) => setAmount(Number(e.target.value))}
                  value={amount}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
            </div>
            <input type="file" onChange={(e) => base64Convert(e)} />
            <div>
              <Button
                type="button"
                className="btn btn-primary mt-3"
                onClick={submitCoupon}
              >
                Add Coupon
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
