import { useSelector } from "react-redux";
import { RootState } from "../../../Auth/store/store";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";
import { API_BASE_URL } from "../../../api";

export const HistoryPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [isLoadingHistory, setisLoadingHistory] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Histories
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (token) {
        const url = `${API_BASE_URL}/secure/api/histories?page=${currentPage - 1}&size=5`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const historyResponse = await fetch(url, requestOptions);
        if (!historyResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const historyResponseJson = await historyResponse.json();

        setHistories(historyResponseJson.content);
        setTotalPages(historyResponseJson.totalPages);
      }
      setisLoadingHistory(false);
    };
    fetchUserHistory().catch((error: any) => {
      setisLoadingHistory(false);
      setHttpError(error.message);
    });
  }, [token, currentPage]);

  if (isLoadingHistory) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {histories.length > 0 ? (
        <>
          <h5>Recent History:</h5>

          {histories.map((history) => (
            <div key={history.id}>
              <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      {history.image ? (
                        <img
                          src={history.image}
                          width="125"
                          height="195"
                          alt="Coupon"
                        />
                      ) : (
                        <img
                          src={require("./../../../Images/CouponImages/image-1.jpg")}
                          width="125"
                          height="195"
                          alt="Coupon"
                        />
                      )}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                      {history.image ? (
                        <img
                          src={history.image}
                          width="125"
                          height="195"
                          alt="Coupon"
                        />
                      ) : (
                        <img
                          src={require("./../../../Images/CouponImages/image-1.jpg")}
                          width="125"
                          height="195"
                          alt="Coupon"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title">{history.company}</h5>
                      <h4>{history.title}</h4>
                      <p className="card-text">{history.description}</p>
                      <hr />
                      <p className="card-text">
                        Checked out on: {history.checkoutDate}
                      </p>
                      <p className="card-text">
                        Removed on: {history.removeDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="mt-3">Currently no history:</h3>
          <Link className="btn btn-primary" to={"/search"}>
            Search for new coupon
          </Link>
        </>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
