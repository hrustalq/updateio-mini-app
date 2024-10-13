import apiClient from "..";

export async function confirmQr(code: string) {
  return await apiClient.post(`/auth/qr-code/confirm/${code}`);
}