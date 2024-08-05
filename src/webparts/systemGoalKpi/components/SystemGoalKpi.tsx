import * as React from "react";
// import styles from "./SystemGoalKpi.module.scss";
import type {
  IGoal,
  IGoalMetrix,
  IHospital,
  IKPI,
  ISubGoal,
  ISystemGoal,
  ISystemGoalKpiProps,
  ISystemGoalProps,
} from "./ISystemGoalKpiProps";

export interface ISystemGoalKpiWpState {
  dataGoalMetrix: IGoalMetrix[] | null;
  dataHospital: IHospital[] | null;
  dataKPI: IKPI[] | null;
  dataSubGoal: ISubGoal[] | null;
  dataGoal: IGoal[] | null;
  dataSystemGoal: ISystemGoal[] | null;
}

export default class SystemGoalKpi extends React.Component<
  ISystemGoalProps,
  ISystemGoalKpiWpState
> {
  public constructor(props: ISystemGoalKpiProps) {
    super(props);
    this.state = {
      dataGoalMetrix: props.getGoalMetrix || null, // Initialize state with the passed prop or null
      dataHospital: props.getHospital || null, // Initialize state with the passed prop or null
      dataKPI: props.getKPI || null, // Initialize state with the passed prop or null
      dataSubGoal: props.getSubGoal || null, // Initialize state with the passed prop or null
      dataGoal: props.getGoal || null, // Initialize state with the passed prop or null
      dataSystemGoal: props.getSystemGoal || null, // Initialize state with the passed prop or null
    };
    console.log("tsx file constructor");
  }

  // Get Main System Goal
  private getSystemGoalTitle = (SystemGoalId: number) => {
    const { dataSystemGoal } = this.state;
    if (!dataSystemGoal) return "Unknown System Goal"; // Check if dataSystemGoal is null
    const systemGoal = dataSystemGoal.find(
      (systemGoal) => systemGoal.Id === SystemGoalId
    );
    return systemGoal ? systemGoal.Title : "Unknown System Goal";
  };

  // Get Goal
  private getGoalTitle = (GoalId: number) => {
    const { dataGoal } = this.state;
    if (!dataGoal) return "Unknown Goal"; // Check if dataGoal is null
    const goal = dataGoal.find((goal) => goal.Id === GoalId);
    return goal ? goal.Title : "Unknown Goal";
  };

  // Get sub Goal
  private getSubGoalTitle = (SubGoalId: number) => {
    const { dataSubGoal } = this.state;
    if (!dataSubGoal) return "Unknown SubGoal"; // Check if dataSubGoal is null
    const subgoal = dataSubGoal.find((subgoal) => subgoal.Id === SubGoalId);
    return subgoal ? subgoal.Title : "Unknown SubGoal";
  };

  // Get KPI
  private getKPITitle = (KpiId: number) => {
    const { dataKPI } = this.state;
    if (!dataKPI) return "Unknown KPI"; // Check if dataKPI is null
    const kpi = dataKPI.find((kpi) => kpi.Id === KpiId);
    return kpi ? kpi.Title : "Unknown KPI";
  };

  // get Hospital
  private getHospitalTitle = (hospitalId: number) => {
    const { dataHospital } = this.state;
    if (!dataHospital) return "Unknown Hospital"; // Check if dataHospital is null
    const hospital = dataHospital.find(
      (hospital) => hospital.Id === hospitalId
    );
    return hospital ? hospital.Title : "Unknown Hospital";
  };

  // Group data by SystemGoalId, then GoalId, then SubGoalId, and finally by KPIId
  private groupData = (data: IGoalMetrix[]) => {
    const groupedData: any = {};

    data.forEach((item) => {
      if (!groupedData[item.SystemGoalId]) {
        groupedData[item.SystemGoalId] = {};
      }
      if (!groupedData[item.SystemGoalId][item.GoalId]) {
        groupedData[item.SystemGoalId][item.GoalId] = {};
      }
      if (!groupedData[item.SystemGoalId][item.GoalId][item.SubGoalId]) {
        groupedData[item.SystemGoalId][item.GoalId][item.SubGoalId] = {};
      }
      if (
        !groupedData[item.SystemGoalId][item.GoalId][item.SubGoalId][item.KPIId]
      ) {
        groupedData[item.SystemGoalId][item.GoalId][item.SubGoalId][
          item.KPIId
        ] = [];
      }
      groupedData[item.SystemGoalId][item.GoalId][item.SubGoalId][
        item.KPIId
      ].push(item);
    });

    return groupedData;
  };

  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const {
      dataGoalMetrix,
      // dataHospital,
      // dataKPI,
      // dataSubGoal,
      // dataGoal,
      // dataSystemGoal,
    } = this.state;

    const groupedData = this.groupData(dataGoalMetrix || []);

    console.log("final groupedData=", groupedData);

    return (
      <section>
        <div>
          {Object.keys(groupedData).map((systemGoalId) => (
            <div key={systemGoalId} className="systemgoal-container">
              <h3>
                System Goal: {this.getSystemGoalTitle(Number(systemGoalId))}
              </h3>
              {Object.keys(groupedData[systemGoalId]).map((goalId) => (
                <div key={goalId} className="goal-container">
                  <h4>Goal: {this.getGoalTitle(Number(goalId))}</h4>
                  {Object.keys(groupedData[systemGoalId][goalId]).map(
                    (subGoalId) => (
                      <div key={subGoalId} className="subgoal-container">
                        <h5>
                          Sub Goal: {this.getSubGoalTitle(Number(subGoalId))}
                        </h5>
                        {Object.keys(
                          groupedData[systemGoalId][goalId][subGoalId]
                        ).map((kpiId) => (
                          <div key={kpiId} className="kpi-container">
                            <h6>KPI: {this.getKPITitle(Number(kpiId))}</h6>
                            {groupedData[systemGoalId][goalId][subGoalId][
                              kpiId
                            ].map(
                              (
                                metrix: {
                                  HospitalId: number;
                                  Actual:
                                    | boolean
                                    | React.ReactChild
                                    | React.ReactFragment
                                    | React.ReactPortal
                                    | null
                                    | undefined;
                                  Target:
                                    | boolean
                                    | React.ReactChild
                                    | React.ReactFragment
                                    | React.ReactPortal
                                    | null
                                    | undefined;
                                },
                                subIndex: React.Key | null | undefined
                              ) => (
                                <div key={subIndex} className="goal-item">
                                  <p>
                                    Hospital:{" "}
                                    {this.getHospitalTitle(metrix.HospitalId)}
                                  </p>
                                  <p>Actual: {metrix.Actual}</p>
                                  <p>Target: {metrix.Target}</p>
                                </div>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }
}
