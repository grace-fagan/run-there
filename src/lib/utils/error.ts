import { AxiosError } from 'axios';

const getAxiosError = (error: AxiosError) => {
  if (error.response) {
    return error.response.data;
  } else if (error.request) {
    return error.request;
  } else {
    return error;
  }
};

export const handleNetworkError = (e: Error | AxiosError) => {
  let error = e;
  let errorMsg = e.message;
  if (e instanceof AxiosError) {
    error = getAxiosError(e);
    errorMsg = error.message;
  }
  return errorMsg || error;
};
