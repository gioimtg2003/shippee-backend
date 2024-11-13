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
