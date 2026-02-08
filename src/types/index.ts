/** Payload for creating a certificate request (API request body) */
export interface CertificateRequestPayload {
  address_to: string;
  purpose: string;
  issued_on: string;
  employee_id: string;
}

/** Single item from request-list API (may have reference_no, status from backend) */
export interface CertificateRequestItem extends CertificateRequestPayload {
  reference_no?: string;
  status?: string;
}

/** Form values for Request Certificate form */
export interface CertificateRequestFormValues {
  address_to: string;
  purpose: string;
  issued_on: string;
  employee_id: string;
}

/** API response for request-certificate POST (spec uses "responce" typo) */
export interface SubmitCertificateResponse {
  responce?: string;
}

/** Filters for the requests list table */
export interface RequestListFilters {
  reference_no: string;
  address_to: string;
  status: string;
}

/** Sort configuration */
export interface SortConfig {
  field: "issued_on" | "status";
  direction: "asc" | "desc";
}
