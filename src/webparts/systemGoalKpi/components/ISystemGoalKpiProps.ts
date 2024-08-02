export interface ISystemGoalKpiProps {
  description: string;
  system_goal: string;
  goal: string;
  sub_goal: string;
  kpi: string;
  hospital: string;
  metrix: string;
   getGoalMetrix: IGoalMetrix[];
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
}

export interface ISystemGoalProps {
  description: string;
  getGoalMetrix: IGoalMetrix[];
  getHospital: IHospital[];
  getKPI: IKPI[];
  getSubGoal: ISubGoal[];
  getGoal: IGoal[];
  getSystemGoal: ISystemGoal[];
}



export interface IGoalMetrix{
  SystemGoalId: number;
  GoalId: number;
  SubGoalId: number;
  KPIId: number;
  HospitalId: number;
  Actual: string;
  Target: string;

}

export interface IHospital{
  Id: number;
  Title: string;
}

export interface IGoal{
  Id: number;
  Title: string;
}
export interface IKPI{
  Id: number;
  Title: string;
}
export interface ISubGoal{
  Id: number;
  Title: string;
}
export interface ISystemGoal{
  [x: string]: any;
  Id: number;
  Title: string;
}