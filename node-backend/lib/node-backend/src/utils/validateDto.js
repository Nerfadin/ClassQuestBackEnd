"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const errorUtils_1 = require("./errorUtils");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateDto = (c) => async (values) => {
    const dtoClass = (0, class_transformer_1.plainToClass)(c, values, {
        excludeExtraneousValues: true,
    });
    const errors = await (0, class_validator_1.validate)(dtoClass, {
        whitelist: true,
        forbidUnknownValues: true,
    });
    if (errors.length) {
        throw new errorUtils_1.ValidationError({ details: errors });
    }
    else
        return values;
};
exports.validateDto = validateDto;
//# sourceMappingURL=validateDto.js.map