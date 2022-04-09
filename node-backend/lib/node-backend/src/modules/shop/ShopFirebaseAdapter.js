"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopFirebaseAdapter = exports.GLOBAL_SHOP = exports.SHOP = void 0;
const app_1 = require("../../app");
exports.SHOP = "game_shop";
exports.GLOBAL_SHOP = "global";
class ShopFirebaseAdapter {
    getShop() {
        return app_1.adminDb
            .collection(exports.SHOP)
            .doc(exports.GLOBAL_SHOP)
            .get()
            .then((doc) => doc.data());
    }
    saveShop(items, nextRefreshAt) {
        return app_1.adminDb.collection(exports.SHOP).doc(exports.GLOBAL_SHOP).set({
            items,
            nextRefreshAt,
        });
    }
}
exports.ShopFirebaseAdapter = ShopFirebaseAdapter;
//# sourceMappingURL=ShopFirebaseAdapter.js.map