import * as React from "react";
import styles from "./SystemGoalKpi.module.scss";

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

  // get Hospital
  private getHospitalTitle = (hospitalId: number) => {
    const { dataHospital } = this.state;
    if (!dataHospital) return "Unknown Hospital"; // Check if dataHospital is null
    const hospital = dataHospital.find(
      (hospital) => hospital.Id === hospitalId
    );
    return hospital ? hospital.Title : "Unknown Hospital";
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
          {Object.keys(groupedData).map((organizationId) => (
            <div key={organizationId} className="systemgoal-container">
              <h3>
                System Goal: {this.getSystemGoalTitle(Number(organizationId))}
              </h3>
              {Object.keys(groupedData[organizationId]).map((goalId) => (
                <div key={goalId} className="goal-container">
                  <h4>Goal: {this.getGoalTitle(Number(goalId))}</h4>
                  {Object.keys(groupedData[organizationId][goalId]).map(
                    (subGoalId) => (
                      <div key={subGoalId} className="subgoal-container">
                        <h5>
                          Sub Goal: {this.getSubGoalTitle(Number(subGoalId))}
                        </h5>
                        {Object.keys(
                          groupedData[organizationId][goalId][subGoalId]
                        ).map((kpiId) => (
                          <div key={kpiId} className="kpi-container">
                            <h6>KPI: {this.getKPITitle(Number(kpiId))}</h6>
                            {groupedData[organizationId][goalId][subGoalId][
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
        <div className={styles.dummy}></div>

        <div className="btn_container">
          <h3>System goals 2025</h3>
          <div>
            <div className="cat  action">
              <label>
                <input type="checkbox" value="1" />
                <span>BILH</span>
              </label>
            </div>

            
          </div>
          <div className="multi_btn_group">
            <div className="inner_btn_group">
              <div className="cat action">
                <label>
                  <input type="checkbox" value="1" />
                  <span>Metro Boston Division</span>
                </label>
              </div>
              <div className="btn_group">
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>BIDMC</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Joslin</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>MAH</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>NEBH</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="inner_btn_group">
              <div className="cat action">
                <label>
                  <input type="checkbox" value="1" />
                  <span>Community Division</span>
                </label>
              </div>
              <div className="btn_group">
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>AJH</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Exeter</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>BIDM</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>BIDN</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>NE</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>BIDP</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>WH</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="inner_btn_group">
              <div className="cat action">
                <label>
                  <input type="checkbox" value="1" />
                  <span>LHMC Division</span>
                </label>
              </div>
              <div className="btn_group">
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>LHMC</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="inner_btn_group">
              <div className="cat action">
                <label>
                  <input type="checkbox" value="1" />
                  <span>Diversified Services</span>
                </label>
              </div>
              <div className="btn_group">
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Behavioral Health</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Continuing Care</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Primary Care</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Performance Network</span>
                  </label>
                </div>
                <div className="cat action">
                  <label>
                    <input type="checkbox" value="1" />
                    <span>Pharmacy</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="system_goel_container">
          <div className="box_model">
            <div className="header">People</div>
            <div className="inner_container">
              <div className="inner_header">
                Retention, recruitment, development
              </div>
              <table>
                <thead>
                  <th>Nursing turnover rate (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>80%</td>
                    <td>70%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>78%</td>
                    <td>61%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>67%</td>
                    <td>60%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 2nd table */}
              <table>
                <thead>
                  <th>Allied health turnover (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>93%</td>
                    <td>81%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>88%</td>
                    <td>72%</td>

                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>76%</td>
                    <td>55%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2nd box */}
          <div className="box_model">
            <div className="header">Quality & Experience</div>
            <div className="inner_container">
              <div className="inner_header">Throughput and Access</div>
              <table>
                <thead>
                  <th>Nursing turnover rate (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>80%</td>
                    <td>70%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>78%</td>
                    <td>61%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>67%</td>
                    <td>60%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 2nd table */}
              <table>
                <thead>
                  <th>Allied health turnover (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>93%</td>
                    <td>81%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>88%</td>
                    <td>72%</td>

                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>76%</td>
                    <td>55%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 3rd table */}
              <table>
                <thead>
                  <th>Net hiring (critical areas)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>580</td>
                    <td>430</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3rd box */}
          <div className="box_model">
            <div className="header">Overall</div>
            <div className="inner_container">
              <div className="inner_header">
                Retention, recruitment and development
              </div>
              <table>
                <thead>
                  <th>Nursing turnover rate (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>80%</td>
                    <td>70%</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>78%</td>
                    <td>61%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>67%</td>
                    <td>60%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 2nd table */}
              <table>
                <thead>
                  <th>Allied health turnover (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>93%</td>
                    <td>81%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>88%</td>
                    <td>72%</td>

                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>76%</td>
                    <td>55%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 3rd table */}
              <table>
                <thead>
                  <th>Net hiring (critical areas)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>580</td>
                    <td>430</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4th box */}
          <div className="box_model">
            <div className="header">Quality & Experience</div>
            <div className="inner_container">
              <div className="inner_header">Strategy</div>
              <table>
                <thead>
                  <th>Nursing turnover rate (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>80%</td>
                    <td>70%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>78%</td>
                    <td>61%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>67%</td>
                    <td>60%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 2nd table */}
              <table>
                <thead>
                  <th>Allied health turnover (w/in 1 yr.)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>93%</td>
                    <td>81%</td>

                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details disabled">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>88%</td>
                    <td>72%</td>

                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>76%</td>
                    <td>55%</td>

                    <td>
                      <span className="error"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* 3rd table */}
              <table>
                <thead>
                  <th>Net hiring (critical areas)</th>
                  <th>Actual</th>
                  <th>Target</th>
                  <th>&nbsp;</th>
                  <th>Details</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button>BIDMC</button>
                    </td>
                    <td>580</td>
                    <td>430</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>AJH</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="warning"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button>BIDN</button>
                    </td>
                    <td>300</td>
                    <td>270</td>
                    <td>
                      <span className="success"></span>
                    </td>
                    <td>
                      <button className="details">Click</button>
                    </td>
                  </tr>
                </tbody>
              </table>


            </div>
          </div>


          
        </div>
      </section>
    );
  }
}
