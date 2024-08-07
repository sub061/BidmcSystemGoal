export interface ISystemGoalKpiProps {
  description: string;
  system_goal: string;
  goal: string;
  sub_goal: string;
  kpi: string;
  division: string;
  hospital: string;
  metrix: string;
  getGoalMetrix: IGoalMetrix[];
  getDivision: IDivision[];
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
  getOperatingModel:IOperatingModel[];
}

export interface ISystemGoalProps {
  description: string;
  getOperatingModel:IOperatingModel[];
  getGoalMetrix: IGoalMetrix[];
  getDivision : IDivision[]
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
}

export interface IDivision{
  Id: number;
  Title: string;
  OrganizationId: string;
  Organization : ISystemGoal
}

export interface IGoalMetrix{
  OperatingModelId: number;
  OrganizationId: number;
  GoalId: number;
  SubGoalId: number;
  KPIId: number;
  HospitalId: number;
  Actual: string;
  Target: string;
  URL: string;

}

export interface IHospital{
  Id: number;
  Title: string;
  Division: IDivision;
  DivisionId: number;
  OrganizationId: number;
  Organization: string;
}

export interface IGoal{
  Id: number;
  Title: string;
}
export interface IKPI{
  Id: number;
  Title: string;
  SubGoalId: number;
   SubGoal: string;
}
export interface ISubGoal{
  Id: number;
  Title: string;
  Goal: string;
  GoalId: number;

}
export interface ISystemGoal{
  [x: string]: any;
  Id: number;
  Title: string;
}

export interface IOperatingModel{
  Id: number;
  Title: string;
}