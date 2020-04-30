import { isEmpty, isValidEmail } from "./helpers";

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
