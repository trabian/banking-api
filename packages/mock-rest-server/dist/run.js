"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server = server_1.createServer({ database: "db.json" });
const port = process.env.PORT || 3002;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
//# sourceMappingURL=run.js.map