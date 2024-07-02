export const convertErrorMessages = (errors) => {
  return errors.array().map((error) => ({
    field: error.path,
    msg: error.msg,
  }));
};
