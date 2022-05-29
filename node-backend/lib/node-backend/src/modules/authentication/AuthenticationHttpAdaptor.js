"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHttpAdaptor = exports.API_KEY = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_2 = require("../../utils/axios");
const errorUtils_1 = require("../../utils/errorUtils");
const tsyringe_1 = require("../../utils/tsyringe");
const AuthenticationService_1 = require("./AuthenticationService");
// import certificate from "../../../../packages/utils/classquest-2bb7d-b9a69fcf5d24.json";}
exports.API_KEY = "AIzaSyDNDx9iWkvP3-uIjEssxkV7FLZbu0NotE8";
let AuthenticationHttpAdaptor = class AuthenticationHttpAdaptor {
    refreshToken(refreshDto) {
        return axios_1.default
            .post("https://securetoken.googleapis.com/v1/token?key=" + exports.API_KEY, {
            grant_type: "refresh_token",
            refresh_token: refreshDto.refreshToken,
        })
            .catch(catchAxiosError)
            .then((res) => ({
            expiresIn: res.data.expires_in,
            tokenType: res.data.token_type,
            refreshToken: res.data.refresh_token,
            idToken: res.data.id_token,
            userId: res.data.user_id,
            projectId: res.data.project_id,
        }));
    }
    register(registerDto = {}) {
        const register = (() => {
            if ((0, AuthenticationService_1.isNonAnonymousRegister)(registerDto)) {
                return {
                    email: registerDto.email,
                    password: registerDto.password,
                };
            }
            return {};
        })();
        return axios_1.default
            .post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            exports.API_KEY, Object.assign(Object.assign({}, register), { returnSecureToken: true }))
            .catch(catchAxiosError)
            .then((res) => res.data);
    }
    registerTeacher(email, password) {
        const register = (() => {
            if ((0, AuthenticationService_1.isNonAnonymousRegister)({ email, password })) {
                return {
                    email: email,
                    password: password,
                };
            }
            return {};
        })();
        return axios_1.default.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            exports.API_KEY, Object.assign(Object.assign({}, register), { returnSecureToken: true })).catch(catchAxiosError).then((res) => { return res.data; });
    }
    registerAnonymously() {
        return axios_1.default
            .post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            exports.API_KEY, {
            returnSecureToken: true,
        })
            .catch(catchAxiosError)
            .then((res) => res.data);
    }
    login(loginDto) {
        return axios_1.default
            .post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
            exports.API_KEY, Object.assign(Object.assign({}, loginDto), { returnSecureToken: true }))
            .catch(catchAxiosError)
            .then((res) => res.data);
    }
};
AuthenticationHttpAdaptor = __decorate([
    (0, tsyringe_1.Singleton)()
], AuthenticationHttpAdaptor);
exports.AuthenticationHttpAdaptor = AuthenticationHttpAdaptor;
function catchAxiosError(err) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if ((0, axios_2.isAxiosError)(err)) {
        throw new errorUtils_1.AuthorizationError({
            statusCode: (_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.code,
            message: (_f = (_e = (_d = err.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message,
            name: "Error",
            type: (_h = (_g = err.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error.message.toLowerCase(),
            stack: err.stack,
            details: (_j = err.response) === null || _j === void 0 ? void 0 : _j.data,
        });
    }
    throw err;
}
//# sourceMappingURL=AuthenticationHttpAdaptor.js.map