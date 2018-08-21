import { normalize } from "normalizr";

import { createMockUser } from "@trabian/banking-mock-data-generator";

import { userSchema } from "./schema";

const createUser = async (db: any) => {
  const user = createMockUser({});

  const normalized = normalize(user, userSchema);

  Object.keys(normalized.entities).forEach(key => {
    const idMap = normalized.entities[key];
    const values: any[] = Object.keys(idMap).map(id => idMap[id]);
    db.update(
      key,
      (existingValues?: any[]) =>
        existingValues ? [...existingValues, ...values] : values
    ).write();
  });

  // db.write().then(() => console.log("State has been saved"));
};

export default createUser;
