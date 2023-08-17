import axios from 'axios';

const BASE_URL = "https://newsapi.org/v2/"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    "device": "mobile",
    "platform": "android",
  },
});


axiosClient.interceptors.request.use(function (config) {
  console.log(config);
  return config;
}, function (error) {
  // Do something with request error
  console.log("Request "+error);
  return Promise.reject(error);
});


axiosClient.interceptors.response.use(
  function (response) {
    console.log("Successfully get/post work by interceptors");
    return response;
  },
  function (error) {
    let res = error.response;
    if (res.status == 401) {
      console.log("401 "+error);

    }
    console.error('Api error: '+ res.data.code);
    return Promise.reject(error);
  }

);

export default  axiosClient;

