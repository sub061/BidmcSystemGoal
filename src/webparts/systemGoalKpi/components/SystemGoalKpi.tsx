import * as React from "react";
import styles from "./SystemGoalKpi.module.scss";

import type {
  IDivision,
  IGoal,
  IGoalMetrix,
  IHospital,
  IKPI,
  ISubGoal,
  ISystemGoal,
  ISystemGoalKpiProps,
  ISystemGoalProps,
  IOperatingModel,
} from "./ISystemGoalKpiProps";
// import * as React from "react";

export interface ISystemGoalKpiWpState {
  dataOperatingModel: IOperatingModel[] | null;
  dataGoalMetrix: IGoalMetrix[] | null;
  dataDivision: IDivision[] | null;
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
      dataOperatingModel: props.getOperatingModel || null,
      dataGoalMetrix: props.getGoalMetrix || null, // Initialize state with the passed prop or null
      dataDivision: props.getDivision || null, // Initialize state with the passed prop or null
      dataHospital: props.getHospital || null, // Initialize state with the passed prop or null
      dataKPI: props.getKPI || null, // Initialize state with the passed prop or null
      dataSubGoal: props.getSubGoal || null, // Initialize state with the passed prop or null
      dataGoal: props.getGoal || null, // Initialize state with the passed prop or null
      dataSystemGoal: props.getSystemGoal || null, // Initialize state with the passed prop or null
    };
    console.log("tsx file constructor");
  }

  // Get Main System Goal
  private getSystemGoalTitle = (organizationId: number) => {
    const { dataSystemGoal } = this.state;
    if (!dataSystemGoal) return "Unknown System Goal"; // Check if dataSystemGoal is null
    const systemGoal = dataSystemGoal.find(
      (systemGoal) => systemGoal.Id === organizationId
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

  // Get KPI
  private getOperatingModel = (Id: number) => {
    const { dataOperatingModel } = this.state;
    if (!dataOperatingModel) return "Unknown KPI"; // Check if dataKPI is null
    const OperatingModel = dataOperatingModel.find(
      (OperatingModel) => OperatingModel.Id === Id
    );
    return OperatingModel ? OperatingModel.Title : "Unknown Operating Model";
  };
  // get Division
  private getDivisionTitle = (divisionId: number) => {
    const { dataDivision } = this.state;
    if (!dataDivision) return "Unknown Division"; // Check if dataHospital is null
    const division = dataDivision.find(
      (division) => division.Id === divisionId
    );
    return division ? division.Title : "Unknown Hospital";
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

  // Group data by OperatingModel
  private groupOperatingModel = (data: IOperatingModel[]) => {
    const groupOperatingModel: any = {};

    data.forEach((item) => {
      if (!groupOperatingModel[item.Id]) {
        groupOperatingModel[item.Id] = {};
      }
      // groupOperatingModel[item.Id].push(item);
    });

    return groupOperatingModel;
  };

  // Group data by divisionId, then HospitalId
  private groupDivisionData = (data: IHospital[]) => {
    const groupDivisionData: any = {};

    data.forEach((item) => {
      if (!groupDivisionData[item.OrganizationId]) {
        groupDivisionData[item.OrganizationId] = {};
      }
      if (!groupDivisionData[item.OrganizationId][item.DivisionId]) {
        groupDivisionData[item.OrganizationId][item.DivisionId] = {};
      }
      if (!groupDivisionData[item.OrganizationId][item.DivisionId][item.Id]) {
        groupDivisionData[item.OrganizationId][item.DivisionId][item.Id] = [];
      }
      groupDivisionData[item.OrganizationId][item.DivisionId][item.Id].push(
        item
      );
    });

    return groupDivisionData;
  };

  // Group data by organizationId, then GoalId, then SubGoalId, and finally by KPIId
  private groupData = (data: IGoalMetrix[]) => {
    const groupedData: any = {};

    data.forEach((item) => {
      if (!groupedData[item.OrganizationId]) {
        groupedData[item.OrganizationId] = {};
      }
      if (!groupedData[item.OrganizationId][item.GoalId]) {
        groupedData[item.OrganizationId][item.GoalId] = {};
      }
      if (!groupedData[item.OrganizationId][item.GoalId][item.SubGoalId]) {
        groupedData[item.OrganizationId][item.GoalId][item.SubGoalId] = {};
      }
      if (
        !groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
          item.KPIId
        ]
      ) {
        groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
          item.KPIId
        ] = [];
      }
      groupedData[item.OrganizationId][item.GoalId][item.SubGoalId][
        item.KPIId
      ].push(item);
    });

    return groupedData;
  };

  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const {
      dataGoalMetrix,
      dataHospital,
      dataOperatingModel,
      // dataKPI,
      // dataSubGoal,
      // dataGoal,
      // dataSystemGoal,
    } = this.state;

    const groupedOperatingModel = this.groupOperatingModel(
      dataOperatingModel || []
    );
    const groupedData = this.groupData(dataGoalMetrix || []);

    const groupedDivisionData = this.groupDivisionData(dataHospital || []);
    console.log("final groupedDivisionData dataHospital=", dataHospital);
    console.log("final groupedData=", groupedData);

    console.log("final groupedDivisionData=", groupedDivisionData);
    console.log("final Operating Model=", dataOperatingModel);

    return (
      <section>
        {Object.keys(groupedOperatingModel).map((Id) => (
          <>
            <span>{this.getOperatingModel(Number(Id))}</span>
            <div>
              <div className="btn_container">
                <div>
                  {Object.keys(groupedDivisionData).map((organizationId) => (
                    <>
                      <div className="cat  action">
                        <label>
                          <input type="checkbox" value="1" />
                          <span>
                            {this.getSystemGoalTitle(Number(organizationId))}
                          </span>
                        </label>
                      </div>

                      <div className="multi_btn_group">
                        {Object.keys(groupedDivisionData[organizationId]).map(
                          (divisionId) => (
                            <div className="inner_btn_group">
                              <div key={divisionId} className="cat action">
                                <label>
                                  <input type="checkbox" value="1" />
                                  <span>
                                    {" "}
                                    {this.getDivisionTitle(Number(divisionId))}
                                  </span>
                                </label>
                              </div>

                              <div className="btn_group">
                                {Object.keys(
                                  groupedDivisionData[organizationId][
                                    divisionId
                                  ]
                                ).map((hospitalId) => (
                                  <div className="cat action">
                                    <label key={hospitalId}>
                                      <input type="checkbox" value="1" />
                                      <span>
                                        {this.getHospitalTitle(
                                          Number(hospitalId)
                                        )}
                                      </span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>

              <div>
                {Object.keys(groupedData).map((organizationId) => (
                  <div key={organizationId} className="system_goel_container">
                    {Object.keys(groupedData[organizationId]).map((goalId) => (
                      <div key={goalId} className="box_model">
                        <div className="header">
                          {this.getGoalTitle(Number(goalId))}
                        </div>
                        <div>
                          <div>
                            {Object.keys(
                              groupedData[organizationId][goalId]
                            ).map((subGoalId) => (
                              <div key={subGoalId} className="inner_container">
                                <div className="inner_header">
                                  {this.getSubGoalTitle(Number(subGoalId))}
                                </div>

                                {Object.keys(
                                  groupedData[organizationId][goalId][subGoalId]
                                ).map((kpiId) => (
                                  <table>
                                    <thead>
                                      <th key={kpiId}>
                                        {this.getKPITitle(Number(kpiId))}
                                      </th>
                                      <th>Actual</th>
                                      <th>Target</th>
                                      <th>&nbsp;</th>
                                      <th>Details</th>
                                    </thead>
                                    <tbody>
                                      <div>
                                        {groupedData[organizationId][goalId][
                                          subGoalId
                                        ][kpiId].map(
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
                                            subIndex:
                                              | React.Key
                                              | null
                                              | undefined
                                          ) => (
                                            <tr key={subIndex}>
                                              <td>
                                                <button>
                                                  {" "}
                                                  {this.getHospitalTitle(
                                                    metrix.HospitalId
                                                  )}
                                                </button>
                                              </td>
                                              <td>{metrix.Actual}</td>
                                              <td>{metrix.Target}</td>

                                              <td>
                                                <span className="success"></span>
                                              </td>
                                              <td>
                                                <button className="details">
                                                  Click
                                                </button>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </div>
                                    </tbody>
                                  </table>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ))}
        <div className={styles.dummy}></div>
      </section>
    );
  }
}
