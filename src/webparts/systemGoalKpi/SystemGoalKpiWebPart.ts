import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import SystemGoalKpi from './components/SystemGoalKpi';
import {  IGoalMetrix, IHospital, IGoal, IKPI, ISubGoal, ISystemGoal, ISystemGoalProps , IOperatingModel } from './components/ISystemGoalKpiProps';


export interface ISystemGoalKpiWebPartProps {
  description: string;
  title: string;
  goal: string;
  system_goal: string;
  sub_goal: string;
  hospital: string;
  kpi: string;
  metrix: string;
}

export default class SystemGoalKpiWebPart extends BaseClientSideWebPart<ISystemGoalKpiWebPartProps> {

 public async onInit(): Promise<void> {
    console.log('onInit called');
    await super.onInit();
    console.log('onInit finished');
 }
  
  // Get List for System Goal
  public async getSystemGoalConfiguration(): Promise<ISystemGoal[]> {
    try {
      const response = await fetch("https://localhost:7001/api/operatingmodel");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API pillers  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    } 
  }

  // Get List for System Goal
  public async getGoalConfiguration(): Promise<IGoal[]> {
    try {
      const response = await fetch("https://localhost:7001/api/pillers");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API pillers  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    }
  }

  // Get List for System Goal
  public async getSubGoalConfiguration(): Promise<ISubGoal[]> {
    try {
      const response = await fetch("https://localhost:7001/api/subgoals");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API pillers  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    }
  }


   // Get List for Division
   public async getDivisionConfiguration(): Promise<IHospital[]> {
   


    try {
      const response = await fetch("https://localhost:7001/api/hospitals");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      // const filteredData = data.value.filter(
      //   (item: IHospital) => item.DivisionId == null
      // );
      // console.log('filter hospital Data fetched:', filteredData);
      return data;
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      throw error;
    }
  }

  // Get List for System Goal
  public async getKPIConfiguration(): Promise<IKPI[]> {
    try {
      const response = await fetch("https://localhost:7001/api/kpis");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API kpi  new  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    }
  }

   // Get List for full hospital list
   public async getAllHospitalConfiguration(): Promise<any> {
    try {
      const response = await fetch("https://localhost:7001/api/hospitals");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      throw error;
    }
  }

  // Get List for System Goal
  public async getHospitalConfiguration(): Promise<IHospital[]> {
    try {
      const response = await fetch("https://localhost:7001/api/hospitals");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API pillers  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    }
  }

  // Get List for System Goal
  public async getGoalMetrixConfiguration(): Promise<IGoalMetrix[]> {
    try {
      const response = await fetch("https://localhost:7001/api/summary");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API summary  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    }
  }

  // Get List for Operating Model
  public async getOperatingModelConfiguration(): Promise<IOperatingModel[]> {
    try {
      const response = await fetch("https://localhost:7001/api/operatingmodel");
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response API pillers  Data ---->", data);
      return data;
    } catch (error) {
      console.error("Error fetching pillers data:", error);
      throw error;
    } 
  }

 public render(): void {
    console.log('render called');
    if (!this.domElement) {
      console.error('domElement is not available');
      return;
    }
    if(this.domElement) this.renderContent();
  }


  
  protected async renderContent(): Promise<void> {
    try {
      const getOperatingModel = await this.getOperatingModelConfiguration();
      const getGoalMetrix = await this.getGoalMetrixConfiguration();
      const getHospital = await this.getHospitalConfiguration();
      const getDivision = await this.getDivisionConfiguration();
      const getKPI = await this.getKPIConfiguration();
      const getSubGoal = await this.getSubGoalConfiguration();
      const getGoal = await this.getGoalConfiguration();
      const getSystemGoal = await this.getSystemGoalConfiguration();
      const getAllHospital = await this.getAllHospitalConfiguration();
      console.log('Banner data:', getGoalMetrix);

      const pageTitle = this.properties.title;

      const element: React.ReactElement<ISystemGoalProps> = React.createElement(
        SystemGoalKpi,
        {
          title: pageTitle,
          description: this.properties.description,
          getOperatingModel: getOperatingModel,
          getGoalMetrix: getGoalMetrix,
          getDivision: getDivision,
          getHospital: getHospital,
          getKPI: getKPI,
          getSubGoal: getSubGoal,
          getGoal: getGoal,
          getSystemGoal: getSystemGoal,
          getAllHospital: getAllHospital,
        }
      );

      const domElement = document.querySelector('[data-sp-web-part-id="0d46ba9c-5483-423a-8bd0-a366a99a6608"]');
      console.log("Dom element ---->", domElement)
      console.log("element ---->", element);

      if (domElement) {
        ReactDom.render(element, domElement);
      } else {
        console.error('The specified DOM element is not found.');
      }
    } catch (error) {
      console.error('Error during render:', error);
    }
  }



  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
       
          groups: [
            {
            
              groupFields: [
                PropertyPaneTextField('system_goal', {
                  label: 'System Goal'
                },
                ),
                
                PropertyPaneTextField('goal', {
                  label: 'Goal'
                },
                ),
                
                PropertyPaneTextField('sub_goal', {
                  label: 'Sub Goal'
                },
                ),
                
                PropertyPaneTextField('kpi', {
                  label: 'KPI'
                },
                ),
                PropertyPaneTextField('hospital', {
                  label: 'Hospital'
                },
                ),
                PropertyPaneTextField('metrix', {
                  label: 'Metrix'
                },
                )

              ]
            }
          ]
        }
      ]
    };
  }
}
