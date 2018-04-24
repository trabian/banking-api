import R from "ramda";

import { normalize } from "normalizr";

import { createMockUser } from "../../mock";
import { userSchema } from "../schema";

import { createFinder, createUpdater } from "./utils";

export const getUser = createFinder("users", id => R.find(R.propEq("id", id)));

export const createUser = ({ db }) => async ({ reset = false, ...params }) => {
  const user = createMockUser(params);

  const normalized = normalize(user, userSchema);

  const resetOrAddValue = R.ifElse(R.always(reset), R.identity, R.concat);

  const promises = R.pipe(
    R.mapObjIndexed(async (vals, key) => {
      return await db(key).write(R.pipe(R.values, resetOrAddValue)(vals));
    }),
    R.values()
  )(normalized.entities);

  await Promise.all(promises);

  return user;
};

const addressTypeProperty = type =>
  type === "primary" ? "address" : `${type}Address`;

export const updatePartyAddress = createUpdater(
  "users",
  ({ address, type = "primary" }) => R.assoc(addressTypeProperty(type), address)
);

export const getUsers = createFinder("users");
