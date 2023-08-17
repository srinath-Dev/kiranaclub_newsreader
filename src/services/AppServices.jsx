import axiosClient from "./ApiClient";

export const END_POINTS = {
  everThing:'everything'

}
const appNewsKey = '319669f79bd34723be51e54af5e55dee'

export function getNews(category,fromDate,pageNumber,pageLimit) {
  const params = {
    q: category,
    from: fromDate,
    sortBy:'publishedAt',
    page:pageNumber,
    pageSize:pageLimit,
    apiKey:appNewsKey
  };
  return axiosClient.get(END_POINTS.everThing, {
    timeout: 30000,
    params: params,
  });
}
