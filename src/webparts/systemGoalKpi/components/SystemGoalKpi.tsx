/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./SystemGoalKpi.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-tooltip/dist/react-tooltip.css';

import "bootstrap/dist/js/bootstrap.min.js";
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
  isChecked: boolean; // Add this line to define the isToggled state
  dataOperatingModel: IOperatingModel[] | null;
  dataGoalMetrix: IGoalMetrix[] | null;
  dataDivision: IHospital[] | null;
  dataHospital: IHospital[] | null;
  dataKPI: IKPI[] | null;
  dataSubGoal: ISubGoal[] | null;
  dataGoal: IGoal[] | null;
  dataSystemGoal: ISystemGoal[] | null;
  selectedHospitals: Set<number>;
  selectedHospitalsNew: Set<number>;
  dataAllHospital: IHospital[] | null;
  checkedSystemGoals: { [key: string]: boolean }; // Track checkbox state
  checkedSystemGoalsNew: Set<number>;
  selectedDivisions: Set<number>;
  selectedOrganizations: Set<number>; // Add this line
  // Add other properties here
  groupedDivisionData: any; // Ensure this matches your actual data type
  pdfDivisionIDs: Set<number>;
}

export default class SystemGoalKpi extends React.Component<
  ISystemGoalProps,
  ISystemGoalKpiWpState
> {
  public constructor(props: ISystemGoalKpiProps) {
    super(props);
    this.state = {
      title: props.title,
      isChecked: false, // State to track if the class is toggled
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
      selectedHospitalsNew: new Set([1, 2, 3, 4]),
      checkedSystemGoals: {
        People: true,
        ["Quality&Experience"]: true,
        FinanceandOperations: true,
        Strategy: true,
      },
      checkedSystemGoalsNew: new Set([1, 2, 3, 4]),
      selectedDivisions: new Set(),
      selectedOrganizations: new Set(), // Initialize this
      groupedDivisionData: {}, // Ensure this matches your actual data type
      pdfDivisionIDs: new Set([5]),
    };

    console.log(
      "tsx file constructor    hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
    );
  }

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

  // get Division
  // private getDivisionTitle = (divisionId: number) => {
  //   const { dataDivision } = this.state;
  //   if (!dataDivision) return "Unknown Division"; // Check if dataHospital is null
  //   const division = dataDivision.find(
  //     (division) => division.Id === divisionId
  //   );
  //   return division ? division.Title : "Unknown Hospital";
  // };

  /***
   * New Functions
   * @author Ganesh
   *
   *
   */

  // Handle Division checkbox changes for adding division in hopsitals
  divisionRequestChange = (id: number, e: any) => {
    this.setState((prev: any) => {
      let selectedDivsionIds: any = [...prev.pdfDivisionIDs];
      if (!e.target.checked) {
        if (selectedDivsionIds.includes(id)) {
          selectedDivsionIds = selectedDivsionIds.filter(
            (hospitalId: any) => hospitalId !== id
          );
        }
      } else {
        if (!selectedDivsionIds.includes(id)) {
          selectedDivsionIds.push(id);
        }
      }
      return { pdfDivisionIDs: selectedDivsionIds };
    });
  };

  private organizationRequestChange = (
    e: any,
    hirerachicalHospitalData: any
  ): void => {
    const { pdfDivisionIDs } = this.state;
    let updatedDivisionIds: any = [...pdfDivisionIDs];

    if (e.target.checked) {
      hirerachicalHospitalData.forEach((org: any) => {
        org.division.forEach((div: any) => {
          if (!updatedDivisionIds.includes(div.id)) {
            updatedDivisionIds.push(div.id);
          }
        });
      });
    } else {
      hirerachicalHospitalData.forEach((org: any) => {
        org.division.forEach((div: any) => {
          updatedDivisionIds = updatedDivisionIds.filter(
            (id: any) => id !== div.id
          );
        });
      });
    }
    this.setState({ pdfDivisionIDs: updatedDivisionIds });
  };

  private prepareHospitalHirerachy = (data: IHospital[]) => {
    const result: any = [];
    let organization = {
      name: data.filter(
        (org: any) => org.DivisionId == null && org.OrganizationId == null
      )[0].Title,
      id: data.filter(
        (org: any) => org.DivisionId == null && org.OrganizationId == null
      )[0].Id,
      division: new Array(),
    };

    let divisions = data.filter(
      (div: any) => div.DivisionId == null && div.OrganizationId != null
    );

    divisions.forEach((div: any) => {
      let _d = {
        name: div.Title,
        id: div.Id,
        hospitals: new Array(),
      };
      organization.division.push(_d);
    });

    let hospitals = data.filter(
      (h: any) => h.DivisionId != null && h.OrganizationId != null
    );

    hospitals.forEach((h: any) => {
      let _h = {
        title: h.Title,
        id: h.Id,
      };

      organization.division
        .find((d: any) => d.id == h.DivisionId)
        .hospitals.push(_h);
    });

    result.push(organization);

    return result;
  };

  private getGoalHirerachy = (data: IKPI[]) => {
    const result: any = [];
    data.forEach((kpi) => {
      // Find the goal in the result array
      let goal = result.find((g: any) => g.id === kpi.GoalId);

      // If the goal doesn't exist, create it
      if (!goal) {
        goal = {
          name: this.getGoalTitle(kpi.GoalId), // Adjust the goal name as needed
          id: kpi.GoalId,
          subGoal: [],
        };
        result.push(goal);
      }

      // Find the subGoal in the goal's subGoals array
      let subGoal = goal.subGoal.find((sg: any) => sg.id === kpi.SubGoalId);

      // If the subGoal doesn't exist, create it
      if (!subGoal) {
        subGoal = {
          name: this.getSubGoalTitle(kpi.SubGoalId), // Adjust the subGoal name as needed
          id: kpi.SubGoalId,
          kpi: [],
        };
        goal.subGoal.push(subGoal);
      }

      // Add the KPI to the subGoal
      subGoal.kpi.push({
        id: kpi.Id,
        title: kpi.Title,
        Sitelevel: kpi.Sitelevel,
      });
    });

    return result;
  };

  private handleHospitalChange = (hospitalId: number, hospital: any) => {
    console.log("Hospital Data ---->", hospital);

    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      if (updatedSelection.has(hospitalId)) {
        updatedSelection.delete(hospitalId);
      } else {
        updatedSelection.add(hospitalId);
      }
      return { isChecked: false, selectedHospitalsNew: updatedSelection };
    });
  };

  private handleDivisionChange = (
    divisionId: number,
    hirerachicalHospitalData: any
  ) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      const hospitalsToToggle: any[] = [];

      hirerachicalHospitalData.forEach((org: any) => {
        org.division.forEach((div: any) => {
          if (div.id === divisionId) {
            div.hospitals.forEach((hospital: any) => {
              hospitalsToToggle.push(hospital.id);
            });
          }
        });
      });

      console.log(updatedSelection, hospitalsToToggle);
      const allSelected = hospitalsToToggle.every((id) =>
        updatedSelection.has(id)
      );

      if (allSelected) {
        hospitalsToToggle.forEach((id) => updatedSelection.delete(id));
      } else {
        hospitalsToToggle.forEach((id) => updatedSelection.add(id));
      }

      return { isChecked: false, selectedHospitalsNew: updatedSelection };
    });
  };

  private handleOrganizationChange = (
    organizationId: number,
    hirerachicalHospitalData: any
  ) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.selectedHospitalsNew);
      const hospitalsToToggle: any[] = [];

      hirerachicalHospitalData.forEach((org: any) => {
        if (org.id === organizationId) {
          org.division.forEach((div: any) => {
            div.hospitals.forEach((hospital: any) => {
              hospitalsToToggle.push(hospital.id);
            });
          });
        }
      });

      const allSelected = hospitalsToToggle.every((id) =>
        updatedSelection.has(id)
      );

      if (allSelected) {
        hospitalsToToggle.forEach((id) => updatedSelection.delete(id));
      } else {
        hospitalsToToggle.forEach((id) => updatedSelection.add(id));
      }

      return { isChecked: false, selectedHospitalsNew: updatedSelection };
    });
  };

  private handleGoalChange = (goalId: number) => {
    this.setState((prevState) => {
      const updatedSelection = new Set(prevState.checkedSystemGoalsNew);
      if (updatedSelection.has(goalId)) {
        updatedSelection.delete(goalId);
      } else {
        updatedSelection.add(goalId);
      }
      return { checkedSystemGoalsNew: updatedSelection };
    });
  };

  private findMatrixValues = (
    subGoalId: number,
    kpiId: number,
    hospitalId: number,
    matrix: any,
    key: string
  ) => {
    const a = matrix.find(
      (item: any) =>
        item.KPIId === kpiId &&
        item.HospitalId === hospitalId &&
        item.SubGoalId === subGoalId
    );
    return a ? a[key] : null;
  };

  private getStatus = (
    subGoalId: number,
    kpiId: number,
    hospitalId: number,
    matrix: any,
    key: string
  ) => {
    // Find the item that matches all three criteria
    const a = matrix.find(
      (item: any) =>
        item.KPIId === kpiId &&
        item.HospitalId === hospitalId &&
        item.SubGoalId === subGoalId
    );
    if (a) {
      switch (a[key]) {
        case "G":
          return "success";
        case "Y":
          return "warning";
        case "R":
          return "error ";
        default:
          return " ";
      }
    }
    return "error";
  };

  handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    this.setState((prev: any) => {
      const updatedSelectedHospitals = !isChecked
        ? new Set([])
        : new Set([22]);
      const updatedSelectedDivsionId = !isChecked
        ? prev.pdfDivisionIDs
        : new Set([]);
      return {
        isChecked: isChecked,
        selectedHospitalsNew: updatedSelectedHospitals,
        pdfDivisionIDs: updatedSelectedDivsionId,
      };
    });
  };

  private generatePrintFuctionRequest = async () => {
    const { selectedHospitalsNew, pdfDivisionIDs, checkedSystemGoalsNew } = this.state;

    // Merge and deduplicate hospital IDs
    const mergedHospitalIds = Array.from(new Set([...selectedHospitalsNew, ...pdfDivisionIDs]));

    // Create the request object with "pillars" and "hospitals" arrays
    const req = {
      "pillars": Array.from(new Set([...checkedSystemGoalsNew])),
      "hospitals": mergedHospitalIds
    };

    console.log("Request HJHHHHHHHHHHHHHHHHHHHHHHH ---->", req);

    try {
      const response = await fetch("https://systemgoalapi.bilh.org/Print/api/report/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      });

      console.log("Response ---->", response);

      if (response.ok) {
        const pdfUrl = await response.text();
        console.log("PDF URL ---->", pdfUrl);
        window.open(pdfUrl, '_blank');
      } else {
        console.error("Failed to generate the report:", response.statusText);
      }
    } catch (e) {
      alert("Error Occurred: " + e);
      console.log("Error Occurred --->", e);
    }
  };


  public render(): React.ReactElement<ISystemGoalKpiProps> {
    const { isChecked } = this.state;
    const {
      dataGoalMetrix,
      selectedHospitalsNew,
      checkedSystemGoalsNew,
      dataAllHospital,
      dataKPI,
    } = this.state;

    const hirerachicalHospitalData = this.prepareHospitalHirerachy(
      dataAllHospital || []
    );
    const goalHirerachyData = this.getGoalHirerachy(dataKPI || []);
    console.log("Matixxxxxxxxxxxxxxxxxxxx", dataGoalMetrix);

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

        <div>
          <div className="btn_container">
            <h3>
              <span>System Goal 2025</span>
            </h3>
            <div>
              {hirerachicalHospitalData.map((organization: any) => (
                <>
                  <div className="with_goal_filter">
                    <div
                      className={`cat action primary ${isChecked ? "agg_active" : ""
                        }`}
                    >
                      <label
                        className={` ${organization.division.every((divison: any) =>
                          divison.hospitals.every((hospital: any) =>
                            selectedHospitalsNew.has(hospital.id)
                          )
                        )
                          ? "all_selected"
                          : ""
                          }`}
                      >
                        <input
                          type="checkbox"
                          value={organization.id}
                          checked={organization.division.every((divison: any) =>
                            divison.hospitals.every((hospital: any) =>
                              selectedHospitalsNew.has(hospital.id)
                            )
                          )}
                          onChange={(e) => {
                            this.handleOrganizationChange(
                              organization.id,
                              hirerachicalHospitalData
                            );
                            this.organizationRequestChange(
                              e,
                              hirerachicalHospitalData
                            );
                          }}
                        />
                        <span>{organization.name}</span>
                      </label>
                      <span
                        className={`bilh_agg_checkbox ${isChecked ? "agg_checkbox_checked" : ""
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="agg_checkbox"
                          checked={isChecked}
                          onChange={this.handleCheckboxChange}
                        />
                        BILH (Agg.)
                      </span>
                    </div>
                    <div className="filter_right">
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
                              checked={checkedSystemGoalsNew.has(1)}
                              onChange={() => this.handleGoalChange(1)}
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
                              checked={checkedSystemGoalsNew.has(2)}
                              onChange={() => this.handleGoalChange(2)}
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
                              checked={checkedSystemGoalsNew.has(3)}
                              onChange={() => this.handleGoalChange(3)}
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
                              checked={checkedSystemGoalsNew.has(4)}
                              onChange={() => this.handleGoalChange(4)}
                            />
                            <label htmlFor="Strategy" className="dropdown-item">
                              Strategy
                            </label>
                          </li>
                        </ul>
                      </div>
                      <button
                        className="print_btn"
                        disabled={selectedHospitalsNew.size === 0}
                        onClick={() => this.generatePrintFuctionRequest()}
                      >
                        Print
                      </button>
                    </div>
                  </div>
                  <div className="multi_btn_group">
                    {hirerachicalHospitalData[0].division.map(
                      (division: any) => (
                        <div
                          className={`inner_btn_group ${division.id == null ? "d-none" : ""
                            }`}
                        >
                          <div className="cat action secondary">
                            <label>
                              <input
                                type="checkbox"
                                value={division.id}
                                checked={division.hospitals.every(
                                  (hospital: any) =>
                                    selectedHospitalsNew.has(hospital.id)
                                )}
                                onChange={(e) => {
                                  this.handleDivisionChange(
                                    division.id,
                                    hirerachicalHospitalData
                                  );
                                  this.divisionRequestChange(division.id, e);
                                }}
                              />
                              <span>{division.name}</span>
                            </label>
                          </div>
                          <div className="btn_group">
                            {division.hospitals.map((hospital: any) => (
                              <div className="cat action">
                                <label key="">
                                  <input
                                    type="checkbox"
                                    value={hospital.id}
                                    checked={selectedHospitalsNew.has(
                                      hospital.id
                                    )}
                                    onChange={(e) => {
                                      this.handleHospitalChange(
                                        hospital.id,
                                        hospital
                                      );
                                    }}
                                  />
                                  <span>{hospital.title}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <div className="system_goel_container">
                      {/** Box Model */}
                      {goalHirerachyData.map((goal: any) => (
                        <div
                          className={`box_model ${!checkedSystemGoalsNew.has(goal.id) ? "d-none" : ""
                            }`}
                        >
                          <div className="header">{goal.name}</div>
                          <div>
                            <div>
                              {goal.subGoal.map((subGoal: any) => (
                                <div className="inner_container">
                                  <div className="inner_header">
                                    {subGoal.name}
                                  </div>

                                  {/** KPI's Table */}
                                  {subGoal.kpi.map((kpi: any) => (
                                    <table>
                                      <thead>
                                        <tr className="border_bkg kpi_row">
                                          <th
                                            // colSpan={5}
                                            rowSpan={2}
                                            className="kpi_name_title"
                                            data-tooltip-id={`tooltip-${kpi.id}`}
                                          >
                                            {kpi.title}
                                            <ReactTooltip id={`tooltip-${kpi.id}`} style={{ width: "250px"}}>
                                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{kpi.title}</span>
                                              </div>
                                            </ReactTooltip>                                          </th>
                                          <th style={{ width: "50px" }} rowSpan={2}>Q/M</th>
                                          <th>MTD/QTD</th>
                                          <th>% Variance</th>
                                          <th>YTD</th>
                                          <th>% Variance</th>

                                          <th rowSpan={2}>Details</th>
                                        </tr>
                                        <tr className="border_bkg kpi_row">

                                          {/* <th style={{ width: "50px" }}></th> */}
                                          <th style={{ padding: "0" }}>
                                            <table>
                                              <tr>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    border: "0",
                                                  }}
                                                >
                                                  Actual
                                                </td>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    borderTop: "0",
                                                    borderBottom: "0",
                                                    width: "80px",
                                                  }}
                                                >
                                                  Budget/Tgt
                                                </td>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    border: "0",
                                                  }}
                                                >
                                                  Prior Yr
                                                </td>
                                              </tr>
                                            </table>
                                          </th>
                                          <th style={{ padding: "0" }}>
                                            <table>
                                              <tr>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    borderTop: "0",
                                                    borderBottom: "0",
                                                    borderLeft: "0",
                                                  }}
                                                >
                                                  Budget/Tgt
                                                </td>
                                                <td
                                                  style={{
                                                    width: "110px",
                                                    border: "0",
                                                  }}
                                                >
                                                  to PY
                                                </td>
                                              </tr>
                                            </table>
                                          </th>

                                          <th style={{ padding: "0" }}>
                                            <table>
                                              <tr>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    border: "0",
                                                  }}
                                                >
                                                  Actual
                                                </td>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    borderTop: "0",
                                                    borderBottom: "0",
                                                    width: "80px",
                                                  }}
                                                >
                                                  Budget/Tgt
                                                </td>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    border: "0",
                                                  }}
                                                >
                                                  Prior Yr
                                                </td>
                                              </tr>
                                            </table>
                                          </th>
                                          <th style={{ padding: "0" }}>
                                            <table>
                                              <tr>
                                                <td
                                                  style={{
                                                    textAlign: "center",
                                                    borderTop: "0",
                                                    borderBottom: "0",
                                                    borderLeft: "0",
                                                  }}
                                                >
                                                  Budget/Tgt
                                                </td>
                                                <td
                                                  style={{
                                                    width: "110px",
                                                    border: "0",
                                                  }}
                                                >
                                                  to PY
                                                </td>
                                              </tr>
                                            </table>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {hirerachicalHospitalData.map(
                                          (organization: any) => {
                                            const allDivisionSelected =
                                              organization.division.every(
                                                (division: any) => {
                                                  // Check if the division is selected
                                                  return division.hospitals.every(
                                                    (hospital: any) => {
                                                      return selectedHospitalsNew.has(
                                                        hospital.id
                                                      );
                                                    }
                                                  );
                                                }
                                              );

                                            const divisionRows =
                                              organization.division.map(
                                                (division: any) => {
                                                  const allHospitalsSelected =
                                                    division.hospitals.every(
                                                      (hospital: any) =>
                                                        selectedHospitalsNew.has(
                                                          hospital.id
                                                        )
                                                    );

                                                  return (
                                                    <>
                                                      {division.hospitals.map(
                                                        (hospital: any) => (
                                                          <tr
                                                            className={`${!selectedHospitalsNew.has(
                                                              hospital.id
                                                            ) ||
                                                              [
                                                                5, 13, 15, 21,
                                                                22,
                                                              ].indexOf(
                                                                hospital.id
                                                              ) !== -1
                                                              ? "d-none"
                                                              : ""
                                                              } ${isChecked
                                                                ? "d-none"
                                                                : ""
                                                              }`}
                                                          >
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "left",
                                                              }}
                                                            >
                                                              <button>
                                                                {hospital.title}
                                                              </button>
                                                            </td>

                                                            <td
                                                              className={
                                                                kpi.Sitelevel ===
                                                                  "Y"
                                                                  ? ""
                                                                  : "no_data"
                                                              }
                                                              style={{
                                                                width: "50px",
                                                              }}
                                                            >
                                                              {" "}
                                                              {kpi.Sitelevel ===
                                                                "Y"
                                                                ? this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  organization.id,
                                                                  dataGoalMetrix,
                                                                  "ReportType"
                                                                )
                                                                : ""}
                                                            </td>
                                                            <td
                                                              style={{
                                                                padding: "0",
                                                              }}
                                                              className={
                                                                this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "ActualVerify"
                                                                ) == true
                                                                  ? "change_status"
                                                                  : ""
                                                              }
                                                            >
                                                              <table>
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      border:
                                                                        "0",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "MTD_ACTUAL"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      borderTop:
                                                                        "0",
                                                                      borderBottom:
                                                                        "0",
                                                                      width:
                                                                        "80px",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "MTD_BUDGET"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      border:
                                                                        "0",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "MTD_PRIOR_YEAR"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              style={{
                                                                padding: "0",
                                                              }}
                                                              className={
                                                                this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  hospital.id,
                                                                  dataGoalMetrix,
                                                                  "TargetVerified"
                                                                ) == true
                                                                  ? "change_status"
                                                                  : ""
                                                              }
                                                            >
                                                              <table className="budget-py">
                                                                <tr>
                                                                  <td>
                                                                    <table>
                                                                      <tr>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? this.findMatrixValues(
                                                                              subGoal.id,
                                                                              kpi.id,
                                                                              hospital.id,
                                                                              dataGoalMetrix,
                                                                              "MTD_BUDGET_VARIANCE"
                                                                            )
                                                                            : ""}
                                                                        </td>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {" "}
                                                                          <span
                                                                            className={
                                                                              kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.getStatus(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  hospital.id,
                                                                                  dataGoalMetrix,
                                                                                  "MTD_BUDGET_VAR_SIGN"
                                                                                )
                                                                                : ""
                                                                            }
                                                                          ></span>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "110px",
                                                                    }}
                                                                  >
                                                                    <table>
                                                                      <tr>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? this.findMatrixValues(
                                                                              subGoal.id,
                                                                              kpi.id,
                                                                              hospital.id,
                                                                              dataGoalMetrix,
                                                                              "MTD_PRIOR_YEAR_VARIANCE"
                                                                            )
                                                                            : ""}
                                                                        </td>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {" "}
                                                                          <span
                                                                            className={
                                                                              kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.getStatus(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  hospital.id,
                                                                                  dataGoalMetrix,
                                                                                  "MTD_PRIOR_YEAR_VAR_SIGN"
                                                                                )
                                                                                : ""
                                                                            }
                                                                          ></span>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              style={{
                                                                padding: "0",
                                                              }}
                                                            >
                                                              <table>
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      border:
                                                                        "0",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "YTD_ACTUAL"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      borderTop:
                                                                        "0",
                                                                      borderBottom:
                                                                        "0",
                                                                      width:
                                                                        "80px",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "YTD_BUDGET"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      textAlign:
                                                                        "center",
                                                                      border:
                                                                        "0",
                                                                    }}
                                                                    className={
                                                                      kpi.Sitelevel ===
                                                                        "Y"
                                                                        ? ""
                                                                        : "no_data"
                                                                    }
                                                                  >
                                                                    {kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? this.findMatrixValues(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        hospital.id,
                                                                        dataGoalMetrix,
                                                                        "YTD_PRIOR_YEAR"
                                                                      )
                                                                      : ""}
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              style={{
                                                                padding: "0",
                                                              }}
                                                            >
                                                              <table className="budget-py">
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      padding:
                                                                        "0",
                                                                    }}
                                                                  >
                                                                    <table>
                                                                      <tr>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? this.findMatrixValues(
                                                                              subGoal.id,
                                                                              kpi.id,
                                                                              hospital.id,
                                                                              dataGoalMetrix,
                                                                              "YTD_BUDGET_VARIANCE"
                                                                            )
                                                                            : ""}
                                                                        </td>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          <span
                                                                            className={
                                                                              kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.getStatus(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  hospital.id,
                                                                                  dataGoalMetrix,
                                                                                  "YTD_BUDGET_VAR_SIGN"
                                                                                )
                                                                                : ""
                                                                            }
                                                                          ></span>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "110px",
                                                                    }}
                                                                  >
                                                                    <table>
                                                                      <tr>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          {kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? this.findMatrixValues(
                                                                              subGoal.id,
                                                                              kpi.id,
                                                                              hospital.id,
                                                                              dataGoalMetrix,
                                                                              "YTD_PRIOR_YEAR_VARIANCE"
                                                                            )
                                                                            : ""}
                                                                        </td>
                                                                        <td
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? ""
                                                                              : "no_data"
                                                                          }
                                                                        >
                                                                          <span
                                                                            className={
                                                                              kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.getStatus(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  hospital.id,
                                                                                  dataGoalMetrix,
                                                                                  "YTD_PRIOR_YEAR_VAR_SIGN"
                                                                                )
                                                                                : ""
                                                                            }
                                                                          ></span>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              className={
                                                                kpi.Sitelevel ===
                                                                  "Y"
                                                                  ? ""
                                                                  : "no_data"
                                                              }
                                                            >
                                                              {kpi.Sitelevel ===
                                                                "Y" ? (
                                                                <a
                                                                  href={this.findMatrixValues(
                                                                    subGoal.id,
                                                                    kpi.id,
                                                                    hospital.id,
                                                                    dataGoalMetrix,
                                                                    "URL"
                                                                  )}
                                                                  target="_blank"
                                                                  className={`details ${this.findMatrixValues(
                                                                    subGoal.id,
                                                                    kpi.id,
                                                                    hospital.id,
                                                                    dataGoalMetrix,
                                                                    "URL"
                                                                  ) === null
                                                                    ? "disabled"
                                                                    : ""
                                                                    }`}
                                                                >
                                                                  Click
                                                                </a>
                                                              ) : (
                                                                ""
                                                              )}
                                                            </td>
                                                          </tr>
                                                        )
                                                      )}
                                                      {allHospitalsSelected && (
                                                        <tr
                                                          className={`division_avg ${division.id == null
                                                            ? "d-none"
                                                            : ""
                                                            } ${isChecked
                                                              ? "d-none"
                                                              : ""
                                                            }`}
                                                        >
                                                          <td
                                                            style={{
                                                              textAlign: "left",
                                                            }}
                                                          >
                                                            <button>
                                                              {division.name}{" "}
                                                              (Agg.)
                                                            </button>
                                                          </td>
                                                          <td
                                                            className={
                                                              kpi.Sitelevel ===
                                                                "Y"
                                                                ? ""
                                                                : "no_data"
                                                            }
                                                            style={{
                                                              width: "50px",
                                                            }}
                                                          >
                                                            {kpi.Sitelevel ===
                                                              "Y"
                                                              ? this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "ReportType"
                                                              )
                                                              : ""}
                                                          </td>
                                                          <td
                                                            style={{
                                                              padding: "0",
                                                            }}
                                                            className={
                                                              this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "ActualVerify"
                                                              ) == true
                                                                ? "change_status"
                                                                : ""
                                                            }
                                                          >
                                                            <table>
                                                              <tr>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    border: "0",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "MTD_ACTUAL"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    borderTop:
                                                                      "0",
                                                                    borderBottom:
                                                                      "0",
                                                                    width:
                                                                      "80px",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "MTD_BUDGET"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    border: "0",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "MTD_PRIOR_YEAR"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                          <td
                                                            style={{
                                                              padding: "0",
                                                            }}
                                                            className={
                                                              this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                division.id,
                                                                dataGoalMetrix,
                                                                "TargetVerified"
                                                              ) == true
                                                                ? "change_status"
                                                                : ""
                                                            }
                                                          >
                                                            <table className="budget-py">
                                                              <tr>
                                                                <td>
                                                                  <table>
                                                                    <tr>
                                                                      <td
                                                                        className={
                                                                          kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? ""
                                                                            : "no_data"
                                                                        }
                                                                      >
                                                                        {kpi.Sitelevel ===
                                                                          "Y"
                                                                          ? this.findMatrixValues(
                                                                            subGoal.id,
                                                                            kpi.id,
                                                                            division.id,
                                                                            dataGoalMetrix,
                                                                            "MTD_BUDGET_VARIANCE"
                                                                          )
                                                                          : ""}{" "}
                                                                      </td>
                                                                      <td
                                                                        className={
                                                                          kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? ""
                                                                            : "no_data"
                                                                        }
                                                                      >
                                                                        <span
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? this.getStatus(
                                                                                subGoal.id,
                                                                                kpi.id,
                                                                                division.id,
                                                                                dataGoalMetrix,
                                                                                "MTD_BUDGET_VAR_SIGN"
                                                                              )
                                                                              : ""
                                                                          }
                                                                        ></span>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    width:
                                                                      "110px",
                                                                  }}
                                                                >
                                                                  <table>
                                                                    <tr>
                                                                      <td
                                                                        className={
                                                                          kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? ""
                                                                            : "no_data"
                                                                        }
                                                                      >
                                                                        {kpi.Sitelevel ===
                                                                          "Y"
                                                                          ? this.findMatrixValues(
                                                                            subGoal.id,
                                                                            kpi.id,
                                                                            division.id,
                                                                            dataGoalMetrix,
                                                                            "MTD_PRIOR_YEAR_VARIANCE"
                                                                          )
                                                                          : ""}
                                                                      </td>
                                                                      <td
                                                                        className={
                                                                          kpi.Sitelevel ===
                                                                            "Y"
                                                                            ? ""
                                                                            : "no_data"
                                                                        }
                                                                      >
                                                                        <span
                                                                          className={
                                                                            kpi.Sitelevel ===
                                                                              "Y"
                                                                              ? this.getStatus(
                                                                                subGoal.id,
                                                                                kpi.id,
                                                                                division.id,
                                                                                dataGoalMetrix,
                                                                                "MTD_PRIOR_YEAR_VAR_SIGN"
                                                                              )
                                                                              : ""
                                                                          }
                                                                        ></span>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                          <td
                                                            style={{
                                                              padding: "0",
                                                            }}
                                                          >
                                                            <table>
                                                              <tr>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    border: "0",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "YTD_ACTUAL"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    borderTop:
                                                                      "0",
                                                                    borderBottom:
                                                                      "0",
                                                                    width:
                                                                      "80px",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "YTD_BUDGET"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    textAlign:
                                                                      "center",
                                                                    border: "0",
                                                                  }}
                                                                  className={
                                                                    kpi.Sitelevel ===
                                                                      "Y"
                                                                      ? ""
                                                                      : "no_data"
                                                                  }
                                                                >
                                                                  {kpi.Sitelevel ===
                                                                    "Y"
                                                                    ? this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      division.id,
                                                                      dataGoalMetrix,
                                                                      "YTD_PRIOR_YEAR"
                                                                    )
                                                                    : ""}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                          <td
                                                            style={{
                                                              padding: "0",
                                                            }}
                                                          >
                                                            <table>
                                                              <tr>
                                                                <td
                                                                  style={{
                                                                    padding:
                                                                      "0",
                                                                    border: "0",
                                                                  }}
                                                                >
                                                                  <table className="budget-py">
                                                                    <tr>
                                                                      <td>
                                                                        <table>
                                                                          <tr>
                                                                            <td
                                                                              className={
                                                                                kpi.Sitelevel ===
                                                                                  "Y"
                                                                                  ? ""
                                                                                  : "no_data"
                                                                              }
                                                                            >
                                                                              {kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.findMatrixValues(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  division.id,
                                                                                  dataGoalMetrix,
                                                                                  "YTD_BUDGET_VARIANCE"
                                                                                )
                                                                                : ""}
                                                                            </td>
                                                                            <td
                                                                              className={
                                                                                kpi.Sitelevel ===
                                                                                  "Y"
                                                                                  ? ""
                                                                                  : "no_data"
                                                                              }
                                                                            >
                                                                              <span
                                                                                className={
                                                                                  kpi.Sitelevel ===
                                                                                    "Y"
                                                                                    ? this.getStatus(
                                                                                      subGoal.id,
                                                                                      kpi.id,
                                                                                      division.id,
                                                                                      dataGoalMetrix,
                                                                                      "YTD_BUDGET_VAR_SIGN"
                                                                                    )
                                                                                    : ""
                                                                                }
                                                                              ></span>
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                      </td>
                                                                      <td
                                                                        style={{
                                                                          width:
                                                                            "110px",
                                                                        }}
                                                                      >
                                                                        <table>
                                                                          <tr>
                                                                            <td
                                                                              className={
                                                                                kpi.Sitelevel ===
                                                                                  "Y"
                                                                                  ? ""
                                                                                  : "no_data"
                                                                              }
                                                                            >
                                                                              {kpi.Sitelevel ===
                                                                                "Y"
                                                                                ? this.findMatrixValues(
                                                                                  subGoal.id,
                                                                                  kpi.id,
                                                                                  division.id,
                                                                                  dataGoalMetrix,
                                                                                  "YTD_PRIOR_YEAR_VARIANCE"
                                                                                )
                                                                                : ""}
                                                                            </td>
                                                                            <td
                                                                              className={
                                                                                kpi.Sitelevel ===
                                                                                  "Y"
                                                                                  ? ""
                                                                                  : "no_data"
                                                                              }
                                                                            >
                                                                              {" "}
                                                                              <span
                                                                                className={
                                                                                  kpi.Sitlevel ===
                                                                                    "Y"
                                                                                    ? this.getStatus(
                                                                                      subGoal.id,
                                                                                      kpi.id,
                                                                                      division.id,
                                                                                      dataGoalMetrix,
                                                                                      "YTD_PRIOR_YEAR_VAR_SIGN"
                                                                                    )
                                                                                    : ""
                                                                                }
                                                                              ></span>
                                                                            </td>
                                                                          </tr>
                                                                        </table>
                                                                      </td>
                                                                    </tr>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                          <td
                                                            className={
                                                              kpi.Sitelevel ===
                                                                "Y"
                                                                ? ""
                                                                : "no_data"
                                                            }
                                                          >
                                                            {kpi.Sitelevel ===
                                                              "Y" ? (
                                                              <a
                                                                href={this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  division.id,
                                                                  dataGoalMetrix,
                                                                  "URL"
                                                                )}
                                                                target="_blank"
                                                                className={`details ${this.findMatrixValues(
                                                                  subGoal.id,
                                                                  kpi.id,
                                                                  division.id,
                                                                  dataGoalMetrix,
                                                                  "URL"
                                                                ) === null
                                                                  ? "disabled"
                                                                  : ""
                                                                  }`}
                                                              >
                                                                Click
                                                              </a>
                                                            ) : (
                                                              ""
                                                            )}
                                                          </td>
                                                        </tr>
                                                      )}
                                                    </>
                                                  );
                                                }
                                              );

                                            return (
                                              <>
                                                {divisionRows}
                                                {(allDivisionSelected ||
                                                  isChecked) && (
                                                    <tr className="organization_avg">
                                                      <td
                                                        style={{
                                                          textAlign: "left",
                                                        }}
                                                      >
                                                        <button>
                                                          {organization.name}{" "}
                                                          (Agg.)
                                                        </button>
                                                      </td>
                                                      <td
                                                        style={{
                                                          width: "50px",
                                                        }}
                                                      >
                                                        {this.findMatrixValues(
                                                          subGoal.id,
                                                          kpi.id,
                                                          organization.id,
                                                          dataGoalMetrix,
                                                          "ReportType"
                                                        )}
                                                      </td>
                                                      <td
                                                        style={{ padding: "0" }}
                                                        className={
                                                          this.findMatrixValues(
                                                            subGoal.id,
                                                            kpi.id,
                                                            organization.id,
                                                            dataGoalMetrix,
                                                            "ActualVerify"
                                                          ) == true
                                                            ? "change_status"
                                                            : ""
                                                        }
                                                      >
                                                        <table>
                                                          <tr>
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                border: "0",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "MTD_ACTUAL"
                                                              )}
                                                            </td>
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                borderTop: "0",
                                                                borderBottom: "0",
                                                                width: "80px",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "MTD_BUDGET"
                                                              )}
                                                            </td>

                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                border: "0",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "MTD_PRIOR_YEAR"
                                                              )}
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                      <td
                                                        style={{ padding: "0" }}
                                                        className={
                                                          this.findMatrixValues(
                                                            subGoal.id,
                                                            kpi.id,
                                                            organization.id,
                                                            dataGoalMetrix,
                                                            "TargetVerified"
                                                          ) == true
                                                            ? "change_status"
                                                            : ""
                                                        }
                                                      >
                                                        <table className="budget-py">
                                                          <tr>
                                                            <td>
                                                              <table>
                                                                <tr>
                                                                  <td>
                                                                    {this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      organization.id,
                                                                      dataGoalMetrix,
                                                                      "MTD_BUDGET_VARIANCE"
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    { }
                                                                    <span
                                                                      className={this.getStatus(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        organization.id,
                                                                        dataGoalMetrix,
                                                                        "MTD_BUDGET_VAR_SIGN"
                                                                      )}
                                                                    ></span>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              style={{
                                                                width: "110px",
                                                              }}
                                                            >
                                                              <table>
                                                                <tr>
                                                                  <td>
                                                                    {this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      organization.id,
                                                                      dataGoalMetrix,
                                                                      "MTD_PRIOR_YEAR_VARIANCE"
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    <span
                                                                      className={this.getStatus(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        organization.id,
                                                                        dataGoalMetrix,
                                                                        "MTD_PRIOR_YEAR_VAR_SIGN"
                                                                      )}
                                                                    ></span>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                      <td
                                                        style={{ padding: "0" }}
                                                      >
                                                        <table>
                                                          <tr>
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                border: "0",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "YTD_ACTUAL"
                                                              )}
                                                            </td>
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                borderTop: "0",
                                                                borderBottom: "0",
                                                                width: "80px",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "YTD_BUDGET"
                                                              )}
                                                            </td>
                                                            <td
                                                              style={{
                                                                textAlign:
                                                                  "center",
                                                                border: "0",
                                                              }}
                                                            >
                                                              {this.findMatrixValues(
                                                                subGoal.id,
                                                                kpi.id,
                                                                organization.id,
                                                                dataGoalMetrix,
                                                                "YTD_PRIOR_YEAR"
                                                              )}
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                      <td
                                                        style={{ padding: "0" }}
                                                      >
                                                        <table className="budget-py">
                                                          <tr>
                                                            <td
                                                              style={{
                                                                padding: "0",
                                                              }}
                                                            >
                                                              <table>
                                                                <tr>
                                                                  <td>
                                                                    {this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      organization.id,
                                                                      dataGoalMetrix,
                                                                      "YTD_BUDGET_VARIANCE"
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    <span
                                                                      className={this.getStatus(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        organization.id,
                                                                        dataGoalMetrix,
                                                                        "YTD_BUDGET_VAR_SIGN"
                                                                      )}
                                                                    ></span>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              style={{
                                                                width: "110px",
                                                              }}
                                                            >
                                                              <table>
                                                                <tr>
                                                                  <td>
                                                                    {this.findMatrixValues(
                                                                      subGoal.id,
                                                                      kpi.id,
                                                                      organization.id,
                                                                      dataGoalMetrix,
                                                                      "YTD_PRIOR_YEAR_VARIANCE"
                                                                    )}
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    <span
                                                                      className={this.getStatus(
                                                                        subGoal.id,
                                                                        kpi.id,
                                                                        organization.id,
                                                                        dataGoalMetrix,
                                                                        "YTD_PRIOR_YEAR_VAR_SIGN"
                                                                      )}
                                                                    ></span>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                      <td>
                                                        <a
                                                          href={this.findMatrixValues(
                                                            subGoal.id,
                                                            kpi.id,
                                                            organization.id,
                                                            dataGoalMetrix,
                                                            "URL"
                                                          )}
                                                          target="_blank"
                                                          className={`details ${this.findMatrixValues(
                                                            subGoal.id,
                                                            kpi.id,
                                                            organization.id,
                                                            dataGoalMetrix,
                                                            "URL"
                                                          ) === null
                                                            ? "disabled"
                                                            : ""
                                                            }`}
                                                        >
                                                          Click
                                                        </a>
                                                      </td>
                                                    </tr>
                                                  )}
                                              </>
                                            );
                                          }
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
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.dummy}></div>
      </section>
    );
  }
}
