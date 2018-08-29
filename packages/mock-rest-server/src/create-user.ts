import { createMockUser } from "@trabian/banking-mock-data-generator";

import { normalizeUser } from "./schema";

const createUser = async (db: any) => {
  const user = createMockUser({});

  const normalized = normalizeUser(user);

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
