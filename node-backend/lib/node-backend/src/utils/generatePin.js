"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeviceId = exports.generatePin = void 0;
function generatePin() {
    const length = 6;
    const chars = "1234567890ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz*";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.generatePin = generatePin;
function generateDeviceId() {
    const length = 9;
    const chars = "1234567890ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz*";
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.generateDeviceId = generateDeviceId;
//# sourceMappingURL=generatePin.js.map