import axios from "axios";
import type {
  CertificateRequestPayload,
  CertificateRequestItem,
  SubmitCertificateResponse,
} from "./types";

const API_KEY =
  "ef2f40af2fca45cfabd2d82d4805a22e";

const BASE_URL = "https://zalexinc.azure-api.net";

export async function submitCertificateRequest(
  payload: CertificateRequestPayload
): Promise<SubmitCertificateResponse> {
  const url = `${BASE_URL}/request-certificate?subscription-key=${encodeURIComponent(API_KEY)}`;

  const response = await axios.post<SubmitCertificateResponse>(url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function fetchRequestsList(): Promise<CertificateRequestItem[]> {
  const url = `${BASE_URL}/request-list?subscription-key=${encodeURIComponent(API_KEY)}`;

  const response = await axios.get<CertificateRequestItem[]>(url);
  const data = response.data;
  return Array.isArray(data) ? data : [];
}
