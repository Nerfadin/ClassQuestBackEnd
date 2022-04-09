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
export type TeacherInstitutionStatistics = {
  id: string,
  groupsCount: number,
  studentsCount: number
}