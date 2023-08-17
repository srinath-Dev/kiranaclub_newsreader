import axiosClient from "./ApiClient";

export const END_POINTS = {
  everThing:'everything'

}
const appNewsKey = '1e71f2d95be2495c96bbebe3a874060c'

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
