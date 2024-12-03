interface IUrlParams {
  senderLocation: [number, number];
  receiverLocation: [number, number];
}

/**
 * Generate url route for transport
 * @param transportType type of transport
 * @param params  senderLocation and receiverLocation with [latitude, longitude]
 */
export const generateUrlRoute = (transportType: string, params: IUrlParams) => {
  const { senderLocation, receiverLocation } = params;
  return `${process.env.ROUTE_API_URL}?transportMode=${transportType}&origin=${senderLocation[0]},${senderLocation[1]}&destination=${receiverLocation[0]},${receiverLocation[1]}&return=summary&apiKey=${process.env.API_HERE}`;
};

export const generateUrlQrCode = (data: { amount: number; code: string }) => {
  return `${process.env.QR_CODE_API_URL}?bank=${process.env.BANK_NAME}&acc=${process.env.BANK_ACCOUNT}&template=qronly&amount=${data.amount}&des=SEVQR OD${data.code}`;
};
