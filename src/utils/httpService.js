const handleSuccess = (response) => {
  return {
    data: response,
    success: true,
  };
};

const handleFailure = (error) => {
  return {
    data: error,
    success: false,
  };
};

const httpFetchService = async (url, type, reqBody) => {
  const options = {
    method: type,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (reqBody) {
    options.body = JSON.stringify(reqBody); // Corrected the property name to 'body'
  }
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
    data = handleSuccess(data);
  } catch (e) {
    data = handleFailure(e);
  }
  return data;
};

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return handleSuccess(data);
  } catch (error) {
    return handleFailure(error);
  }
};

export { handleSuccess, handleFailure, httpFetchService, fetcher };
