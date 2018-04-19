"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
exports.ClientRouter = (routeMap, send) => {
    const routes = Object.keys(routeMap);
    const routeData = routes.reduce((map, route) => {
        const keys = [];
        const regexp = pathToRegexp(route, keys);
        map[route] = { keys, regexp };
        return map;
    }, {});
    const routeForPath = path => routes.find(route => routeData[route].regexp.test(path));
    const router = (path) => {
        const route = routeForPath(path);
        if (!route)
            return;
        const data = routeData[route];
        const exec = data.regexp.exec(path);
        const keys = data.keys;
        const params = keys.reduce((map, key, i) => {
            map[key.name] = exec[i + 1];
            return map;
        }, {});
        const req = { path, params };
        const res = { send };
        return routeMap[route](req, res);
    };
    return router;
};
//# sourceMappingURL=client-router.js.map