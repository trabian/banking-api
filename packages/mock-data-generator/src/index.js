import responsibleSpender from "./users/responsibleSpender";

import { categories } from "./merchants";

import R from "ramda";

export { responsibleSpender, categories };

const user = responsibleSpender({
  months: 4
});

console.warn("credit card", user.accounts.creditCard);
