import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  expressErrorHandler,
  returnFailureOrSuccessExpress,
  verifyAuthenticated,
  recoverPassword
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
import { QuestMigrator } from '../migration/questMigration/questMigrationAdapter';
import { SubjectService } from '../modules/subjectsSystem/subjectService';
import { OwnerFirebaseAdapter } from '../modules/institutions/owner/ownerFirebaseAdapter';
export const app = express();
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*----------------- OWNER ----------------- */

/* ----------------- SUBJECTS ----------------- */

app.post('/subjects/create', returnFailureOrSuccessExpress((req => {
  const subjectDto = req.body;
  const subjectService = build(SubjectService);
  return subjectService.CreateSubject(subjectDto);
})))
app.get('/subjects/slug/:subjectSlug', returnFailureOrSuccessExpress((req => {
  const subjectService = build(SubjectService);
  return subjectService.SearchSubjectBySlug(req.params.subjectSlug);
})))

app.get('/subjects/name/:subjectName', returnFailureOrSuccessExpress((req => {
  const subjectService = build(SubjectService);
  return subjectService.SearchSubjectByFullName(req.params.subjectName);
})))

app.get('/subjects/main', returnFailureOrSuccessExpress((req => {
  const subjectService = build(SubjectService);
  return subjectService.GetMainSubjects();
})))

/*PLAYER INVENTORY */
app.post(
  "/player/inventory/save",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.savePlayerInventoryComplete(req.body);
  })
);
app.post('/institution/owner', returnFailureOrSuccessExpress((req => {
  const subjectService = build(OwnerFirebaseAdapter);
  return subjectService.CreateOwner(req.body);
})))
app.get(
  "/player/inventory/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, res) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.getPlayerInventory(req.params.playerId);
  })
);

app.post(
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
app.delete(
  "/player/inventory/delete/:playerId",
  returnFailureOrSuccessExpress((req) => {
    const inventorySystem = build(PlayerInventoryService);
    return inventorySystem.deletePlayerInventory(req.params.playerId);
  })
);

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
app.post(
  "/house/create/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
  })
);
app.post(
  "/house/chest/save/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    const house = houseService.createHouse(req.params.playerId);
    return house;
  })
);
app.post(
  "/house/save/:playerId",
  returnFailureOrSuccessExpress((req) => {
    const houseService = build(HouseService);
    return houseService.savePlayerHouse(req.body);
  })
);
app.delete(
  "/house/delete",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const houseService = build(HouseService);
    return houseService.deleteHouse(user.uid);
  })
);
app.get(
  "/house/get",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const houseService = build(HouseService);
    return houseService.getHouse(user.uid);
  })
);
/*-----------------ENDLESSTOWER --------------- */
//Working

app.get(
  "/tower/:towerId/get",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.getTower(req.params.towerId);
  })
);
//Working
app.post(
  "/tower/create",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.createTower(req.body);
  })
);

app.post(
  "tower/quest/create",
  returnFailureOrSuccessExpress((req) => {
    const towerService = build(TowerService);
    return towerService.createTower(req.body);
  })
);

/*----------------- MIGRATION ----------------- */

app.post('/migration/quests/institution', returnFailureOrSuccessExpress((req) => {
  const questMigrator = build(QuestMigrator);
  return questMigrator.createQuestRelationshipWithInstitution();
}))
/*----------------- INSTITUTION ----------------- */

/* Brute force add teacher*/
app.post(
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
app.post(
  "/institution/invite",

  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.InviteTeacherToInstitution(req.body);
  })
);
//Aceitar e adicionar o professor na instituição: OK - TESTED
app.post(
  "/institution/accept/teacher",
  returnFailureOrSuccessExpress((req) => {
    const institutionFacade = build(InstitutionFacade);
    return institutionFacade.AcceptTeacherInInstitution(req.body);
  }, false)
);

//Buscar professores na instituição: OK - TESTED
app.get(
  "/institution/:institutionId/teachers/",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getInstitutionTeachersIds(
      req.params.institutionId
    );
  })
);

//buscar grupos na instituição: OK - TESTED

app.get(
  "/institution/:institutionId/groups",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionFacade = build(InstitutionFacade);
    return institutionFacade.getInstitutionGroups(req.params.institutionId);
  })
);

app.post(
  "/institution/:institutionId/invites",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionFacade);
    return institutionService.AcceptTeacherInInstitution(req.body);
  })
);

app.get(
  "/institution/:institutionId/invites",
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getInstitutionPendingInvitations(
      req.params.institutionId
    );
  })
);

app.put(
  "/institution/update",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.updateInstitutionInfo(req.body);
  })
);

app.get(
  "/teacher/institution",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const institutionService = build(InstitutionService);
    return institutionService.getTeacherInstitutionsInfo(req.user.uid);
  })
);

/*----------------- MESSAGES ----------------- */
app.post(
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
app.delete(
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
app.get(
  "/message/:groupId/group",
  returnFailureOrSuccessExpress((req) => {
    const messageService = build(MessageService);
    return messageService.getMessageFromGroup(req.params.groupId);
  })
);
app.post(
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
app.get(
  "/teacher/:teacherId/intitution",
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherService);
    return teacherService.getTeacherStatisctics(req.params.teacherId);
  })
);
app.get(
  "/teacher/:teacherId/groups/count",
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherService);
    return teacherService.getTeacherGroupsCount(req.params.teacherId);
  })
);
app.get(
  "/teacher/:teacherEmail/findByEmail",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
  })
);
/*----------------- PLAYER STATS ----------------- */
app.get(
  "/players/stats",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    //Quais são os métodos que a conexão pode realizar na API

    const playerService = build(PlayerStatsService);
    return playerService.getPlayerStats(user.uid);
  })
);
app.post(
  "/players/stats/create",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const playerService = build(PlayerStatsService);
    return playerService.createPlayerStats(user.uid);
  })
);
app.post(
  "/players/stats/save",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const playerService = build(PlayerStatsService);
    return playerService.savePlayerStats(user.uid, req.body);
  })
);
//Configs

app.post(
  "/alerts/config",
  returnFailureOrSuccessExpress((req) => {
    const alertAdapter = build(AlertFirebaseAdapter);
    return alertAdapter.getAlertConfig();
  })
);
app.post(
  "/config/deviceId/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const alertAdapter = build(AuthenticationService);
    return alertAdapter.createDeviceId(req.user.uid);
  })
);
app.get(
  "/config/deviceId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.getDeviceId(req.user.uid);
  })
);
app.get(
  "/config/game/version",
  returnFailureOrSuccessExpress((req) => {
    const gameVersion = build(GameVersionFirebaseAdapter);
    return gameVersion.getAllowedGameVersion();
  })
);

app.get(
  "/alerts/all",
  returnFailureOrSuccessExpress((req, res) => {
    const alertAdapter = build(AlertFirebaseAdapter);
    return alertAdapter.fetchActiveAlerts();
  })
);
/*----------------- GAME CONFIG ----------------- */
app.post(
  "/admin/group/create",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupService = build(GroupService);
    return groupService.createGroupWithFixedId(req.body, req.user.uid);
  })
);
app.get(
  "/config",
  returnFailureOrSuccessExpress((req) => {
    const configService = build(ConfigService);
    return configService.getConfig();
  })
);
/* ----------------- PVP ----------------- */


app.get(
  "/shop",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const shopService = build(ShopService);
    return shopService.getShopItems();
  })
);
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
app.get(
  "/quests/:questId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const questsService = build(QuestService);
    return questsService.getQuest(req.params.questId);
  })
);
app.get(
  "/players/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.getPlayer(req.params.playerId);
  })
);
app.patch(
  "/players/:playerId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.savePlayer(req.params.playerId, req.body);
  })
);

app.get(
  "/teacher/:teacherEmail/findByEmail",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const teacherService = build(TeacherFirebaseAdaptor);
    return teacherService.findTeacherByEmail(req.params.teacherEmail);
  })
);
app.get(
  "/groups/:groupId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupsService = build(GroupService);
    return groupsService.getGroup(req.params.groupId);
  })
);
app.get(
  "/teachers/:teacherId",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const userService = build(UserService);
    return userService.getTeacher(req.params.teacherId);
  })
);
app.post(
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

app.get(
  "/quests/:questId/report",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const questsService = build(QuestService);
    return questsService.getReport(req.params.questId);
  })
);
app.get(
  "/players/:playerId/groups",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req) => {
    const groupsService = build(GroupService);
    return groupsService.getGroupsByPlayer(req.params.playerId);
  })
);

app.get(
  "/groups/:groupId/quests",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const groupsService = build(GroupService);
    return groupsService.getGroupsQuests(req.params.groupId, user.uid);
  })
);
app.get(
  "/reports",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const questsService = build(QuestService);
    return questsService.getReports(req.user.uid);
  })
);
app.get(
  "/timers/:name",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const timerService = build(TimerService);
    return timerService.getTimer(user.uid, req.params.name);
  })
);
app.put(
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
app.delete(
  "/timers/:name",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const timerService = build(TimerService);
    return timerService.deleteTimer(user.uid, req.params.name);
  })
);
app.post(
  "/login",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.login(req.body);
  }, false)
);
app.post(
  "/register",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.registerStepOne(req.body);
  }, false)
);
app.post("/register/recover/password/:email", (req, res) => {
  return recoverPassword(req.params.email);
});
app.post(
  "/register/2",
  verifyAuthenticated(),
  returnFailureOrSuccessExpress((req, user) => {
    const authService = build(AuthenticationService);
    return authService.registerStepTwo(req.body, user.uid);
  })
);
app.post(
  "/register/anonymously",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.registerAnonymously(req.body.name);
  })
);
app.post(
  "/refreshToken",
  returnFailureOrSuccessExpress((req) => {
    const authService = build(AuthenticationService);
    return authService.refreshToken(req.body);
  }, false)
);
app.get("/", (req, res) => {
  res.send(`
    <h3> Hello World! </h3>
    <h4> Routes: </h4>
    ${getRoutes(app)
      .filter((t) => !t.includes(",")).map((r) => "<p>" + r + "</p>")}
  `);
});
app.post('/fileHandler/injest',
  (req: Request, res: Response) => {
    console.log(req.file)
    return res.send(req.body);
  })
app.use((req, res, next) => {
  res.status(404).send({
    statusCode: 404,
    name: "Error",
    message: "Rota não encontrada",
  });
});

app.use(expressErrorHandler);
export default app;
