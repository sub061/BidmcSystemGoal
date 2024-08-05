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

  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const {
      dataGoalMetrix,
      dataHospital,
      dataKPI,
      dataSubGoal,
      dataGoal,
      dataSystemGoal,
    } = this.state;

    const groupBySystemGoalId = (data: any[]) => {
      if (!Array.isArray(data)) return {};
      return data.reduce((acc, item) => {
        if (!acc[item.SystemGoalId]) {
          acc[item.SystemGoalId] = [];
        }
        acc[item.SystemGoalId].push(item);

        console.log("groupby SystemGoalId", acc);
        return acc;
      }, {});
    };

    const groupByGoalId = (data: any[]) => {
      if (!Array.isArray(data)) return {};
      return data.reduce((bcc, item) => {
        if (!bcc[item.GoalId]) {
          bcc[item.GoalId] = [];
        }
        bcc[item.GoalId].push(item);

        console.log("groupby GoalId", bcc);
        return bcc;
      }, {});
    };

    const groupBySubGoalId = (data: any[]) => {
      if (!Array.isArray(data)) return {};
      return data.reduce((ccc, item) => {
        if (!ccc[item.SubGoalId]) {
          ccc[item.SubGoalId] = [];
        }
        ccc[item.SubGoalId].push(item);

        console.log("groupby Sub", ccc);
        return ccc;
      }, {});
    };

    console.log("final dataSystemGoal data=", dataSystemGoal);
    console.log("final dataGoal data=", dataGoal);
    console.log("final dataSubGoal data=", dataSubGoal);
    console.log("final dataKPI data=", dataKPI);
    console.log("final dataHospital data=", dataHospital);
    console.log("final dataGoalMetrix data=", dataGoalMetrix);

    const groupedSystemGoal = groupBySystemGoalId(dataGoalMetrix || []);
    const groupedGoal = groupByGoalId(groupedSystemGoal || []);
    const groupedSubGoal = groupBySubGoalId(groupedGoal || []);
    const groupedData = groupBySubGoalId(dataGoalMetrix || []);

    console.log("final groupedSystemGoal=", groupedSystemGoal);
    console.log("final groupedGoal=", groupedGoal);
    console.log("final groupedSubGoal=", groupedSubGoal);

    return (
      <section>
        <div>
          <div>
            {Object.keys(groupedData).map((subGoalId, index) => (
              <div key={index} className="subgoal-container">
                <h3>Sub Goal ID: {subGoalId}</h3>
                <h3>Sub Goal ID: {}</h3>
                {groupedData[subGoalId].map(
                  (
                    metrix: {
                      SystemGoalId: any;
                      SubGoalId: any;
                      KPIId: any;
                      GoalId: any;
                      HospitalId: any;
                      Actual: any;
                      Target: any;
                    },
                    subIndex: React.Key | null | undefined
                  ) => (
                    <div key={subIndex} className="goal-item">
                      <div>{this.getSystemGoalTitle(metrix.SystemGoalId)}</div>

                      <p>Goal ID: {this.getGoalTitle(metrix.GoalId)}</p>
                      <p>
                        SubGoalId ID: {this.getSubGoalTitle(metrix.SubGoalId)}
                      </p>

                      <p>KPIId ID: {this.getKPITitle(metrix.KPIId)}</p>

                      <p>
                        Hospital Title:{" "}
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
        </div>
      </section>
    );
  }
}
