"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_helpers_1 = require("./express-helpers");
const TeacherCreation_1 = require("..//migration/createAccountsGoiana/TeacherCreation");
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
const questMigrationAdapter_1 = require("../migration/questMigration/questMigrationAdapter");
const subjectService_1 = require("../modules/subjectsSystem/subjectService");
const ownerFirebaseAdapter_1 = require("../modules/institutions/owner/ownerFirebaseAdapter");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: '*' }));
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
/*----------------- OWNER ----------------- */
exports.app.post('/school/create', (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const ownerService = (0, tsyringe_1.build)(ownerFirebaseAdapter_1.OwnerFirebaseAdapter);
    return ownerService.CreateSchool(req.body);
}));
exports.app.post('/auth/teacher/register', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const registerTeacherDto = req.body;
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.RegisterTeacher(registerTeacherDto.email, registerTeacherDto.password);
})));
exports.app.post('/admin/import/teachers', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const teacherCreationService = (0, tsyringe_1.build)(TeacherCreation_1.TeacherCreationService);
    return teacherCreationService.createTeacher(req.body);
})));
/* ----------------- SUBJECTS ----------------- */
exports.app.post('/subjects/create', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const subjectDto = req.body;
    const subjectService = (0, tsyringe_1.build)(subjectService_1.SubjectService);
    return subjectService.CreateSubject(subjectDto);
})));
exports.app.get('/subjects/slug/:subjectSlug', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const subjectService = (0, tsyringe_1.build)(subjectService_1.SubjectService);
    return subjectService.SearchSubjectBySlug(req.params.subjectSlug);
})));
exports.app.get('/subjects/name/:subjectName', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const subjectService = (0, tsyringe_1.build)(subjectService_1.SubjectService);
    return subjectService.SearchSubjectByFullName(req.params.subjectName);
})));
exports.app.get('/subjects/main', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const subjectService = (0, tsyringe_1.build)(subjectService_1.SubjectService);
    return subjectService.GetMainSubjects();
})));
/*PLAYER INVENTORY */
exports.app.post("/player/inventory/save", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, res) => {
    const inventorySystem = (0, tsyringe_1.build)(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.savePlayerInventoryComplete(req.body);
}));
exports.app.post('/institution/owner', (0, express_helpers_1.returnFailureOrSuccessExpress)((req => {
    const subjectService = (0, tsyringe_1.build)(ownerFirebaseAdapter_1.OwnerFirebaseAdapter);
    return subjectService.CreateOwner(req.body);
})));
exports.app.get("/player/inventory/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, res) => {
    const inventorySystem = (0, tsyringe_1.build)(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.getPlayerInventory(req.params.playerId);
}));
exports.app.post("/player/gold/update/new", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, res) => {
    const inventorySystem = (0, tsyringe_1.build)(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.updatePlayerGold(req.body.playerId, req.body.goldAmount);
}));
exports.app.delete("/player/inventory/delete/:playerId", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const inventorySystem = (0, tsyringe_1.build)(PlayerInventoryService_1.PlayerInventoryService);
    return inventorySystem.deletePlayerInventory(req.params.playerId);
}));
/*--------------------------------- REPORTS ------------------------------- */
/*app.get(
  "/testing/report/:reportId",
  returnFailureOrSuccessExpress((req, res) => {
    const reportFacade = build(ReportsFacade);
    return reportFacade.createReportInReportsCollection(req.params.reportId);
  })
);
*/
/*-------------------------------- HOUSING --------------------------------  */
exports.app.post("/house/create/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const houseService = (0, tsyringe_1.build)(HousingSystemService_1.HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
}));
exports.app.post("/house/chest/save/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const houseService = (0, tsyringe_1.build)(HousingSystemService_1.HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
}));
exports.app.post("/house/save/:playerId", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const houseService = (0, tsyringe_1.build)(HousingSystemService_1.HouseService);
    return houseService.savePlayerHouse(req.body);
}));
exports.app.delete("/house/delete", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const houseService = (0, tsyringe_1.build)(HousingSystemService_1.HouseService);
    return houseService.deleteHouse(user.uid);
}));
exports.app.get("/house/get", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const houseService = (0, tsyringe_1.build)(HousingSystemService_1.HouseService);
    return houseService.getHouse(user.uid);
}));
/*-----------------ENDLESSTOWER --------------- */
//Working
exports.app.get("/tower/:towerId/get", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const towerService = (0, tsyringe_1.build)(EndlessTowerService_1.TowerService);
    return towerService.getTower(req.params.towerId);
}));
//Working
exports.app.post("/tower/create", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const towerService = (0, tsyringe_1.build)(EndlessTowerService_1.TowerService);
    return towerService.createTower(req.body);
}));
exports.app.post("tower/quest/create", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const towerService = (0, tsyringe_1.build)(EndlessTowerService_1.TowerService);
    return towerService.createTower(req.body);
}));
/*----------------- MIGRATION ----------------- */
exports.app.post('/migration/quests/institution', (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const questMigrator = (0, tsyringe_1.build)(questMigrationAdapter_1.QuestMigrator);
    return questMigrator.createQuestRelationshipWithInstitution();
}));
/*----------------- INSTITUTION ----------------- */
/* add teacher*/
exports.app.post("/teacher/:teacherId/institution/:institutionId", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const tyeacherService = (0, tsyringe_1.build)(teacherService_1.TeacherService);
    return tyeacherService.addTeacherToInstitution(req.params.teacherId, req.params.institutionId);
}));
//Buscar professores na instituição: OK - TESTED
exports.app.get("/institution/:institutionId/teachers/", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.getInstitutionTeachersIds(req.params.institutionId);
}));
//buscar grupos na instituição: OK - TESTED
exports.app.get("/institution/:institutionId/groups", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionFacade = (0, tsyringe_1.build)(InstitutionFacade_1.InstitutionFacade);
    return institutionFacade.getInstitutionGroups(req.params.institutionId);
}));
exports.app.post("/institution/:institutionId/invites", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionFacade_1.InstitutionFacade);
    return institutionService.AcceptTeacherInInstitution(req.body);
}));
exports.app.get("/institution/:institutionId/invites", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.getInstitutionPendingInvitations(req.params.institutionId);
}));
exports.app.put("/institution/update", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.updateInstitutionInfo(req.body);
}));
exports.app.post('/institution/create', (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.createInstitution(req.body);
    return req.body;
}));
exports.app.get('/institution/:institutionId', (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.getInstitution(req.params.institutionId);
}));
exports.app.post('/institution/update/type', (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.updateInstitutionType(req.body.institutionId, req.body.institutionType);
}));
exports.app.get("/teacher/institution", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const institutionService = (0, tsyringe_1.build)(InstitutionService_1.InstitutionService);
    return institutionService.getTeacherInstitutionsInfo(req.user.uid);
}));
/*----------------- MESSAGES ----------------- */
exports.app.post("/message/:groupId/send", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const messageService = (0, tsyringe_1.build)(MessageService_1.MessageService);
    return messageService.SendMessageToGroup(req.params.groupId, req.body, user.uid);
}));
exports.app.delete("/message/:groupId/delete/:messageId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const messageService = (0, tsyringe_1.build)(MessageService_1.MessageService);
    return messageService.removeMessageFromGroup(req.params.groupId, req.params.messageId);
}));
exports.app.get("/message/:groupId/group", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const messageService = (0, tsyringe_1.build)(MessageService_1.MessageService);
    return messageService.getMessageFromGroup(req.params.groupId);
}));
exports.app.post("/message/:messageId/:groupId/remove/", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const messageService = (0, tsyringe_1.build)(MessageService_1.MessageService);
    return messageService.removeMessageFromGroup(req.params.messageId, req.params.groupId);
}, false));
/*------------------ TEACHERS --------------------- */
exports.app.get("/teacher/:teacherId/intitution", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const teacherService = (0, tsyringe_1.build)(teacherService_1.TeacherService);
    return teacherService.getTeacherStatisctics(req.params.teacherId);
}));
exports.app.get("/teacher/:teacherId/groups/count", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const teacherService = (0, tsyringe_1.build)(teacherService_1.TeacherService);
    return teacherService.getTeacherGroupsCount(req.params.teacherId);
}));
exports.app.get("/teacher/:teacherEmail/findByEmail", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const teacherService = (0, tsyringe_1.build)(teacherFirebaseAdaptor_1.TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
}));
/*----------------- PLAYER STATS ----------------- */
exports.app.get("/players/stats", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    //Quais são os métodos que a conexão pode realizar na API
    const playerService = (0, tsyringe_1.build)(PlayerStatsService_1.PlayerStatsService);
    return playerService.getPlayerStats(user.uid);
}));
exports.app.post("/players/stats/create", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const playerService = (0, tsyringe_1.build)(PlayerStatsService_1.PlayerStatsService);
    return playerService.createPlayerStats(user.uid);
}));
exports.app.post("/players/stats/save", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const playerService = (0, tsyringe_1.build)(PlayerStatsService_1.PlayerStatsService);
    return playerService.savePlayerStats(user.uid, req.body);
}));
//Configs
exports.app.post("/alerts/config", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const alertAdapter = (0, tsyringe_1.build)(AlertAdapter_1.AlertFirebaseAdapter);
    return alertAdapter.getAlertConfig();
}));
exports.app.post("/config/deviceId/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const alertAdapter = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return alertAdapter.createDeviceId(req.user.uid);
}));
exports.app.get("/config/deviceId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.getDeviceId(req.user.uid);
}));
exports.app.get("/config/game/version", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const gameVersion = (0, tsyringe_1.build)(GameVersionFirebaseAdapter_1.GameVersionFirebaseAdapter);
    return gameVersion.getAllowedGameVersion();
}));
exports.app.get("/alerts/all", (0, express_helpers_1.returnFailureOrSuccessExpress)((req, res) => {
    const alertAdapter = (0, tsyringe_1.build)(AlertAdapter_1.AlertFirebaseAdapter);
    return alertAdapter.fetchActiveAlerts();
}));
/*----------------- GAME CONFIG ----------------- */
exports.app.post("/admin/group/create", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const groupService = (0, tsyringe_1.build)(GroupService_1.GroupService);
    return groupService.createGroupWithFixedId(req.body, req.user.uid);
}));
exports.app.get("/config", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const configService = (0, tsyringe_1.build)(ConfigService_1.ConfigService);
    return configService.getConfig();
}));
/* ----------------- PVP ----------------- */
exports.app.get("/shop", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const shopService = (0, tsyringe_1.build)(ShopService_1.ShopService);
    return shopService.getShopItems();
}));
/*
app.get(
  "/daily/progress",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const dailyService = build(DailyService);
    return dailyService.getCurrentProgress(user.uid);
  })
);*/
/*
app.get(
  "/daily",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const dailyService = build(DailyService);
    return dailyService.claimDailyReward(user.uid);
  })
);*/
/*----------------- QUESTS ----------------- */
exports.app.get("/quests/:questId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const questsService = (0, tsyringe_1.build)(QuestService_1.QuestService);
    return questsService.getQuest(req.params.questId);
}));
exports.app.get("/players/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const userService = (0, tsyringe_1.build)(UserService_1.UserService);
    return userService.getPlayer(req.params.playerId);
}));
exports.app.patch("/players/:playerId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const userService = (0, tsyringe_1.build)(UserService_1.UserService);
    return userService.savePlayer(req.params.playerId, req.body);
}));
exports.app.get("/teacher/:teacherEmail/findByEmail", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const teacherService = (0, tsyringe_1.build)(teacherFirebaseAdaptor_1.TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
}));
exports.app.get("/groups/:groupId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const groupsService = (0, tsyringe_1.build)(GroupService_1.GroupService);
    return groupsService.getGroup(req.params.groupId);
}));
exports.app.get("/teachers/:teacherId", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const userService = (0, tsyringe_1.build)(UserService_1.UserService);
    return userService.getTeacher(req.params.teacherId);
}));
exports.app.post("/quests/:questId/answers", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const questsService = (0, tsyringe_1.build)(QuestService_1.QuestService);
    const body = req.body;
    // body.groupId = req.params.groupId;
    body.questId = req.params.questId;
    return questsService.submitAnswer(req.body, user.uid);
}));
exports.app.get("/quests/:questId/report", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const questsService = (0, tsyringe_1.build)(QuestService_1.QuestService);
    return questsService.getReport(req.params.questId);
}));
exports.app.get("/players/:playerId/groups", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const groupsService = (0, tsyringe_1.build)(GroupService_1.GroupService);
    return groupsService.getGroupsByPlayer(req.params.playerId);
}));
exports.app.get("/groups/:groupId/quests", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const groupsService = (0, tsyringe_1.build)(GroupService_1.GroupService);
    return groupsService.getGroupsQuests(req.params.groupId, user.uid);
}));
exports.app.get("/reports", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const questsService = (0, tsyringe_1.build)(QuestService_1.QuestService);
    return questsService.getReports(req.user.uid);
}));
exports.app.get("/timers/:name", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const timerService = (0, tsyringe_1.build)(TimerService_1.TimerService);
    return timerService.getTimer(user.uid, req.params.name);
}));
exports.app.put("/timers/:name", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const timerService = (0, tsyringe_1.build)(TimerService_1.TimerService);
    return timerService.saveTimer(user.uid, {
        name: req.params.name,
        expiresIn: req.body,
    });
}));
exports.app.delete("/timers/:name", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const timerService = (0, tsyringe_1.build)(TimerService_1.TimerService);
    return timerService.deleteTimer(user.uid, req.params.name);
}));
exports.app.post("/login", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.login(req.body);
}, false));
exports.app.post("/register", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.registerStepOne(req.body);
}, false));
exports.app.post("/register/recover/password/:email", (req, res) => {
    return (0, express_helpers_1.recoverPassword)(req.params.email);
});
exports.app.post("/register/2", (0, express_helpers_1.verifyAuthenticated)(), (0, express_helpers_1.returnFailureOrSuccessExpress)((req, user) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.registerStepTwo(req.body, user.uid);
}));
exports.app.post("/register/anonymously", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.registerAnonymously(req.body.name);
}));
exports.app.post("/refreshToken", (0, express_helpers_1.returnFailureOrSuccessExpress)((req) => {
    const authService = (0, tsyringe_1.build)(AuthenticationService_1.AuthenticationService);
    return authService.refreshToken(req.body);
}, false));
exports.app.get("/", (req, res) => {
    res.send(`
    <h3> Hello World! </h3>
    <h4> Routes: </h4>
    ${(0, printRoutes_1.getRoutes)(exports.app)
        .filter((t) => !t.includes(",")).map((r) => "<p>" + r + "</p>")}
  `);
});
exports.app.post('/fileHandler/injest', (req, res) => {
    console.log(req.file);
    return res.send(req.body);
});
exports.app.use((req, res, next) => {
    res.status(404).send({
        statusCode: 404,
        name: "Error",
        message: "Rota não encontrada",
    });
});
exports.app.use(express_helpers_1.expressErrorHandler);
exports.default = exports.app;
//# sourceMappingURL=index.js.map