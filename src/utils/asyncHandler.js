const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    if (typeof requestHandler !== "function") {
      next(new Error("requestHandler is not a function"));
      return;
    }

    if (typeof next !== "function") {
      // handle error or throw an error
      return;
    }

    if (typeof req !== "object" || typeof res !== "object") {
      next(new Error("Invalid request or response object"));
      return;
    }

    const result = requestHandler(req, res, next);

    if (result instanceof Promise) {
      Promise.resolve(result).catch((err) => {
        console.error(err);
        next(err);
      });
    } else {
      next(new Error("requestHandler must return a Promise"));
    }
  };
};

export { asyncHandler };
