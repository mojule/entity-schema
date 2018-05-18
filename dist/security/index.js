"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const bcrypt = require("bcrypt");
exports.PassportSecurity = (User) => {
    const strategy = (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (err)
                return done(err);
            if (user === null)
                return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
                if (err)
                    return done(err);
                if (!result)
                    return done(null, false);
                return done(null, user);
            });
        });
    };
    const serializeUser = (user, cb) => {
        cb(null, user._id.toString());
    };
    const deserializeUser = (id, cb) => {
        User.findById(id, (err, user) => {
            if (err)
                return cb(err);
            if (user === null)
                return cb(Error('User was null'));
            const userModel = user.toJSON();
            const { email, roles } = userModel;
            roles.push(types_1.Roles.currentUser);
            cb(null, { email, roles });
        });
    };
    return { strategy, serializeUser, deserializeUser };
};
//# sourceMappingURL=index.js.map