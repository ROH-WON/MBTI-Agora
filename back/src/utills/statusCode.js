class statusCode {
  static setResponseCode200(response) {
    response.status(200);
  }

  static setResponseCode201(response) {
    response.status(201);
  }
}

export { statusCode };
