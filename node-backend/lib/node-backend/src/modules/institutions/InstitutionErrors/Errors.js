"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidInvite = void 0;
const errorUtils_1 = require("../../../utils/errorUtils");
class InvalidInvite extends errorUtils_1.ApiError {
    constructor() {
        super(...arguments);
        this.message = "O professor parece já ter um convite pendente";
        this.type = "invitatiuon_not_valid";
        this.statusCode = 404;
    }
}
exports.InvalidInvite = InvalidInvite;
//# sourceMappingURL=Errors.js.map