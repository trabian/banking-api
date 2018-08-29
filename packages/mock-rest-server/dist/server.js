"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_server_1 = __importDefault(require("json-server"));
const create_user_1 = __importDefault(require("./create-user"));
exports.createServer = ({ database }) => {
    const server = json_server_1.default.create();
    const router = json_server_1.default.router(database);
    const middlewares = json_server_1.default.defaults();
    server.get("/create-user", (_req, res) => {
        const user = create_user_1.default(router.db);
        res.json({ user });
    });
    server.use(middlewares);
    server.use(router);
    return server;
};
//# sourceMappingURL=server.js.map