"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dev = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_helpers_1 = require("./express-helpers");
const tsyringe_1 = require("../utils/tsyringe");
const InstitutionFacade_1 = require("../modules/institutions/InstitutionFacade");
const ShopService_1 = require("../modules/shop/ShopService");
const QuestService_1 = require("../modules/quests/QuestService");
const UserService_1 = require("../modules/users/UserService");
const GroupService_1 = require("../modules/groups/GroupService");
const TimerService_1 = require("../modules/timers/TimerService");
const AuthenticationService_1 = require("../modules/authentication/AuthenticationService");
const printRoutes_1 = require("../utils/printRoutes");
const ConfigService_1 = require("../modules/GlobalConfig/ConfigService");
const MessageService_1 = require("../modules/Messages/MessageService");
const GameVersionFirebaseAdapter_1 = require("../modules/GlobalConfig/GameVersionFirebaseAdapter");
const InstitutionService_1 = require("../modules/institutions/InstitutionService");
const teacherFirebaseAdaptor_1 = require("../modules/teachers/teacherFirebaseAdaptor");
//import { PlayerMigration } from "../migration/playerStatsMigration/migratePlayerStatsAdapter";
const teacherService_1 = require("../modules/teachers/teacherService");
const HousingSystemService_1 = require("../modules/HousingSystem/HousingSystemService");
const AlertAdapter_1 = require("../modules/alertSystem/AlertAdapter");
const EndlessTowerService_1 = require("../modules/endlessTowerSystem/EndlessTowerService");
//import { PlayerService } from "../modules/Players/PlayerService";
const PlayerStatsService_1 = require("../modules/playerStats/PlayerStatsService");
//import {DailyService } from "../modules/daily/DailyService"; //TODO
const PlayerInventoryService_1 = require("../modules/playerInventory/PlayerInventoryService");
//import {InstitutionMigrationAdapter} from "../migration/institutionMigration/institutionMigrationAdapter";
//import { ReportsFacade } from "../modules/report/ReportFacade";
//import { QuestMigrator } from "../migration/questMigration/questMigrationAdapter";
exports.dev = express_1.default();
exports.dev.use(cors_1.default({ origin: true }));
exports.dev.use(body_parser_1.default.json());
exports.dev.use(body_parser_1.default.urlencoded({ extended: false }));
/*PLAYER INVENTORY */
exports.dev.post("/player/inventory/save", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = tsyringe_1.build(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.savePlayerInventoryComplete(req.body);
}));
exports.dev.get("/player/inventory/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = tsyringe_1.build(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.getPlayerInventory(req.params.playerId);
}));
exports.dev.post("/player/gold/update/new", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = tsyringe_1.build(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.updatePlayerGold(req.body.playerId, req.body.goldAmount);
}));
exports.dev.delete("/player/inventory/delete/:playerId", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const inventorySystem = tsyringe_1.build(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.deletePlayerInventory(req.params.playerId);
}));
/*--------------------------------- REPORTS ------------------------------- */
/*dev.get(
  "/testing/report/:reportId",
  returnFailureOrSuccessExpress((req, res) => {
    const reportFacade = build(ReportsFacade);
    return reportFacade.createReportInReportsCollection(req.params.reportId);
  })
);
*/
/*-------------------------------- HOUSING --------------------------------  */
exports.dev.post("/house/create/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const houseService = tsyringe_1.build(HousingSystemService_1.HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
}));
exports.dev.post("/house/chest/save/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const houseService = tsyringe_1.build(HousingSystemService_1.HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
}));
exports.dev.post("/house/save/:playerId", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const houseService = tsyringe_1.build(HousingSystemService_1.HouseService);
    return houseService.savePlayerHouse(req.body);
}));
exports.dev.delete("/house/delete", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const houseService = tsyringe_1.build(HousingSystemService_1.HouseService);
    return houseService.deleteHouse(user.uid);
}));
exports.dev.get("/house/get", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const houseService = tsyringe_1.build(HousingSystemService_1.HouseService);
    return houseService.getHouse(user.uid);
}));
/*-----------------ENDLESSTOWER --------------- */
//Working
exports.dev.get("/tower/:towerId/get", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const towerService = tsyringe_1.build(EndlessTowerService_1.TowerService);
    return towerService.getTower(req.params.towerId);
}));
//Working
exports.dev.post("/tower/create", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const towerService = tsyringe_1.build(EndlessTowerService_1.TowerService);
    return towerService.createTower(req.body);
}));
exports.dev.post("tower/quest/create", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const towerService = tsyringe_1.build(EndlessTowerService_1.TowerService);
    return towerService.createTower(req.body);
}));
/*----------------- MIGRATION ----------------- */
/*
dev.get(
  "/migration/player/Stats",
  returnFailureOrSuccessExpress((req) => {
    const migrationService = build(PlayerMigration);
    return migrationService.LoopAndCreateStats();
  })
);
dev.get("/migration/institution/type", returnFailureOrSuccessExpress((req) => {
  const institutionMigrationAdapter = build(InstitutionMigrationAdapter);
  return institutionMigrationAdapter.addInstitutionType("teacher");
}))
*/
/*
dev.post ('/migration/quest/addTeacher', returnFailureOrSuccessExpress((req) => {
const questAdapter = build(QuestMigrator);
return questAdapter.migrateAllQuests();
}))
*/
/*----------------- INSTITUTION ----------------- */
/* Brute force add teacher*/
exports.dev.post("/teacher/:teacherId/institution/:institutionId", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const tyeacherService = tsyringe_1.build(teacherService_1.TeacherService);
    return tyeacherService.addTeacherToInstitution(req.params.teacherId, req.params.institutionId);
}));
//Convidar professor para instituição: OK - TESTED
exports.dev.post("/institution/invite", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionService_1.InstitutionService);
    return institutionService.InviteTeacherToInstitution(req.body);
}));
//Aceitar e adicionar o professor na instituição: OK - TESTED
exports.dev.post("/institution/accept/teacher", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionFacade = tsyringe_1.build(InstitutionFacade_1.InstitutionFacade);
    return institutionFacade.AcceptTeacherInInstitution(req.body);
}, false));
//Buscar professores na instituição: OK - TESTED
exports.dev.get("/institution/:institutionId/teachers/", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionService_1.InstitutionService);
    return institutionService.getInstitutionTeachersIds(req.params.institutionId);
}));
//buscar grupos na instituição: OK - TESTED
exports.dev.get("/institution/:institutionId/groups", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionFacade = tsyringe_1.build(InstitutionFacade_1.InstitutionFacade);
    return institutionFacade.getInstitutionGroups(req.params.institutionId);
}));
exports.dev.post("/institution/:institutionId/invites", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionFacade_1.InstitutionFacade);
    return institutionService.AcceptTeacherInInstitution(req.body);
}));
exports.dev.get("/institution/:institutionId/invites", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionService_1.InstitutionService);
    return institutionService.getInstitutionPendingInvitations(req.params.institutionId);
}));
exports.dev.put("/institution/update", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionService_1.InstitutionService);
    return institutionService.updateInstitutionInfo(req.body);
}));
exports.dev.get("/teacher/institution", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const institutionService = tsyringe_1.build(InstitutionService_1.InstitutionService);
    return institutionService.getTeacherInstitutionsInfo(req.user.uid);
}));
/*----------------- MESSAGES ----------------- */
exports.dev.post("/message/:groupId/send", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const messageService = tsyringe_1.build(MessageService_1.MessageService);
    return messageService.SendMessageToGroup(req.params.groupId, req.body, user.uid);
}));
exports.dev.delete("/message/:groupId/delete/:messageId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const messageService = tsyringe_1.build(MessageService_1.MessageService);
    return messageService.removeMessageFromGroup(req.params.groupId, req.params.messageId);
}));
exports.dev.get("/message/:groupId/group", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const messageService = tsyringe_1.build(MessageService_1.MessageService);
    return messageService.getMessageFromGroup(req.params.groupId);
}));
exports.dev.post("/message/:messageId/:groupId/remove/", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const messageService = tsyringe_1.build(MessageService_1.MessageService);
    return messageService.removeMessageFromGroup(req.params.messageId, req.params.groupId);
}, false));
/*------------------ TEACHERS --------------------- */
exports.dev.get("/teacher/:teacherId/intitution", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const teacherService = tsyringe_1.build(teacherService_1.TeacherService);
    return teacherService.getTeacherStatisctics(req.params.teacherId);
}));
exports.dev.get("/teacher/:teacherId/groups/count", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const teacherService = tsyringe_1.build(teacherService_1.TeacherService);
    return teacherService.getTeacherGroupsCount(req.params.teacherId);
}));
exports.dev.get("/teacher/:teacherEmail/findByEmail", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const teacherService = tsyringe_1.build(teacherFirebaseAdaptor_1.TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
}));
/*----------------- PLAYER STATS ----------------- */
exports.dev.get("/players/stats", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const playerService = tsyringe_1.build(PlayerStatsService_1.PlayerStatsService);
    return playerService.getPlayerStats(user.uid);
}));
exports.dev.post("/players/stats/create", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const playerService = tsyringe_1.build(PlayerStatsService_1.PlayerStatsService);
    return playerService.createPlayerStats(user.uid);
}));
exports.dev.post("/players/stats/save", express_helpers_1.verifyAuthenticated(), express_helpers_1.checkDeviceId(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const playerService = tsyringe_1.build(PlayerStatsService_1.PlayerStatsService);
    return playerService.savePlayerStats(user.uid, req.body);
}));
//Configs
exports.dev.post("/alerts/config", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const alertAdapter = tsyringe_1.build(AlertAdapter_1.AlertFirebaseAdapter);
    return alertAdapter.getAlertConfig();
}));
exports.dev.post("/config/deviceId/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const alertAdapter = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return alertAdapter.createDeviceId(req.user.uid);
}));
exports.dev.get("/config/deviceId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.getDeviceId(req.user.uid);
}));
exports.dev.get("/config/game/version", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const gameVersion = tsyringe_1.build(GameVersionFirebaseAdapter_1.GameVersionFirebaseAdapter);
    return gameVersion.getAllowedGameVersion();
}));
exports.dev.get("/alerts/all", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const alertAdapter = tsyringe_1.build(AlertAdapter_1.AlertFirebaseAdapter);
    return alertAdapter.fetchActiveAlerts();
}));
/*----------------- GAME CONFIG ----------------- */
exports.dev.post("/admin/group/create", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const groupService = tsyringe_1.build(GroupService_1.GroupService);
    return groupService.createGroupWithFixedId(req.body, req.user.uid);
}));
exports.dev.get("/config", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const configService = tsyringe_1.build(ConfigService_1.ConfigService);
    return configService.getConfig();
}));
/*
dev.post(
  "/institutions/:institutionId/teachers",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const user = req.user;
    const institutionFacade = build(InstitutionFacade);
    return institutionFacade.inviteTeachers({
      teachers: req.body.teachers,
      directorId: user.uid,
      institutionId: req.params.institutionId,
    });
  })
);
*/
exports.dev.get("/shop", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const shopService = tsyringe_1.build(ShopService_1.ShopService);
    return shopService.getShopItems();
}));
/*
dev.get(
  "/daily/progress",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const dailyService = build(DailyService);
    return dailyService.getCurrentProgress(user.uid);
  })
);*/
/*
dev.get(
  "/daily",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const dailyService = build(DailyService);
    return dailyService.claimDailyReward(user.uid);
  })
);*/
/*----------------- QUESTS ----------------- */
exports.dev.get("/quests/:questId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const questsService = tsyringe_1.build(QuestService_1.QuestService);
    return questsService.getQuest(req.params.questId);
}));
exports.dev.get("/players/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const userService = tsyringe_1.build(UserService_1.UserService);
    return userService.getPlayer(req.params.playerId);
}));
exports.dev.patch("/players/:playerId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const userService = tsyringe_1.build(UserService_1.UserService);
    return userService.savePlayer(req.params.playerId, req.body);
}));
exports.dev.get("/teacher/:teacherEmail/findByEmail", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const teacherService = tsyringe_1.build(teacherFirebaseAdaptor_1.TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
}));
exports.dev.get("/groups/:groupId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const groupsService = tsyringe_1.build(GroupService_1.GroupService);
    return groupsService.getGroup(req.params.groupId);
}));
exports.dev.get("/teachers/:teacherId", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const userService = tsyringe_1.build(UserService_1.UserService);
    return userService.getTeacher(req.params.teacherId);
}));
exports.dev.post("/quests/:questId/answers", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const questsService = tsyringe_1.build(QuestService_1.QuestService);
    const body = req.body;
    // body.groupId = req.params.groupId;
    body.questId = req.params.questId;
    return questsService.submitAnswer(req.body, user.uid);
}));
exports.dev.get("/quests/:questId/report", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const questsService = tsyringe_1.build(QuestService_1.QuestService);
    return questsService.getReport(req.params.questId);
}));
exports.dev.get("/players/:playerId/groups", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const groupsService = tsyringe_1.build(GroupService_1.GroupService);
    return groupsService.getGroupsByPlayer(req.params.playerId);
}));
exports.dev.get("/groups/:groupId/quests", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const groupsService = tsyringe_1.build(GroupService_1.GroupService);
    return groupsService.getGroupsQuests(req.params.groupId, user.uid);
}));
exports.dev.get("/reports", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const questsService = tsyringe_1.build(QuestService_1.QuestService);
    return questsService.getReports(req.user.uid);
}));
exports.dev.get("/timers/:name", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const timerService = tsyringe_1.build(TimerService_1.TimerService);
    return timerService.getTimer(user.uid, req.params.name);
}));
exports.dev.put("/timers/:name", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const timerService = tsyringe_1.build(TimerService_1.TimerService);
    return timerService.saveTimer(user.uid, {
        name: req.params.name,
        expiresIn: req.body,
    });
}));
exports.dev.delete("/timers/:name", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const timerService = tsyringe_1.build(TimerService_1.TimerService);
    return timerService.deleteTimer(user.uid, req.params.name);
}));
exports.dev.post("/login", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.login(req.body);
}, false));
exports.dev.post("/register", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.registerStepOne(req.body);
}, false));
exports.dev.post("/register/recover/password/:email", (req, res) => {
    return express_helpers_1.recoverPassword(req.params.email);
});
exports.dev.post("/register/2", express_helpers_1.verifyAuthenticated(), express_helpers_1.returnFailureOrSuccessExpress((req, user) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.registerStepTwo(req.body, user.uid);
}));
exports.dev.post("/register/anonymously", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.registerAnonymously(req.body.name);
}));
exports.dev.post("/refreshToken", express_helpers_1.returnFailureOrSuccessExpress((req) => {
    const authService = tsyringe_1.build(AuthenticationService_1.AuthenticationService);
    return authService.refreshToken(req.body);
}, false));
exports.dev.get("/", (req, res) => {
    res.send(`
    <h3> Hello World! </h3>
    <h4> Routes: </h4>
    ${printRoutes_1.getRoutes(exports.dev)
        .filter((t) => !t.includes(","))
        .map((r) => "<p>" + r + "</p>")}
  `);
});
exports.dev.use((req, res, next) => {
    res.status(404).send({
        statusCode: 404,
        name: "Error",
        message: "Rota não encontrada",
    });
});
exports.dev.use(express_helpers_1.expressErrorHandler);
exports.default = exports.dev;
//# sourceMappingURL=index-dev.js.map