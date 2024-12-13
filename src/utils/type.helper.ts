/**
 * Extracts values from the specified fields of an object and returns them as an array.
 *
 * @template T - The type of the input object.
 * @param {T} data - The input object from which to extract values.
 * @param {...(keyof T)[]} fields - The fields whose values need to be extracted.
 * @returns {any[]} An array containing the values of the specified fields.
 */
export const extractValueToArrByFields = <T>(
  data: T,
  ...fields: (keyof T)[]
) => {
  const values = [];
  for (const field of fields) {
    if (data[field]) {
      values.push(data[field]);
    }
  }
  return values;
};

/**
 * Checks if the specified fields in the given data object have truthy values.
 *
 * @template T - The type of the data object.
 * @param {T} data - The data object to check.
 * @param {...(keyof T)[]} fields - The fields to check in the data object.
 * @returns {boolean} - Returns `true` if all specified fields have truthy values, otherwise `false`.
 */
export const isValueInFields = <T>(data: T, ...fields: (keyof T)[]) => {
  for (const field of fields) {
    if (!data[field]) {
      return false;
    }
  }
  return true;
};
