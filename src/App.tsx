import React, { useState } from "react";
import RequestCertificateForm from "./components/RequestCertificateForm";
import RequestsList from "./components/RequestsList";

type Page = "request" | "list";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("request");

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Employee Certificate Portal</h1>
          <nav className="app-nav">
            <button
              className={
                activePage === "request"
                  ? "nav-button nav-button--active"
                  : "nav-button"
              }
              onClick={() => setActivePage("request")}
            >
              Request Certificate
            </button>
            <button
              className={
                activePage === "list"
                  ? "nav-button nav-button--active"
                  : "nav-button"
              }
              onClick={() => setActivePage("list")}
            >
              Requests List
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div hidden={activePage !== "request"}>
          <RequestCertificateForm />
        </div>
        <div hidden={activePage !== "list"}>
          <RequestsList isActive={activePage === "list"} />
        </div>
      </main>
    </div>
  );
}
