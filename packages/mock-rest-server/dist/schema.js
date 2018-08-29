"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizr_1 = require("normalizr");
const categorySchema = new normalizr_1.schema.Entity("categories");
exports.transactionSchema = new normalizr_1.schema.Entity("transactions", {
    category: categorySchema
}, {
    processStrategy: (value, parent) => (Object.assign({ accountId: parent.id }, value))
});
exports.accountSchema = new normalizr_1.schema.Entity("accounts", {
    transactions: [exports.transactionSchema]
}, {
    processStrategy: (value, parent) => (Object.assign({ userId: parent.id }, value))
});
exports.contactSchema = new normalizr_1.schema.Entity("contacts", {}, {
    processStrategy: (value, parent) => (Object.assign({ userId: parent.id }, value))
});
exports.userSchema = new normalizr_1.schema.Entity("users", {
    accounts: [exports.accountSchema],
    contacts: [exports.contactSchema]
});
exports.normalizeUser = (user) => normalizr_1.normalize(user, exports.userSchema);
//# sourceMappingURL=schema.js.map