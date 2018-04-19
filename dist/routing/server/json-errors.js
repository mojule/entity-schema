"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_to_object_1 = require("../../utils/error-to-object");
exports.jsonError = (res, err, status) => {
    if (!status) {
        if (err instanceof NotFoundError || err instanceof UserError) {
            status = err.code;
        }
        else {
            status = 500;
        }
    }
    res.status(status).json(error_to_object_1.errorToObj(err, true));
};
exports.notFoundError = (res, err) => exports.jsonError(res, err, 404);
exports.serverError = (res, err) => exports.jsonError(res, err, 500);
exports.userError = (res, err) => exports.jsonError(res, err, 400);
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.code = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
class UserError extends Error {
    constructor(message) {
        super(message);
        this.code = 400;
        Object.setPrototypeOf(this, UserError.prototype);
    }
}
exports.UserError = UserError;
//# sourceMappingURL=json-errors.js.map