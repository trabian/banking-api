"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_server_1 = __importDefault(require("json-server"));
const create_user_1 = __importDefault(require("./create-user"));
const server = json_server_1.default.create();
const router = json_server_1.default.router("db.json");
const middlewares = json_server_1.default.defaults();
server.get("/create-user", (req, res) => {
    const user = create_user_1.default(router.db);
    res.json({ user });
});
server.use(middlewares);
server.use(router);
const port = process.env.PORT || 3002;
server.listen(port, () => {
    console.log("JSON Server is running ");
});
//# sourceMappingURL=index.js.map