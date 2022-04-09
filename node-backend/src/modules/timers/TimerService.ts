import dayjs from "dayjs";
import admin from "firebase-admin";
import { Inject, Singleton } from "../../utils/tsyringe";
import { DurationDto, SaveTimerDto } from "./SaveTimerDto";
import { TimerFirebaseAdaptor } from "./TimerFirebaseAdaptor";

export type Duration = ReturnType<typeof dayjs.duration>;

@Singleton()
export class TimerService {
  constructor(
    @Inject(() => TimerFirebaseAdaptor) private timerDao: TimerFirebaseAdaptor
  ) {}
  saveTimer(userId: string, dto: SaveTimerDto) {
    const now = dayjs();
    const expiresAt = now.add(
      dayjs.duration(dto.expiresIn).asMilliseconds(),
      "millisecond"
    );
    return this.timerDao.saveEvent(userId, {
      [dto.name]: expiresAt.toDate(),
    });
  }
  deleteTimer(userId: string, name: string) {
    return this.timerDao.saveEvent(userId, {
      [name]: admin.firestore.FieldValue.delete(),
    });
  }
  async getTimer(userId: string, name: string) {
    const timers = await this.timerDao.getEvents(userId);
    const value = timers[name];
    if (!value)
      return {
        isExpired: true,
      };
    const expiresAt = dayjs(value.toDate());
    const now = dayjs();
    const expiresIn = expiresAt.diff(now);
    if (expiresIn > 0) {
      return {
        isExpired: false,
        expiresIn: toDurationDto(dayjs.duration(expiresIn)),
      };
    }
    return {
      isExpired: true,
    };
  }
}

function toDurationDto(duration: Duration): DurationDto {
  return { ...duration }["$d"];
}
