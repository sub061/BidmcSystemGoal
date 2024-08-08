import * as React from "react";
import styles from "./SystemGoalKpi.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.min.js";

import type {
  // IDivision,
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
  title: string;
  dataOperatingModel: IOperatingModel[] | null;
  dataGoalMetrix: IGoalMetrix[] | null;
  dataDivision: IHospital[] | null;
  dataHospital: IHospital[] | null;
  dataKPI: IKPI[] | null;
  dataSubGoal: ISubGoal[] | null;
  dataGoal: IGoal[] | null;
  dataSystemGoal: ISystemGoal[] | null;
  selectedHospitals: Set<number>;
  dataAllHospital: IHospital[] | null;
}

export default class SystemGoalKpi extends React.Component<
  ISystemGoalProps,
  ISystemGoalKpiWpState
> {
  public constructor(props: ISystemGoalKpiProps) {
    super(props);
    this.state = {
      title: props.title,
      dataAllHospital: props.getAllHospital || null,
      dataOperatingModel: props.getOperatingModel || null,
      dataGoalMetrix: props.getGoalMetrix || null, // Initialize state with the passed prop or null
      dataDivision: props.getDivision || null, // Initialize state with the passed prop or null
      dataHospital: props.getHospital || null, // Initialize state with the passed prop or null
      dataKPI: props.getKPI || null, // Initialize state with the passed prop or null
      dataSubGoal: props.getSubGoal || null, // Initialize state with the passed prop or null
      dataGoal: props.getGoal || null, // Initialize state with the passed prop or null
      dataSystemGoal: props.getSystemGoal || null, // Initialize state with the passed prop or null
      selectedHospitals: new Set(),
    };
    console.log("tsx file constructor");
  }

  private handleHospitalCheckboxChange = (hospitalId: number) => {
    this.setState((prevState) => {
      const selectedHospitals = new Set(prevState.selectedHospitals);
      console.log("selectedHospitals", selectedHospitals);
      if (selectedHospitals.has(hospitalId)) {
        selectedHospitals.delete(hospitalId);
      } else {
        selectedHospitals.add(hospitalId);
        console.log("selectedHospitals", selectedHospitals);
      }
      return { selectedHospitals };
    });
  };

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
  //dataAllHospital;
  private getHospitalTitle = (hospitalId: number) => {
    const { dataAllHospital } = this.state;
    if (!dataAllHospital) return "Unknown Hospital"; // Check if dataHospital is null
    const hospital = dataAllHospital.find(
      (hospital) => hospital.Id === hospitalId
    );
    return hospital ? hospital.Title : "Unknown Hospital";
  };
  // private getHospitalTitle = (hospitalId: number) => {
  //   const { dataHospital } = this.state;
  //   if (!dataHospital) return "Unknown Hospital"; // Check if dataHospital is null
  //   const hospital = dataHospital.find(
  //     (hospital) => hospital.Id === hospitalId
  //   );
  //   return hospital ? hospital.Title : "Unknown Hospital";
  // };

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
      selectedHospitals,
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
    console.log("title", this.props.title);

    return (
      <section>
        <div
          style={{
            width: "100%",
            fontSize: "36px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          {this.props.title}
        </div>

        {Object.keys(groupedOperatingModel).map((Id) => (
          <>
            <div>
              <div className="btn_container">
                <h3>
                  <span>{this.getOperatingModel(Number(Id))} </span>
                </h3>
                <div>
                  {Object.keys(groupedDivisionData).map((organizationId) => (
                    <>
                      <div className="with_goal_filter">
                        <div className="cat action primary">
                          <label>
                            <input type="checkbox" value="1" />
                            <span>
                              {this.getSystemGoalTitle(Number(organizationId))}{" "}
                            </span>
                          </label>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fas fa-filter"></i>
                            <span
                              style={{
                                flex: "1",
                                textAlign: "left",
                                position: "relative",
                                top: "-1px",
                              }}
                            >
                              {" "}
                              System Goal
                            </span>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <input
                                type="checkbox"
                                name="People"
                                className="form-check-input"
                                id="People"
                                defaultChecked
                              />
                              <label className="dropdown-item" htmlFor="People">
                                People
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                name="Quality"
                                className="form-check-input"
                                id="Quality"
                                defaultChecked
                              />
                              <label
                                htmlFor="Quality"
                                className="dropdown-item"
                              >
                                Quality and Experience
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="Finance"
                                defaultChecked
                              />
                              <label
                                htmlFor="Finance"
                                className="dropdown-item"
                              >
                                Finance and Operations
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="Strategy"
                                defaultChecked
                              />
                              <label
                                htmlFor="Strategy"
                                className="dropdown-item"
                              >
                                Strategy
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="multi_btn_group">
                        {Object.keys(groupedDivisionData[organizationId]).map(
                          (divisionId) => (
                            <div className="inner_btn_group">
                              <div
                                key={divisionId}
                                className="cat action secondary"
                              >
                                <label>
                                  <input
                                    type="checkbox"
                                    value={divisionId}
                                    onChange={() =>
                                      this.handleHospitalCheckboxChange(
                                        Number(divisionId)
                                      )
                                    }
                                  />
                                  <span>
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
                                      <input
                                        type="checkbox"
                                        value={hospitalId}
                                        onChange={() =>
                                          this.handleHospitalCheckboxChange(
                                            Number(hospitalId)
                                          )
                                        }
                                      />
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
                                  <table key={kpiId}>
                                    <thead>
                                      <tr>
                                        <th colSpan={5} className="kpi_name_title">{this.getKPITitle(Number(kpiId))}</th>
                                      </tr>
                                      <tr>
                                      <th>&nbsp;</th>
                                        <th>Actual</th>
                                        <th>Target</th>
                                        <th>&nbsp;</th>
                                        <th>Details</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {groupedData[organizationId][goalId][
                                        subGoalId
                                      ][kpiId]
                                        .filter(
                                          (metrix: { HospitalId: number }) =>
                                            selectedHospitals.size === 0 ||
                                            selectedHospitals.has(
                                              metrix.HospitalId
                                            )
                                        )
                                        .map(
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
