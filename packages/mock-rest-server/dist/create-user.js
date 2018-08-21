"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizr_1 = require("normalizr");
const banking_mock_data_generator_1 = require("@trabian/banking-mock-data-generator");
const schema_1 = require("./schema");
const createUser = (db) => __awaiter(this, void 0, void 0, function* () {
    const user = banking_mock_data_generator_1.createMockUser({});
    const normalized = normalizr_1.normalize(user, schema_1.userSchema);
    Object.keys(normalized.entities).forEach(key => {
        const idMap = normalized.entities[key];
        const values = Object.keys(idMap).map(id => idMap[id]);
        db.update(key, (existingValues) => existingValues ? [...existingValues, ...values] : values).write();
    });
    // db.write().then(() => console.log("State has been saved"));
});
exports.default = createUser;
//# sourceMappingURL=create-user.js.map