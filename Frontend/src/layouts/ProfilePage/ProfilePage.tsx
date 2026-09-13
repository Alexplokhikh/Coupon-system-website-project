import { Button } from "reactstrap";
import { Purchases } from "./components/Purchases";
import { HistoryPage } from "./components/HistoryPage";
import { useState } from "react";

export const ProfilePage = () => {
  const [historyClick, setHistoryClick] = useState(false);

  return (
    <div className="container">
      <div className="mt-3">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <Button
              onClick={() => setHistoryClick(false)}
              className="nav-link active"
              id="nav-purchases-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-purchases"
              type="button"
              role="tab"
              aria-controls="nav-purchases"
              aria-selected="true"
            >
              Purchases
            </Button>
            <Button
              onClick={() => setHistoryClick(true)}
              className="nav-link"
              id="history-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-history"
              type="button"
              role="tab"
              aria-controls="nav-history"
              aria-selected="false"
            >
              Your History
            </Button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-purchases"
            role="tabpanel"
            aria-labelledby="nav-purchases-tab"
          >
            <Purchases />
          </div>
          <div
            className="tab-pane fade"
            id="nav-history"
            role="tabpanel"
            aria-labelledby="nav-history-tab"
          >
            {historyClick ? <HistoryPage /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};
