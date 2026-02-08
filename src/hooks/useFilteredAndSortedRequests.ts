import { useMemo } from "react";
import type { CertificateRequestItem, RequestListFilters, SortConfig } from "../types";

export const SORT_FIELDS = {
  ISSUED_ON: "issued_on",
  STATUS: "status",
} as const;

function parseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function useFilteredAndSortedRequests(
  requests: CertificateRequestItem[],
  filters: RequestListFilters,
  sortConfig: SortConfig
): CertificateRequestItem[] {
  return useMemo(() => {
    let data = [...requests];

    if (filters.reference_no.trim()) {
      const value = filters.reference_no.trim().toLowerCase();
      data = data.filter(
        (item) =>
          (item.reference_no ?? "").toString().toLowerCase() === value
      );
    }

    if (filters.address_to.trim()) {
      const value = filters.address_to.trim().toLowerCase();
      data = data.filter((item) =>
        (item.address_to ?? "").toString().toLowerCase().includes(value)
      );
    }

    if (filters.status.trim()) {
      const value = filters.status.trim().toLowerCase();
      data = data.filter(
        (item) => (item.status ?? "").toString().toLowerCase() === value
      );
    }

    if (sortConfig.field === SORT_FIELDS.ISSUED_ON) {
      data.sort((a, b) => {
        const dateA = parseDate(a.issued_on);
        const dateB = parseDate(b.issued_on);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      });
    } else if (sortConfig.field === SORT_FIELDS.STATUS) {
      data.sort((a, b) => {
        const statusA = (a.status ?? "").toString().toLowerCase();
        const statusB = (b.status ?? "").toString().toLowerCase();
        if (statusA < statusB) return -1;
        if (statusA > statusB) return 1;
        return 0;
      });
    }

    if (sortConfig.direction === "desc") {
      data.reverse();
    }

    return data;
  }, [requests, filters, sortConfig]);
}
