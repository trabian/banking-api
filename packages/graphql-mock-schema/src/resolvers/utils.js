import R from "ramda";

export const convertToEnum = (root, _params, ctx, { fieldName }) =>
  R.pipe(R.prop(fieldName), R.toUpper)(root);
