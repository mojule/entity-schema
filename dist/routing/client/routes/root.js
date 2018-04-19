"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templates_1 = require("../templates");
exports.rootRoutes = {
    '/': (req, res) => {
        res.send(templates_1.AppPage());
    }
};
//# sourceMappingURL=root.js.map