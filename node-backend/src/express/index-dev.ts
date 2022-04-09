import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  expressErrorHandler,
  returnFailureOrSuccessExpress,
  verifyAuthenticated,
  recoverPassword,
  checkDeviceId,
} from "./express-helpers";
import { build } from "../utils/tsyringe";
import { InstitutionFacade } from "../modules/institutions/InstitutionFacade";
import { ShopService } from "../modules/shop/ShopService";
import { QuestService } from "../modules/quests/QuestService";
import { UserService } from "../modules/users/UserService";
import { GroupService } from "../modules/groups/GroupService";
import { TimerService } from "../modules/timers/TimerService";
import { AuthenticationService } from "../modules/authentication/AuthenticationService";
import { getRoutes } from "../utils/printRoutes";
import { ConfigService } from "../modules/GlobalConfig/ConfigService";
import { MessageService } from "../modules/Messages/MessageService";
import { GameVersionFirebaseAdapter } from "../modules/GlobalConfig/GameVersionFirebaseAdapter";
import { InstitutionService } from "../modules/institutions/InstitutionService";
import { TeacherFirebaseAdaptor } from "../modules/teachers/teacherFirebaseAdaptor";
//import { PlayerMigration } from "../migration/playerStatsMigration/migratePlayerStatsAdapter";
import { TeacherService } from "../modules/teachers/teacherService";
import { HouseService } from "../modules/HousingSystem/HousingSystemService";
import { AlertFirebaseAdapter } from "../modules/alertSystem/AlertAdapter";
import { TowerService } from "../modules/endlessTowerSystem/EndlessTowerService";
//import { PlayerService } from "../modules/Players/PlayerService";
import { PlayerStatsService } from "../modules/playerStats/PlayerStatsService";
//import {DailyService } from "../modules/daily/DailyService"; //TODO
import { PlayerInventoryService } from "../modules/playerInventory/PlayerInventoryService";
//import {InstitutionMigrationAdapter} from "../migration/institutionMigration/institutionMigrationAdapter";
//import { ReportsFacade } from "../modules/report/ReportFacade";
//import { QuestMigrator } from "../migration/questMigration/questMigrationAdapter";
export const dev = express();
dev.use(cors({ origin: true }));
dev.use(bodyParser.json());
dev.use(bodyParser.urlencoded({ extended: false }));



/*PLAYER INVENTORY */
dev.post(
  "/player/inventory/save",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.savePlayerInventoryComplete(req.body);
  })
);
dev.get(
  "/player/inventory/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.getPlayerInventory(req.params.playerId);
  })
);

dev.post(
  "/player/gold/update/new",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.updatePlayerGold(
      req.body.playerId,
      req.body.goldAmount
    );
  })
);
dev.delete(
  "/player/inventory/delete/:playerId",
  returnFailureOrSuccessExpress((req) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.deletePlayerInventory(req.params.playerId);
  })
);

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
dev.post(
  "/house/create/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
  })
);
dev.post(
  "/house/chest/save/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
  })
);

dev.post(
  "/house/save/:playerId",
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    return houseService.savePlayerHouse(req.body);
  })
);
dev.delete(
  "/house/delete",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const houseService = build(HouseService);
    return houseService.deleteHouse(user.uid);
  })
);
dev.get(
  "/house/get",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const houseService = build(HouseService);
    return houseService.getHouse(user.uid);
  })
);
/*-----------------ENDLESSTOWER --------------- */
//Working

dev.get(
  "/tower/:towerId/get",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.getTower(req.params.towerId);
  })
);
//Working
dev.post(
  "/tower/create",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.createTower(req.body);
  })
);

dev.post(
  "tower/quest/create",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.createTower(req.body);
  })
);

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
dev.post(
  "/teacher/:teacherId/institution/:institutionId",
  returnFailureOrSuccessExpress((req) => {
    const tyeacherService = build(TeacherService);
    return tyeacherService.addTeacherToInstitution(
      req.params.teacherId,
      req.params.institutionId
    );
  })
);
//Convidar professor para instituição: OK - TESTED
dev.post(
  "/institution/invite",

  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.InviteTeacherToInstitution(req.body);
  })
);
//Aceitar e adicionar o professor na instituição: OK - TESTED
dev.post(
  "/institution/accept/teacher",
  returnFailureOrSuccessExpress((req) => {
    const institutionFacade = build(InstitutionFacade);
    return institutionFacade.AcceptTeacherInInstitution(req.body);
  }, false)
);

//Buscar professores na instituição: OK - TESTED
dev.get(
  "/institution/:institutionId/teachers/",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getInstitutionTeachersIds(
      req.params.institutionId
    );
  })
);

//buscar grupos na instituição: OK - TESTED

dev.get(
  "/institution/:institutionId/groups",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionFacade = build(InstitutionFacade);
    return institutionFacade.getInstitutionGroups(req.params.institutionId);
  })
);

dev.post(
  "/institution/:institutionId/invites",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionFacade);
    return institutionService.AcceptTeacherInInstitution(req.body);
  })
);

dev.get(
  "/institution/:institutionId/invites",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getInstitutionPendingInvitations(
      req.params.institutionId
    );
  })
);

dev.put(
  "/institution/update",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.updateInstitutionInfo(req.body);
  })
);

dev.get(
  "/teacher/institution",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getTeacherInstitutionsInfo(req.user.uid);
  })
);

/*----------------- MESSAGES ----------------- */
dev.post(
  "/message/:groupId/send",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const messageService = build(MessageService);
    return messageService.SendMessageToGroup(
      req.params.groupId,
      req.body,
      user.uid
    );
  })
);
dev.delete(
  "/message/:groupId/delete/:messageId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const messageService = build(MessageService);
    return messageService.removeMessageFromGroup(
      req.params.groupId,
      req.params.messageId
    );
  })
);
dev.get(
  "/message/:groupId/group",
  returnFailureOrSuccessExpress((req) => {
    const messageService = build(MessageService);
    return messageService.getMessageFromGroup(req.params.groupId);
  })
);
dev.post(
  "/message/:messageId/:groupId/remove/",
  returnFailureOrSuccessExpress((req) => {
    const messageService = build(MessageService);
    return messageService.removeMessageFromGroup(
      req.params.messageId,
      req.params.groupId
    );
  }, false)
);
/*------------------ TEACHERS --------------------- */
dev.get(
  "/teacher/:teacherId/intitution",
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherService);
    return teacherService.getTeacherStatisctics(req.params.teacherId);
  })
);
dev.get(
  "/teacher/:teacherId/groups/count",
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherService);
    return teacherService.getTeacherGroupsCount(req.params.teacherId);
  })
);
dev.get(
  "/teacher/:teacherEmail/findByEmail",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
  })
);
/*----------------- PLAYER STATS ----------------- */
dev.get(
  "/players/stats",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const playerService = build(PlayerStatsService);
    return playerService.getPlayerStats(user.uid);
  })
);
dev.post(
  "/players/stats/create",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const playerService = build(PlayerStatsService);
    return playerService.createPlayerStats(user.uid);
  })
);
dev.post(
  "/players/stats/save",
  verifyAuthenticated(),
  checkDeviceId(),
  returnFailureOrSuccessExpress((req, user) => {
    const playerService = build(PlayerStatsService);
    return playerService.savePlayerStats(user.uid, req.body);
  })
);
//Configs

dev.post(
  "/alerts/config",
  returnFailureOrSuccessExpress((req) => {
    const alertAdapter = build(AlertFirebaseAdapter);
    return alertAdapter.getAlertConfig();
  })
);
dev.post(
  "/config/deviceId/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const alertAdapter = build(AuthenticationService);
    return alertAdapter.createDeviceId(req.user.uid);
  })
);
dev.get(
  "/config/deviceId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.getDeviceId(req.user.uid);
  })
);
dev.get(
  "/config/game/version",
  returnFailureOrSuccessExpress((req) => {
    const gameVersion = build(GameVersionFirebaseAdapter);
    return gameVersion.getAllowedGameVersion();
  })
);

dev.get(
  "/alerts/all",
  returnFailureOrSuccessExpress((req) => {
    const alertAdapter = build(AlertFirebaseAdapter);
    return alertAdapter.fetchActiveAlerts();
  })
);
/*----------------- GAME CONFIG ----------------- */
dev.post(
  "/admin/group/create",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupService = build(GroupService);
    return groupService.createGroupWithFixedId(req.body, req.user.uid);
  })
);
dev.get(
  "/config",
  returnFailureOrSuccessExpress((req) => {
    const configService = build(ConfigService);
    return configService.getConfig();
  })
);
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
dev.get(
  "/shop",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const shopService = build(ShopService);
    return shopService.getShopItems();
  })
);
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
dev.get(
  "/quests/:questId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const questsService = build(QuestService);
    return questsService.getQuest(req.params.questId);
  })
);
dev.get(
  "/players/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.getPlayer(req.params.playerId);
  })
);
dev.patch(
  "/players/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.savePlayer(req.params.playerId, req.body);
  })
);

dev.get(
  "/teacher/:teacherEmail/findByEmail",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
  })
);
dev.get(
  "/groups/:groupId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupsService = build(GroupService);
    return groupsService.getGroup(req.params.groupId);
  })
);
dev.get(
  "/teachers/:teacherId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.getTeacher(req.params.teacherId);
  })
);
dev.post(
  "/quests/:questId/answers",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const questsService = build(QuestService);
    const body = req.body;
    // body.groupId = req.params.groupId;
    body.questId = req.params.questId;
    return questsService.submitAnswer(req.body, user.uid);
  })
);
dev.get(
  "/quests/:questId/report",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const questsService = build(QuestService);
    return questsService.getReport(req.params.questId);
  })
);
dev.get(
  "/players/:playerId/groups",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupsService = build(GroupService);
    return groupsService.getGroupsByPlayer(req.params.playerId);
  })
);

dev.get(
  "/groups/:groupId/quests",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const groupsService = build(GroupService);
    return groupsService.getGroupsQuests(req.params.groupId, user.uid);
  })
);
dev.get(
  "/reports",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const questsService = build(QuestService);
    return questsService.getReports(req.user.uid);
  })
);
dev.get(
  "/timers/:name",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const timerService = build(TimerService);
    return timerService.getTimer(user.uid, req.params.name);
  })
);
dev.put(
  "/timers/:name",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const timerService = build(TimerService);
    return timerService.saveTimer(user.uid, {
      name: req.params.name,
      expiresIn: req.body,
    });
  })
);
dev.delete(
  "/timers/:name",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const timerService = build(TimerService);
    return timerService.deleteTimer(user.uid, req.params.name);
  })
);
dev.post(
  "/login",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.login(req.body);
  }, false)
);
dev.post(
  "/register",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.registerStepOne(req.body);
  }, false)
);
dev.post("/register/recover/password/:email", (req, res) => {
  return recoverPassword(req.params.email);
});
dev.post(
  "/register/2",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const authService = build(AuthenticationService);
    return authService.registerStepTwo(req.body, user.uid);
  })
);
dev.post(
  "/register/anonymously",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.registerAnonymously(req.body.name);
  })
);
dev.post(
  "/refreshToken",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.refreshToken(req.body);
  }, false)
);
dev.get("/", (req, res) => {
  res.send(`
    <h3> Hello World! </h3>
    <h4> Routes: </h4>
    ${getRoutes(dev)
      .filter((t) => !t.includes(","))
      .map((r) => "<p>" + r + "</p>")}
  `);
});
dev.use((req, res, next) => {
  res.status(404).send({
    statusCode: 404,
    name: "Error",
    message: "Rota não encontrada",
  });
});
dev.use(expressErrorHandler);
export default dev;
