
const apiResponse = (res, statusCode, message, data = null) => {
  const payload = {
    success: statusCode >= 200 && statusCode < 300,
    message,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

export default apiResponse;

