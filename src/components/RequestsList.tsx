import React, { useEffect, useState } from "react";
import { fetchRequestsList } from "../api";
import {
  useFilteredAndSortedRequests,
  SORT_FIELDS,
} from "../hooks/useFilteredAndSortedRequests";
import type { CertificateRequestItem, RequestListFilters, SortConfig } from "../types";

const initialFilters: RequestListFilters = {
  reference_no: "",
  address_to: "",
  status: "",
};

const initialSortConfig: SortConfig = {
  field: SORT_FIELDS.ISSUED_ON,
  direction: "desc",
};

interface RequestsListProps {
  isActive?: boolean;
}

export default function RequestsList({ isActive = false }: RequestsListProps) {
  const [requests, setRequests] = useState<CertificateRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSortConfig);
  const [filters, setFilters] = useState<RequestListFilters>(initialFilters);

  useEffect(() => {
    if (!isActive) return;

    setLoading(true);
    setError(null);

    fetchRequestsList()
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load requests list. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [isActive]);

  const handleSort = (field: SortConfig["field"]) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" as const };
    });
  };

  const handleFilterChange = (field: keyof RequestListFilters) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const filteredAndSorted = useFilteredAndSortedRequests(
    requests,
    filters,
    sortConfig
  );

  const renderSortIndicator = (field: SortConfig["field"]) => {
    if (sortConfig.field !== field) return null;
    return (
      <span className="sort-indicator">
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <section className="card">
      <header className="card-header">
        <h2>Requests List</h2>
        <p className="card-subtitle">
          View all your submitted certificate requests and their current status.
        </p>
      </header>

      <div className="filters-row">
        <div className="filter-field">
          <label htmlFor="filter_reference_no" className="filter-label">
            Reference No. (full match)
          </label>
          <input
            id="filter_reference_no"
            type="text"
            className="filter-input"
            placeholder="e.g. REF-00123"
            value={filters.reference_no}
            onChange={handleFilterChange("reference_no")}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter_address_to" className="filter-label">
            Address to (contains)
          </label>
          <input
            id="filter_address_to"
            type="text"
            className="filter-input"
            placeholder="Embassy, Bank, HR…"
            value={filters.address_to}
            onChange={handleFilterChange("address_to")}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter_status" className="filter-label">
            Status (full match)
          </label>
          <input
            id="filter_status"
            type="text"
            className="filter-input"
            placeholder="e.g. Pending"
            value={filters.status}
            onChange={handleFilterChange("status")}
          />
        </div>
      </div>

      {loading && <p className="info-text">Loading requests…</p>}
      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && filteredAndSorted.length === 0 && (
        <p className="info-text">No requests found.</p>
      )}

      {!loading && !error && filteredAndSorted.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Reference No.</th>
                <th scope="col">Address to</th>
                <th scope="col">Purpose</th>
                <th
                  scope="col"
                  className="table-header--sortable"
                  onClick={() => handleSort(SORT_FIELDS.ISSUED_ON)}
                >
                  Issued on {renderSortIndicator(SORT_FIELDS.ISSUED_ON)}
                </th>
                <th
                  scope="col"
                  className="table-header--sortable"
                  onClick={() => handleSort(SORT_FIELDS.STATUS)}
                >
                  Status {renderSortIndicator(SORT_FIELDS.STATUS)}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((item, index) => (
                <tr key={`${item.reference_no ?? "row"}-${index}`}>
                  <td>{item.reference_no ?? "—"}</td>
                  <td>{item.address_to}</td>
                  <td className="table-purpose-cell">{item.purpose}</td>
                  <td>{item.issued_on}</td>
                  <td>{item.status ?? "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
