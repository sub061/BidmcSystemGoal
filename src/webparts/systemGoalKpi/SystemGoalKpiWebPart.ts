import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import SystemGoalKpi from './components/SystemGoalKpi';
import {  IGoalMetrix, IHospital, IGoal, IKPI, ISubGoal, ISystemGoal, ISystemGoalProps, IOperatingModel } from './components/ISystemGoalKpiProps';


export interface ISystemGoalKpiWebPartProps {
  description: string;
  title: string;
  goal: string;
  system_goal: string;
  sub_goal: string;
  division: string;
  hospital: string;
  kpi: string;
  metrix: string;
}

export default class SystemGoalKpiWebPart extends BaseClientSideWebPart<ISystemGoalKpiWebPartProps> {

 public async onInit(): Promise<void> {
    // console.log('onInit called');
    await super.onInit();
    // console.log('onInit finished');
  }



  // Get List for System Goal
  public async getSystemGoalConfiguration(): Promise<ISystemGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.system_goal}')/Items`;
    // console.log('Fetching description data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getGoalConfiguration(): Promise<IGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.goal}')/Items`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getSubGoalConfiguration(): Promise<ISubGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.sub_goal}')/Items`;
    // console.log('Fetching sub_goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getKPIConfiguration(): Promise<IKPI[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.kpi}')/Items`;
    // console.log('Fetching kpi data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // // console.log('Data fetched:', data);
    return data.value; 
  }

// Get List for Division
  public async getDivisionConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // // console.log('Fetching Division data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // // console.log('Data fetched:', data);
    // Filter the data to include only those items where Division is not null
    const filteredData = data.value.filter((item: IHospital) => item.DivisionId == null);
    // // console.log('filter hospital Data fetched:', filteredData);
    return filteredData; 
    
  }


   // Get List for full hospital list
  public async getAllHospitalConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // // console.log('Fetching hospital data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('hospital Data fetched:', data);
 
    return data.value; 
  }

  // Get List for System Goal
  public async getHospitalConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    // console.log('Fetching hospital data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('hospital Data fetched:', data);

// Filter the data to include only those items where Division is not null
    const filteredData = data.value.filter((item: IHospital) => item.DivisionId !== null);
// console.log('filter hospital Data fetched:', filteredData);
    return filteredData; 
  }

  // Get List for System Goal
  public async getGoalMetrixConfiguration(): Promise<IGoalMetrix[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.metrix}')/Items?$top=5000`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    // console.log('Data fetched:', data);
    return data.value; 
  }


public async getSortedGoalMetrixData(): Promise<IGoalMetrix[]> {
    // Fetch the GoalMetrix and Hospital configurations
    const [goalMetrixData, hospitalData] = await Promise.all([
        this.getGoalMetrixConfiguration(),
        this.getAllHospitalConfiguration()
    ]);

    // Create a mapping of hospitalId to OrderBy value
    const hospitalMapping = hospitalData.reduce((acc, hospital) => {
        acc[hospital.Id] = hospital.OrderBy; // Ensure OrderBy is a number
        return acc;
    }, {} as Record<number, number>); // Changed to store numbers instead of strings

    // Sort GoalMetrix data based on the OrderBy value from hospitalMapping
    const sortedGoalMetrixData = goalMetrixData.sort((a, b) => {
        const orderByA = hospitalMapping[a.HospitalId]; // Adjust 'HospitalId' to match the field in IGoalMetrix
        const orderByB = hospitalMapping[b.HospitalId]; // Adjust 'HospitalId' to match the field in IGoalMetrix

        // Compare the two OrderBy values for sorting
        return orderByA - orderByB; // Ascending order; use `orderByB - orderByA` for descending order
    });
  console.log( "sortedGoalMetrixData" , sortedGoalMetrixData);
    return sortedGoalMetrixData;
}



  // Get List for Operating Model
  public async getOperatingModelConfiguration(): Promise<IOperatingModel[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('Operating Model')/Items`;
    // console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    return data.value; 
  }

 public render(): void {
    // console.log('render called');
    if (!this.domElement) {
      // console.error('domElement is not available');
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
      const SortedGoalMetrixData = await this.getSortedGoalMetrixData();
      
      const pageTitle = this.properties.title;

      // console.log("page title", pageTitle);
      
      
      // console.log('Banner data:', getGoalMetrix);

      console.log("SortedGoalMetrixData", getGoalMetrix);

      const element: React.ReactElement<ISystemGoalProps> = React.createElement(
        SystemGoalKpi,
        {
          title:pageTitle,
          description: this.properties.description,  
          getOperatingModel: getOperatingModel,
          //getGoalMetrix: getGoalMetrix,
          getGoalMetrix: SortedGoalMetrixData,
          getDivision: getDivision,
          getHospital: getHospital,
          getKPI: getKPI,
          getSubGoal: getSubGoal,
          getGoal: getGoal,
          getSystemGoal: getSystemGoal,
          getAllHospital:getAllHospital,
          
        }
      );

      const domElement = document.querySelector('[data-sp-web-part-id="0d46ba9c-5483-423a-8bd0-a366a99a6608"]');
      // console.log("Dom element ---->", domElement)
      // console.log("element ---->", element);

      if (domElement) {
        ReactDom.render(element, domElement);
      } else {
        // console.error('The specified DOM element is not found.');
      }
    } catch (error) {
      // console.error('Error during render:', error);
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

                 PropertyPaneTextField('title', {
                   label: 'Title',
                  // value: 'BILH Operating Model' // Set default value here
                },
                ),
                PropertyPaneTextField('system_goal', {
                  label: 'System Goal',
                 // value: 'Organization' // Set default value here
                },
                ),
                
                PropertyPaneTextField('goal', {
                  label: 'Goal',
                 // value: 'Goal' // Set default value here
                },
                ),
                
                PropertyPaneTextField('sub_goal', {
                  label: 'Sub Goal',
                  //value: 'Sub Goal' // Set default value here
                },
                ),
                
                PropertyPaneTextField('kpi', {
                  label: 'KPI',
                 // value: 'KPI' // Set default value here
                },
                ),
                 PropertyPaneTextField('division', {
                   label: 'Division',
                  // value: 'Division' // Set default value here
                },
                ),
                PropertyPaneTextField('hospital', {
                  label: 'Hospital',
                 // value: 'Hospital' // Set default value here
                },
                ),
                PropertyPaneTextField('metrix', {
                  label: 'Metrix',
                 // value: 'Goal Metrix' // Set default value here
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
