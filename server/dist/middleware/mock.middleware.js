"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAuth = void 0;
const mockAuth = (req, res, next) => {
    req.user = {
        _id: "6978bfac5ba09e71d7453352"
    };
    next();
};
exports.mockAuth = mockAuth;
