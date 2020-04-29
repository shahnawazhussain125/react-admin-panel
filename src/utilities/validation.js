import { isEmpty, isValidEmail } from "./helpers";

let validation_error = {};
let is_error = false;

export const registerInputValidation = (obj) => {
  validation_error = {};
  is_error = false;

  if (isEmpty(obj.user_name)) {
    is_error = true;
    validation_error.user_name = "Enter username";
  }

  if (isEmpty(obj.email)) {
    is_error = true;
    validation_error.email = "Enter your email";
  } else {
    if (!isValidEmail(obj.email)) {
      is_error = true;
      validation_error.email = "Enter a valid email address";
    }
  }

  if (isEmpty(obj.password)) {
    is_error = true;
    validation_error.password = "Enter a password";
  }

  return {
    is_error,
    validation_error,
  };
};

export const loginInputValidation = (obj) => {
  validation_error = {};
  is_error = false;

  if (isEmpty(obj.email)) {
    is_error = true;
    validation_error.email = "Enter your email";
  } else {
    if (!isValidEmail(obj.email)) {
      is_error = true;
      validation_error.email = "Enter a valid email address";
    }
  }

  if (isEmpty(obj.password)) {
    is_error = true;
    validation_error.password = "Enter a password";
  }

  return {
    is_error,
    validation_error,
  };
};

export const editProfileInputValidation = (obj) => {
  validation_error = {};
  is_error = false;

  if (isEmpty(obj.user_name)) {
    is_error = true;
    validation_error.user_name = "Enter username";
  }

  if (isEmpty(obj.phone_number)) {
    is_error = true;
    validation_error.phone_number = "Enter your phone number";
  }

  if (isEmpty(obj.email)) {
    is_error = true;
    validation_error.email = "Enter your email";
  } else {
    if (!isValidEmail(obj.email)) {
      is_error = true;
      validation_error.email = "Enter a valid email address";
    }
  }

  if (isEmpty(obj.location)) {
    is_error = true;
    validation_error.location = "Enter your location";
  }

  return {
    is_error,
    validation_error,
  };
};

export const reportInputValidation = (obj) => {
  validation_error = {};
  is_error = false;

  if (isEmpty(obj.type)) {
    is_error = true;
    validation_error.type = "Select your issue type";
  }

  if (isEmpty(obj.description)) {
    is_error = true;
    validation_error.description = "Plesae write a brief description";
  }

  if (isEmpty(obj.selectedImage)) {
    is_error = true;
    validation_error.selectedImage = "Please select an image";
  }

  return {
    is_error,
    validation_error,
  };
};
