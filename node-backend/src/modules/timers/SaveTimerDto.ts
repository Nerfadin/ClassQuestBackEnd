
export class SaveTimerDto {
  expiresIn: Partial<DurationDto>;
  name: string;
}

export interface DurationDto {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
