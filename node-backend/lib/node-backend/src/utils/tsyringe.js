"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.Inject = exports.Singleton = exports.Injectable = void 0;
const tsyringe_1 = require("tsyringe");
exports.Injectable = tsyringe_1.injectable;
exports.Singleton = tsyringe_1.singleton;
// export const Inject = inject;
const Inject = (f) => (0, tsyringe_1.inject)((0, tsyringe_1.delay)(f));
exports.Inject = Inject;
const build = (Class) => tsyringe_1.container.resolve(Class);
exports.build = build;
//# sourceMappingURL=tsyringe.js.map