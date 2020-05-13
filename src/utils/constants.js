export const getKeysFromCollection = (collectionData) => {
  let keys = collectionData.map((value) => Object.keys(value));
  let lengths = keys.map((value) => value.length);
  let collectionKeys = keys[lengths.indexOf(Math.max(...lengths))];
  collectionKeys = collectionKeys.sort();
  collectionKeys.splice(collectionKeys.indexOf("ID_WEB"), 1);
  collectionKeys.splice(collectionKeys.indexOf("isUpdate"), 1);

  collectionKeys.unshift("ID_WEB");

  return collectionKeys;
};
