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

export const bookInputValidation = (obj) => {
  const {
    B_BookTitle,
    BAuthorName,
    B0_ID_Book,
    B_Web,
    L_LanguageName,
    L0_ID_Language,
    L0_ID_Language_WEB,
    B_BookImage,
    O_Company,
    O_Web,
    O_ContactName,
    O_ContactEmail,
    O_ContactTel,
    O0_ID_Owner,
    O0_ID_Owner_WEB,
    Storage,
    books,
  } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(B0_ID_Book)) {
    is_error = true;
    validation_error.B0_ID_Book = "Please enter B0_ID_Book";
  } else {
    if (books?.filter((value) => B0_ID_Book == value.B0_ID_Book).length) {
      is_error = true;
      validation_error.B0_ID_Book = "B0_ID_Book is already exit";
    }
  }

  if (isEmpty(B_BookTitle)) {
    is_error = true;
    validation_error.B_BookTitle = "Please enter B_BookTitle";
  }

  if (isEmpty(BAuthorName)) {
    is_error = true;
    validation_error.BAuthorName = "Please enter BAuthorName";
  }

  if (isEmpty(Storage)) {
    is_error = true;
    validation_error.Storage = "Please select book image";
  }

  if (isEmpty(B_Web)) {
    is_error = true;
    validation_error.B_Web = "Please enter B_Web";
  }

  if (isEmpty(L_LanguageName)) {
    is_error = true;
    validation_error.L_LanguageName = "Please enter L_LanguageName";
  }

  if (isEmpty(L0_ID_Language)) {
    is_error = true;
    validation_error.L0_ID_Language = "Please enter L0_ID_Language";
  }

  if (isEmpty(L0_ID_Language_WEB)) {
    is_error = true;
    validation_error.L0_ID_Language_WEB = "Please enter L0_ID_Language_WEB";
  }

  if (isEmpty(B_BookImage)) {
    is_error = true;
    validation_error.B_BookImage = "Please enter B_BookImage";
  }

  if (isEmpty(O_Company)) {
    is_error = true;
    validation_error.O_Company = "Please enter O_Company";
  }

  if (isEmpty(O_Web)) {
    is_error = true;
    validation_error.O_Web = "Please enter O_Web";
  }

  if (isEmpty(O_ContactName)) {
    is_error = true;
    validation_error.O_ContactName = "Please enter O_ContactName";
  }

  if (isEmpty(O_ContactEmail)) {
    is_error = true;
    validation_error.O_ContactEmail = "Please enter O_ContactEmail";
  }

  if (isEmpty(O_ContactTel)) {
    is_error = true;
    validation_error.O_ContactTel = "Please enter O_ContactTel";
  }

  if (isEmpty(O0_ID_Owner)) {
    is_error = true;
    validation_error.O0_ID_Owner = "Please enter O0_ID_Owner";
  }

  if (isEmpty(O0_ID_Owner_WEB)) {
    is_error = true;
    validation_error.O0_ID_Owner_WEB = "Please enter O0_ID_Owner_WEB";
  }

  return {
    is_error,
    validation_error,
  };
};

export const talesInputValidation = (obj) => {
  const {
    A0_ID_Author,
    A0_ID_Author_WEB,
    A_AuthorImage,
    A_AuthorName,
    A_Storage,
    B_BookTitle,
    B_BAuthorName,
    B_Web,
    B0_ID_Book,
    B_BookImage,
    B_Storage,
    B0_ID_Book_WEB,
    T_TaleTitle,
    T_TaleImage,
    T_Storage,
    T_TaleContent,
    L_LanguageName,
    L0_ID_Language,
    L0_ID_Language_WEB,
    O_Company,
    O_Web,
    O_ContactName,
    O_ContactEmail,
    O_ContactTel,
    O0_ID_Owner,
    O0_ID_Owner_WEB,
    I0_ID_Illustrator_WEB,
    I0_ID_Illustrator,
    I_IllustratorName,
  } = obj;
  validation_error = {};
  is_error = false;

  if (isEmpty(A0_ID_Author)) {
    is_error = true;
    validation_error.A0_ID_Author = "Please enter A0_ID_Author";
  }

  if (isEmpty(A0_ID_Author_WEB)) {
    is_error = true;
    validation_error.A0_ID_Author_WEB = "Please enter A0_ID_Author_WEB";
  }

  if (isEmpty(A_AuthorImage)) {
    is_error = true;
    validation_error.A_AuthorImage = "Please enter A_AuthorImage";
  }

  if (isEmpty(A_AuthorName)) {
    is_error = true;
    validation_error.A_AuthorName = "Please enter A_AuthorName";
  }

  if (isEmpty(A_Storage)) {
    is_error = true;
    validation_error.A_Storage = "Please enter A_Storage";
  }

  if (isEmpty(B_Storage)) {
    is_error = true;
    validation_error.B_Storage = "Please enter B_Storage";
  }

  if (isEmpty(B0_ID_Book_WEB)) {
    is_error = true;
    validation_error.B0_ID_Book_WEB = "Please enter B0_ID_Book_WEB";
  }

  if (isEmpty(T_TaleTitle)) {
    is_error = true;
    validation_error.T_TaleTitle = "Please enter T_TaleTitle";
  }

  if (isEmpty(T_TaleImage)) {
    is_error = true;
    validation_error.T_TaleImage = "Please enter T_TaleImage";
  }

  if (isEmpty(T_Storage)) {
    is_error = true;
    validation_error.T_Storage = "Please enter T_Storage";
  }

  if (isEmpty(T_TaleContent)) {
    is_error = true;
    validation_error.T_TaleContent = "Please enter T_TaleContent";
  }

  if (isEmpty(I0_ID_Illustrator_WEB)) {
    is_error = true;
    validation_error.I0_ID_Illustrator_WEB =
      "Please enter I0_ID_Illustrator_WEB";
  }

  if (isEmpty(I0_ID_Illustrator)) {
    is_error = true;
    validation_error.I0_ID_Illustrator = "Please enter I0_ID_Illustrator";
  }

  if (isEmpty(I_IllustratorName)) {
    is_error = true;
    validation_error.I_IllustratorName = "Please enter I_IllustratorName";
  }

  if (isEmpty(B0_ID_Book)) {
    is_error = true;
    validation_error.B0_ID_Book = "Please enter B0_ID_Book";
  }

  if (isEmpty(B_BookTitle)) {
    is_error = true;
    validation_error.B_BookTitle = "Please enter B_BookTitle";
  }

  if (isEmpty(B_BAuthorName)) {
    is_error = true;
    validation_error.B_BAuthorName = "Please enter B_BAuthorName";
  }

  if (isEmpty(B_Web)) {
    is_error = true;
    validation_error.B_Web = "Please enter B_Web";
  }

  if (isEmpty(L_LanguageName)) {
    is_error = true;
    validation_error.L_LanguageName = "Please enter L_LanguageName";
  }

  if (isEmpty(L0_ID_Language)) {
    is_error = true;
    validation_error.L0_ID_Language = "Please enter L0_ID_Language";
  }

  if (isEmpty(L0_ID_Language_WEB)) {
    is_error = true;
    validation_error.L0_ID_Language_WEB = "Please enter L0_ID_Language_WEB";
  }

  if (isEmpty(B_BookImage)) {
    is_error = true;
    validation_error.B_BookImage = "Please enter B_BookImage";
  }

  if (isEmpty(O_Company)) {
    is_error = true;
    validation_error.O_Company = "Please enter O_Company";
  }

  if (isEmpty(O_Web)) {
    is_error = true;
    validation_error.O_Web = "Please enter O_Web";
  }

  if (isEmpty(O_ContactName)) {
    is_error = true;
    validation_error.O_ContactName = "Please enter O_ContactName";
  }

  if (isEmpty(O_ContactEmail)) {
    is_error = true;
    validation_error.O_ContactEmail = "Please enter O_ContactEmail";
  }

  if (isEmpty(O_ContactTel)) {
    is_error = true;
    validation_error.O_ContactTel = "Please enter O_ContactTel";
  }

  if (isEmpty(O0_ID_Owner)) {
    is_error = true;
    validation_error.O0_ID_Owner = "Please enter O0_ID_Owner";
  }

  if (isEmpty(O0_ID_Owner_WEB)) {
    is_error = true;
    validation_error.O0_ID_Owner_WEB = "Please enter O0_ID_Owner_WEB";
  }

  return {
    is_error,
    validation_error,
  };
};
