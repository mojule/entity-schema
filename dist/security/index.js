"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const pify = require("pify");
const hash = pify(bcrypt.hash);
exports.PassportSecurity = (User, ApiKey) => {
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
    const apiKeyStrategy = (id, secret, done) => {
        ApiKey.findById(id, (err, apiKeyDocument) => {
            if (err)
                return done(err);
            if (apiKeyDocument === null)
                return done(null, false);
            bcrypt.compare(secret, apiKeyDocument.secret, (err, result) => {
                if (err)
                    return done(err);
                if (!result)
                    return done(null, false);
                User.findById(apiKeyDocument.user.entityId, (err, user) => {
                    if (err)
                        return done(err);
                    return done(null, user);
                });
            });
        });
    };
    const serializeUser = (user, cb) => {
        cb(null, user._id.toString());
    };
    const deserializeUser = (_id, cb) => {
        User.findById(_id, (err, user) => {
            if (err)
                return cb(err);
            if (user === null)
                return cb(Error('User was null'));
            const userModel = user.toJSON();
            const { name, email, roles } = userModel;
            roles.push(types_1.Roles.currentUser);
            cb(null, { _id, name, email, roles });
        });
    };
    const createApiKey = async (user, tags) => {
        const secret = uuid.v4();
        const apiKeyModel = {
            name: 'API Key for ' + user.name,
            user: {
                entityId: user._id.toString(),
                entityType: 'User'
            },
            secret,
            tags
        };
        const apiKeyDocument = new ApiKey(apiKeyModel);
        const apiKey = Buffer.from(`${apiKeyDocument._id.toString()}:${secret}`).toString('base64');
        apiKeyDocument.secret = await hash(secret, 10);
        await apiKeyDocument.save();
        return {
            apiKey,
            apiKeyId: apiKeyDocument._id.toString()
        };
    };
    const getSessionApiKey = async (req) => {
        const { session } = req;
        if (session.apiKey)
            return session.apiKey;
        if (!req.user)
            throw Error('No user!');
        const { user } = req;
        const sessionApis = await ApiKey.find({
            'user.entityId': user._id.toString(),
            tags: 'session'
        });
        await Promise.all(sessionApis.map(sessionApi => sessionApi.remove()));
        const apiKey = await createSessionApiKey(user);
        session.apiKey = apiKey.apiKey;
        return session.apiKey;
    };
    const createSessionApiKey = async (user) => createApiKey(user, ['session']);
    return {
        strategy, apiKeyStrategy, serializeUser, deserializeUser, createApiKey,
        createSessionApiKey, getSessionApiKey
    };
};
//# sourceMappingURL=index.js.map