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
//import { useState } from "react";
// import { useState } from "react";
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
  checkedSystemGoals: { [key: string]: boolean }; // Track checkbox state
  selectedDivisions: Set<number>;
  selectedOrganizations: Set<number>; // Add this line
  // Add other properties here
  groupedDivisionData: any; // Ensure this matches your actual data type
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
      checkedSystemGoals: {
        People: true,
        ["Quality&Experience"]: true,
        FinanceandOperations: true,
        Strategy: true,
      },
      selectedDivisions: new Set(),
      selectedOrganizations: new Set(), // Initialize this
      groupedDivisionData: {}, // Ensure this matches your actual data type
    };
    // console.log("tsx file constructor");
  }

  private handleHospitalCheckboxChange = (hospitalId: number) => {
    this.setState((prevState) => {
      const selectedHospitals = new Set(prevState.selectedHospitals);
      // console.log("selectedHospitals", selectedHospitals);
      if (selectedHospitals.has(hospitalId)) {
        selectedHospitals.delete(hospitalId);
      } else {
        selectedHospitals.add(hospitalId);
        // console.log("selectedHospitals", selectedHospitals);
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

  private handleDivisionCheckboxChange = (
    divisionId: number,
    organizationId: number
  ) => {
    this.setState((prevState) => {
      const selectedHospitals = new Set(prevState.selectedHospitals);
      const divisionHospitals = Object.keys(
        prevState.dataHospital || {}
      ).filter((hospitalId) =>
        prevState.dataHospital?.find(
          (hospital) =>
            hospital.Id === Number(hospitalId) &&
            hospital.DivisionId === divisionId &&
            hospital.OrganizationId === organizationId
        )
      );

      // Log the length of the filtered hospitals

      // Get the next hospital ID after the filtered list
      const nextHospitalIdIndex = divisionHospitals.length;
      const nextHospital = prevState.dataHospital?.[nextHospitalIdIndex];

      if (nextHospital) {
        // console.log("Next Hospital ID after filtered list: ", nextHospital.Id);
      } else {
        // console.log("No additional hospitals after the filtered list.");
      }

      if (
        divisionHospitals.every((hospitalId) =>
          selectedHospitals.has(Number(hospitalId))
        )
      ) {
        divisionHospitals.forEach((hospitalId) =>
          selectedHospitals.delete(Number(hospitalId))
        );
      } else {
        divisionHospitals.forEach((hospitalId) =>
          selectedHospitals.add(Number(hospitalId))
        );
      }

      // console.log("selectedHospitals------", selectedHospitals);
      return { selectedHospitals };
    });
  };

  handleOrganizationCheckboxChange = (organizationId: number) => {
    const { groupedDivisionData, selectedOrganizations } = this.state;
    const isChecked = !selectedOrganizations.has(organizationId);

    this.setState((prevState) => {
      const updatedSelectedHospitals = new Set(prevState.selectedHospitals);

      // Update divisions
      Object.keys(groupedDivisionData[organizationId] || {}).forEach(
        (divisionId) => {
          const isDivisionChecked = isChecked;
          if (isDivisionChecked) {
            Object.keys(
              groupedDivisionData[organizationId][divisionId] || {}
            ).forEach((hospitalId) => {
              updatedSelectedHospitals.add(Number(hospitalId));
            });
          } else {
            Object.keys(
              groupedDivisionData[organizationId][divisionId] || {}
            ).forEach((hospitalId) => {
              updatedSelectedHospitals.delete(Number(hospitalId));
            });
          }
        }
      );

      return {
        selectedHospitals: updatedSelectedHospitals,
        selectedOrganizations: new Set(
          isChecked
            ? [...prevState.selectedOrganizations, organizationId]
            : [...prevState.selectedOrganizations].filter(
                (id) => id !== organizationId
              )
        ),
      };
    });
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
      // console.log("gfhfghfg", item);
    });

    // Sort the divisions and hospitals within each organization
    Object.keys(groupDivisionData).forEach((organizationId) => {
      const divisions = groupDivisionData[organizationId];
      const sortedDivisionIds = Object.keys(divisions).sort((a, b) => {
        return this.getDivisionTitle(Number(a)).localeCompare(
          this.getDivisionTitle(Number(b))
        );
      });

      sortedDivisionIds.forEach((divisionId) => {
        const hospitals = divisions[divisionId];
        const sortedHospitalIds = Object.keys(hospitals).sort((a, b) => {
          return this.getHospitalTitle(Number(a)).localeCompare(
            this.getHospitalTitle(Number(b))
          );
        });

        // Reassign sorted hospitals
        const sortedHospitals: any = {};
        sortedHospitalIds.forEach((hospitalId) => {
          sortedHospitals[hospitalId] = hospitals[hospitalId];
        });

        divisions[divisionId] = sortedHospitals;
      });

      // Reassign sorted divisions
      const sortedDivisions: any = {};
      sortedDivisionIds.forEach((divisionId) => {
        sortedDivisions[divisionId] = divisions[divisionId];
      });

      groupDivisionData[organizationId] = sortedDivisions;
    });

    return groupDivisionData;
  };

  private handleSystemGoalCheckboxChange = (goal: string) => {
    this.setState((prevState) => ({
      checkedSystemGoals: {
        ...prevState.checkedSystemGoals,
        [goal]: !prevState.checkedSystemGoals[goal],
      },
    }));
  };

  // Group data by organizationId, then GoalId, then SubGoalId, and finally by KPIId
  private groupData = (data: IGoalMetrix[]) => {
    // console.log("AAAAAAAAAAAAAAAAA", JSON.stringify(data));
    // const obj: { [key: number]: any } = {};
    // const newData = data.reduce((acc, item) => {
    //   const divisionId = item.DivisionId;
    //   if (!acc[divisionId]) {
    //     acc[divisionId] = [];
    //   }
    //   acc[divisionId].push(item);
    //   return acc;
    // }, obj);

    // console.log("new Data", newData);

    const groupedData: any = {};
    data.map((item: IGoalMetrix) => {
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

    // console.log("Ganesh", groupedData);

    // Sort the KPIs within each sub-goal, goal, and organization
    Object.keys(groupedData).forEach((organizationId) => {
      Object.keys(groupedData[organizationId]).forEach((goalId) => {
        Object.keys(groupedData[organizationId][goalId]).forEach(
          (subGoalId) => {
            groupedData[organizationId][goalId][subGoalId] = Object.keys(
              groupedData[organizationId][goalId][subGoalId]
            )
              .sort((a, b) => {
                return this.getKPITitle(Number(a)).localeCompare(
                  this.getKPITitle(Number(b))
                );
              })
              .reduce((sortedKPIs: any, kpiId) => {
                sortedKPIs[kpiId] =
                  groupedData[organizationId][goalId][subGoalId][kpiId];
                return sortedKPIs;
              }, {});
          }
        );
      });
    });

    // console.log("groupedData groupedData", groupedData);
    return groupedData;
  };

  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const {
      dataGoalMetrix,
      dataHospital,
      dataOperatingModel,
      selectedHospitals,
      checkedSystemGoals,
    } = this.state;

    // Example class names to be added
    const divClassMap: { [key: string]: string } = {
      People: "d-none",
      ["Quality&Experience"]: "d-none",
      FinanceandOperations: "d-none",
      Strategy: "d-none",
    };

    const groupedOperatingModel = this.groupOperatingModel(
      dataOperatingModel || []
    );
    const groupedData = this.groupData(dataGoalMetrix || []);
    const groupedDivisionData = this.groupDivisionData(dataHospital || []);

    // console.log("final groupedDivisionData dataHospital=", dataHospital);
    // console.log("final groupedData=", groupedData);
    // console.log("final groupedDivisionData=", groupedDivisionData);
    // console.log("final Operating Model=", dataOperatingModel);
    // console.log("title", this.props.title);
    // console.log("checkedSystemGoals", checkedSystemGoals);

    // const ToggleDivs = () => {
    //   const [visibleDivs, setVisibleDivs] = useState({
    //     People: true,
    //     Quality: true,
    //     Finance: true,
    //     Strategy: true,
    //   });

    //   const handleCheckboxChange = (event: { target: { id: any; checked: any; }; }) => {
    //     const { id, checked } = event.target;
    //     setVisibleDivs((prevVisibleDivs) => ({
    //       ...prevVisibleDivs,
    //       [id]: checked,
    //     }));
    //   };

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
                            <input
                              type="checkbox"
                              value={organizationId}
                              onChange={() =>
                                this.handleOrganizationCheckboxChange(
                                  Number(organizationId)
                                )
                              }
                              checked={Object.keys(
                                groupedDivisionData[organizationId]
                              ).every((divisionId) =>
                                Object.keys(
                                  groupedDivisionData[organizationId][
                                    divisionId
                                  ]
                                ).every((hospitalId) =>
                                  this.state.selectedHospitals.has(
                                    Number(hospitalId)
                                  )
                                )
                              )}
                            />
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
                                checked={checkedSystemGoals["People"]}
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange("People")
                                }
                              />
                              <label className="dropdown-item" htmlFor="People">
                                People
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                name="Quality&Experience"
                                className="form-check-input"
                                id="Quality&Experience"
                                checked={
                                  checkedSystemGoals["Quality&Experience"]
                                }
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "Quality&Experience"
                                  )
                                }
                              />
                              <label
                                htmlFor="Quality&Experience"
                                className="dropdown-item"
                              >
                                Quality & Experience
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="FinanceandOperations"
                                checked={
                                  checkedSystemGoals["FinanceandOperations"]
                                }
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "FinanceandOperations"
                                  )
                                }
                              />
                              <label
                                htmlFor="FinanceandOperations"
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
                                checked={checkedSystemGoals["Strategy"]}
                                onChange={() =>
                                  this.handleSystemGoalCheckboxChange(
                                    "Strategy"
                                  )
                                }
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
                                      this.handleDivisionCheckboxChange(
                                        Number(divisionId),
                                        Number(organizationId)
                                      )
                                    }
                                    checked={Object.keys(
                                      groupedDivisionData[organizationId][
                                        divisionId
                                      ]
                                    ).every((hospitalId) =>
                                      this.state.selectedHospitals.has(
                                        Number(hospitalId)
                                      )
                                    )}
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
                                        checked={this.state.selectedHospitals.has(
                                          Number(hospitalId)
                                        )}
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
                      <div
                        id={
                          this.getGoalTitle(Number(goalId)).replace(
                            /\s+/g,
                            ""
                          ) + "Div"
                        }
                        key={goalId}
                        className={`box_model ${
                          Object.keys(checkedSystemGoals).some(
                            (goal) =>
                              !checkedSystemGoals[goal] &&
                              divClassMap[goal] &&
                              this.getGoalTitle(Number(goalId)).includes(goal)
                          )
                            ? divClassMap[
                                Object.keys(checkedSystemGoals).find(
                                  (goal) =>
                                    !checkedSystemGoals[goal] &&
                                    this.getGoalTitle(Number(goalId)).includes(
                                      goal
                                    )
                                ) || ""
                              ]
                            : ""
                        }`}
                      >
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
                                        <th
                                          colSpan={5}
                                          className="kpi_name_title"
                                        >
                                          {this.getKPITitle(Number(kpiId))}
                                        </th>
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
                                          (metrix: {
                                            HospitalId: number;
                                            DivisionId: number;
                                          }) =>
                                            selectedHospitals.size === 0 ||
                                            selectedHospitals.has(
                                              metrix.HospitalId
                                            )
                                        )
                                        // .sort(
                                        //   (
                                        //     a: {
                                        //       DivisionId: number;
                                        //       HospitalId: number;
                                        //       OrganizationId: number;
                                        //     },
                                        //     b: {
                                        //       DivisionId: number;
                                        //       HospitalId: number;
                                        //       OrganizationId: number;
                                        //     }
                                        //   ) => {
                                        //     // First sort by DivisionId in ascending order
                                        //     if (a.DivisionId !== b.DivisionId) {
                                        //       return (
                                        //         a.DivisionId - b.DivisionId
                                        //       );
                                        //     }

                                        //     // Then sort by Hospital Name in ascending order
                                        //     const hospitalNameA =
                                        //       this.getHospitalTitle(
                                        //         a.HospitalId
                                        //       );
                                        //     const hospitalNameB =
                                        //       this.getHospitalTitle(
                                        //         b.HospitalId
                                        //       );
                                        //     return hospitalNameA.localeCompare(
                                        //       hospitalNameB
                                        //     );
                                        //   }
                                        // )
                                        // .reduce(
                                        //   (
                                        //     acc: {
                                        //       organizationData: any[];
                                        //       otherData: any[];
                                        //     },
                                        //     metrix: { OrganizationId: number }
                                        //   ) => {
                                        //     // Split the data into two groups based on OrganizationId
                                        //     if (
                                        //       metrix.OrganizationId ===
                                        //       Number(organizationId)
                                        //     ) {
                                        //       acc.organizationData.push(metrix);
                                        //     } else {
                                        //       acc.otherData.push(metrix);
                                        //     }
                                        //     return acc;
                                        //   },
                                        //   {
                                        //     otherData: [],
                                        //     organizationData: [],
                                        //   }
                                        // ) // Initial value for acc
                                        // .otherData.concat(
                                        //   groupedData[organizationId][goalId][
                                        //     subGoalId
                                        //   ][kpiId].reduce(
                                        //     (
                                        //       acc: { organizationData: any[] },
                                        //       metrix: any
                                        //     ) => {
                                        //       acc.organizationData.push(metrix);
                                        //       return acc;
                                        //     },
                                        //     {
                                        //       organizationData: [],
                                        //     }
                                        //   ).organizationData
                                        // )
                                        .map(
                                          (
                                            metrix: {
                                              HospitalId: number;
                                              DivisionId: number;
                                              OrganizationId: number;
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
                                              ActualVerified:
                                                | boolean
                                                | React.ReactChild
                                                | React.ReactFragment
                                                | React.ReactPortal
                                                | null
                                                | undefined;
                                              TargetVerified:
                                                | boolean
                                                | React.ReactChild
                                                | React.ReactFragment
                                                | React.ReactPortal
                                                | null
                                                | undefined;
                                              ActualVerify:
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
                                              <td
                                                className={
                                                  metrix.ActualVerified == " "
                                                    ? "change_status"
                                                    : ""
                                                }
                                              >
                                                {metrix.Actual}
                                              </td>
                                              <td
                                                className={
                                                  metrix.TargetVerified == null
                                                    ? "change_status"
                                                    : ""
                                                }
                                              >
                                                {metrix.Target}
                                              </td>
                                              <td>
                                                <span className="success">
                                                  {metrix.ActualVerify}
                                                </span>
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
