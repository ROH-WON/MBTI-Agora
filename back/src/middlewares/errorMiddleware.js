function errorMiddleware(error, req, res, next) {
  let status = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (error.status && error.errorCode) {
    status = error.status;
    errorCode = error.errorCode;
  }

  console.log('\x1b[33m%s\x1b[0m', error);
  res.status(status).send({ message: error.message, errorCode: errorCode });
}

export { errorMiddleware };
