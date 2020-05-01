import { isEmpty, isValidEmail, isValidURL } from "./helpers";

let validation_error = {};
let is_error = false;

export const languageInputValidation = (obj) => {
  const { L0_ID_Language, L_LanguageName, languages } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(L0_ID_Language)) {
    is_error = true;
    validation_error.L0_ID_Language = "Please enter L0_ID_Language";
  } else {
    if (
      languages?.filter((value) => L0_ID_Language == value.L0_ID_Language)
        .length
    ) {
      is_error = true;
      validation_error.L0_ID_Language = "L0_ID_Language is already exit";
    }
  }

  if (isEmpty(L_LanguageName)) {
    is_error = true;
    validation_error.L_LanguageName = "Please enter L_LanguageName";
  } else {
    if (
      languages?.filter((value) => L_LanguageName === value.L_LanguageName)
        .length
    ) {
      is_error = true;
      validation_error.L_LanguageName = "L_LanguageName is already exit";
    }
  }

  return {
    is_error,
    validation_error,
  };
};
// Illustration

export const illustrationInputValidation = (obj) => {
  const { I0_ID_Illustrator, I_IllustratorName, illustrators } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(I0_ID_Illustrator)) {
    is_error = true;
    validation_error.I0_ID_Illustrator = "Please enter I0_ID_Illustrator";
  } else {
    if (
      illustrators?.filter(
        (value) => I0_ID_Illustrator == value.I0_ID_Illustrator
      ).length
    ) {
      is_error = true;
      validation_error.I0_ID_Illustrator = "I0_ID_Illustrator is already exit";
    }
  }

  if (isEmpty(I_IllustratorName)) {
    is_error = true;
    validation_error.I_IllustratorName = "Please enter I_IllustratorName";
  } else {
    if (
      illustrators?.filter(
        (value) => I_IllustratorName === value.I_IllustratorName
      ).length
    ) {
      is_error = true;
      validation_error.I_IllustratorName = "I_IllustratorName is already exit";
    }
  }

  return {
    is_error,
    validation_error,
  };
};

export const ownerInputValidation = (obj) => {
  const {
    O0_ID_Owner,
    O_Company,
    O_Web,
    O_ContactName,
    O_ContactEmail,
    O_ContactTel,
    owners,
  } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(O0_ID_Owner)) {
    is_error = true;
    validation_error.O0_ID_Owner = "Please enter O0_ID_Owner";
  } else {
    if (owners?.filter((value) => O0_ID_Owner == value.O0_ID_Owner).length) {
      is_error = true;
      validation_error.O0_ID_Owner = "O0_ID_Owner is already exit";
    }
  }

  if (isEmpty(O_Company)) {
    is_error = true;
    validation_error.O_Company = "Please enter O_Company";
  }

  if (isEmpty(O_Web)) {
    is_error = true;
    validation_error.O_Web = "Please enter O_Web";
  } else {
    if (!isValidURL(O_Web)) {
      is_error = true;
      validation_error.O_Web = "O_Web is invalid";
    }
  }

  if (isEmpty(O_ContactName)) {
    is_error = true;
    validation_error.O_ContactName = "Please enter O_ContactName";
  }

  if (isEmpty(O_Company)) {
    is_error = true;
    validation_error.O_Company = "Please enter O_Company";
  }

  if (isEmpty(O_ContactEmail)) {
    is_error = true;
    validation_error.O_ContactEmail = "Please enter O_ContactEmail";
  } else {
    if (!isValidEmail(O_ContactEmail)) {
      is_error = true;
      validation_error.O_ContactEmail = "O_ContactEmail is invalid";
    }
  }

  if (isEmpty(O_ContactTel)) {
    is_error = true;
    validation_error.O_ContactTel = "Please enter O_ContactTel";
  }

  return {
    is_error,
    validation_error,
  };
};

export const autherInputValidation = (obj) => {
  const { A0_ID_Author, A_AuthorImage, A_AuthorName, Storage, authors } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(A0_ID_Author)) {
    is_error = true;
    validation_error.A0_ID_Author = "Please enter A0_ID_Author";
  } else {
    if (authors?.filter((value) => A0_ID_Author == value.A0_ID_Author).length) {
      is_error = true;
      validation_error.A0_ID_Author = "A0_ID_Author is already exit";
    }
  }

  if (isEmpty(A_AuthorImage)) {
    is_error = true;
    validation_error.A_AuthorImage = "Please enter A_AuthorImage";
  }

  if (isEmpty(A_AuthorName)) {
    is_error = true;
    validation_error.A_AuthorName = "Please enter A_AuthorName";
  }

  if (isEmpty(Storage)) {
    is_error = true;
    validation_error.Storage = "Please select auther image";
  }

  return {
    is_error,
    validation_error,
  };
};