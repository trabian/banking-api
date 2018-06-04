import R from "ramda";

import { createFinder, createUpdater } from "./utils";

import { getUser } from "./users";

export const getContact = createFinder("contacts", id =>
  R.find(R.propEq("id", id))
);

export const getContactsForUser = ({ db }) => async userId => {
  const user = await getUser({ db })(userId);

  const _getContact = getContact({ db });

  return R.map(_getContact, user.contacts);
};

export const updateContact = createUpdater(
  "contact",
  ({ address }) => contact => {
    if (contact.type === "address") {
      return {
        ...contact,
        address,
      };
    }

    return contact;
  }
);
