import { QuestFirebaseAdaptor } from "./QuestFirebaseAdaptor";
import { EntityNotFoundError } from "../../utils/errorUtils";
import { Group, QuestInGroupDto } from "../../../../packages/interfaces/groups";
import { UserService } from "../users/UserService";
import { Singleton, Inject } from "../../utils/tsyringe";
import admin from "firebase-admin";
import { GroupService } from "../groups/GroupService";
import { GetSingleReportDto } from "@interfaces/routes/GetSingleReportDto";
import {
  AnswerDto,
  SubmitAnswerDto,
} from "../../../../packages/interfaces/routes/AnswerDto";
import dayjs from "dayjs";
import { QuestErrors } from "./QuestErrors";
import { QuestionDto } from "../../../../packages/interfaces/quest";
import { includesAll, includesAny } from "../../utils/arr";
import { orUndefined } from "../../utils/orUndefined";
@Singleton()
export class QuestService {
  constructor(
    @Inject(() => QuestFirebaseAdaptor) private questsDao: QuestFirebaseAdaptor,
    @Inject(() => UserService) private userService: UserService,
    @Inject(() => GroupService) private groupService: GroupService
  ) { }
  RemoveEmptyFromArray(arr:Array<any>){
    return arr.filter(
      obj => !(obj && Object.keys(obj).length === 0)
    );
  }  
   
  async getReports(teacherId: string) {
    const reports = await this.questsDao.getPublishedQuests(teacherId);
    const groups = await this.groupService.getGroupsIgnoreNotFound(
      reports.map((r) => r.groupId)
    );
    return reports.map((report, i) => ({
      ...report,
      group: groups[i],
    }));
  }
  async getReport(questId: string) {
    const quest = await this.getQuest(questId);
    const playerIds = quest.players ?? [];
    /*let queriedReports = [] as GetSingleReportDto[];
    const reports = await playerIds.map(async (playerId) => {
      const playerAndAnswers = await this.getPlayerAndAnswer(playerId, questId);
      const report = {
        players: {
          player: playerAndAnswers.player,
          answer: playerAndAnswers.answer
        }
      } as unknown as GetSingleReportDto;
      queriedReports.push(report);
      return report;
    });

    const reportsPromisse = await Promise.all(reports)
    const finalReport = {
      report: quest,
        players: {        
        ...reportsPromisse
      }
    } 
    return finalReport; 
    */
    const playersAndAnswers = await Promise.all(
      playerIds.map((playerId) => this.getPlayerAndAnswer(playerId, questId))
    );
    playersAndAnswers.filter((value: {}) => Object.keys(value).length !== 0);

    
    return {
      report: quest,
      players: this.RemoveEmptyFromArray(playersAndAnswers),
    } as GetSingleReportDto;

  }
 
  async getPlayerAndAnswer(playerId: string, questId: string) {
    try {
      const [player, answer] = ([
        await this.userService.getPlayer(playerId),
        await this.questsDao.getAnswer(playerId, questId),
      ]);

      return {
        player,
        answer,
      };
    } catch {
      return {};
    }
  }

  getQuest(questId: string) {
    return this.questsDao.getQuest(questId).catch((err) => {
      throw err instanceof EntityNotFoundError
        ? QuestErrors.QuestNotFound(err)
        : err;
    });
  }
  async submitAnswer(answer: SubmitAnswerDto, userId: string) {
    // if previously answered quest, throw error
    const previousAnswer = await orUndefined(
      this.questsDao.getAnswer(userId, answer.questId)
    );
    if (previousAnswer) {
      throw QuestErrors.UserAlreadyAnswered(previousAnswer);
    }

    const quest = await this.questsDao.getQuest(answer.questId);

    if (
      quest.dataExpiracao &&
      dayjs(quest.dataExpiracao.toDate()).isBefore(new Date())
    ) {
      throw QuestErrors.QuestExpired(quest.dataExpiracao.toDate());
    }

    const group = await this.groupService.getGroup(quest.groupId);

    await this.groupService.addStudentToGroup(
      userId,
      group.id,
      quest.teacherId
    );

    const studentsAnswered = quest.studentsAnswered + 1;

    await this.userService.incrementTeachersScore(quest.teacherId, {
      points: studentsAnswered === 5 ? 6 : 5,
      publishedActivitiesCount: studentsAnswered === 5 ? 1 : 0,
      studentsCompletedActivityCount: 1,
    });

    const score = getScore(quest, answer);

    await this.questsDao.saveAnswer(score, userId);

    const questStats = getUpdatedQuestStats(quest, score);
    const groupStats = getUpdatedGroupStats(group, score.score);

    await this.questsDao.updateQuestInGroup(answer.questId, {
      ...questStats,
      players: admin.firestore.FieldValue.arrayUnion(userId),
    });

    await this.groupService.updateGroup(group.id, groupStats);

    await this.userService.savePlayerStats(userId, {
      completedQuests: {
        [quest.id]: true,
      },
      completedQuestsCount: admin.firestore.FieldValue.increment(1),
    });
  }
}

function getUpdatedQuestStats(
  quest: QuestInGroupDto,
  answer: AnswerDto
): QuestInGroupDto {
  const questionsCount = Object.keys(quest.questions).length;
  const scorePercentage = answer.acertos / questionsCount;
  const studentsAnswerd = quest.studentsAnswered ?? 0;
  const oldAvgScore = quest.averageScore ?? 0;
  const newAvgScore =
    (studentsAnswerd * oldAvgScore + scorePercentage) / (studentsAnswerd + 1);
  return {
    ...quest,
    averageScore: newAvgScore,
    studentsAnswered: studentsAnswerd + 1,
  };
}

function getUpdatedGroupStats(group: Group, score: number): Group {
  const scorePercentage = score;
  const studentsAnswerd = group.studentsAnswered ?? 0;
  const oldAvgScore = group.averageScore ?? 0;
  const newAvgScore =
    (studentsAnswerd * oldAvgScore + scorePercentage) / (studentsAnswerd + 1);
  return {
    ...group,
    averageScore: newAvgScore,
    studentsAnswered: studentsAnswerd + 1,
  };
}

function getScore(quest: QuestInGroupDto, answer: SubmitAnswerDto): AnswerDto {
  const total = Object.keys(quest.questions).length;
  let acertos = 0;
  let erros = 0;
  // tslint:disable-next-line:forin
  for (const questionId in quest.questions) {
    const question = quest.questions[questionId];
    const answeredId = answer.answers[questionId];
    const didGetCorrect =
      question.type === "multiple-choices"
        ? didGetMultipleAnswerQuestionCorrect(question, answeredId)
        : didGetSingleAnswerQuestionCorrect(question, answeredId);
    if (didGetCorrect) {
      acertos++;
    } else {
      erros++;
    }
  }
  return {
    ...answer,
    answeredAt: new Date(),
    acertos,
    erros,
    total,
    score: acertos / total,
  };
}

function didGetMultipleAnswerQuestionCorrect(
  question: QuestionDto,
  answers: any
) {
  const studentAnswers: string[] = Array.isArray(answers) ? answers : [answers];

  // only true if he gets ALL of the answers right, and NONE of the answers wrong
  const correctAnswers = question.answers
    .filter((a) => a.isCorrect)
    .map((a) => a.id);
  const incorrectAnswers = question.answers
    .filter((a) => !a.isCorrect)
    .map((a) => a.id);

  if (includesAny(studentAnswers, incorrectAnswers)) {
    return false;
  }

  if (includesAll(studentAnswers, correctAnswers)) {
    return true;
  }

  return false;
}

function didGetSingleAnswerQuestionCorrect(
  question: QuestionDto,
  answeredId: any
) {
  if (typeof answeredId == "string") {
    const didGetCorrect = question.answers.find(
      (a) => a.isCorrect && a.id === answeredId
    );
    return !!didGetCorrect;
  }
  return false;
}
