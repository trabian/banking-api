import R from "ramda";

import { normalize } from "normalizr";

import { createMockUser } from "../../mock";
import { userSchema } from "../schema";

import { find } from "./utils";

export const getCurrentUser = find("users", ({ userId }) =>
  R.find(R.propEq("id", userId))
);

export const createUser = ({ db }) => async params => {
  const user = createMockUser(params);

  const normalized = normalize(user, userSchema);

  const promises = R.pipe(
    R.mapObjIndexed(async (vals, key) => {
      return await db(key).write(R.pipe(R.values, R.concat)(vals));
    }),
    R.values()
  )(normalized.entities);

  await Promise.all(promises);

  return user;
};

export const getUsers = find("users");
