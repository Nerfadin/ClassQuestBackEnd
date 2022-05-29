export type Teacher = {
  id: string;
  institutionIds: string[]
  telefone: string;
  nome: string;
  email: string;
  materias?: {
    [p: string] : string[]
  };
  points?: number,
  studentsCount?: number;
  publishedActivitiesCount?: number;
  studentsCompletedActivityCount?: number;
};
export type RegisterTeacherDto = Omit<Teacher, "id" | "institutionIds"> & {
  email: string;
  password: string;
  passwordConfirm: string;
  instituicao: string;
  institutionId?: string;
};
export type TeacherInstitutionStatistics = {
  id: string,
  groupsCount: number,
  studentsCount: number
}