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
import {  IGoalMetrix, IHospital, IGoal, IKPI, ISubGoal, ISystemGoal, ISystemGoalProps } from './components/ISystemGoalKpiProps';


export interface ISystemGoalKpiWebPartProps {
  description: string;
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
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.system_goal}')/Items`;
    console.log('Fetching description data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getGoalConfiguration(): Promise<IGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.goal}')/Items`;
    console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getSubGoalConfiguration(): Promise<ISubGoal[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.sub_goal}')/Items`;
    console.log('Fetching sub_goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getKPIConfiguration(): Promise<IKPI[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.kpi}')/Items`;
    console.log('Fetching kpi data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getHospitalConfiguration(): Promise<IHospital[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.hospital}')/Items`;
    console.log('Fetching hospital data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
  }

  // Get List for System Goal
  public async getGoalMetrixConfiguration(): Promise<IGoalMetrix[]> {
    const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${this.properties.metrix}')/Items`;
    console.log('Fetching goal data from:', requestUrl);
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
    const data = await response.json();
    console.log('Data fetched:', data);
    return data.value; 
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
      const getGoalMetrix = await this.getGoalMetrixConfiguration();
      const getHospital = await this.getHospitalConfiguration();
      const getKPI = await this.getKPIConfiguration();
      const getSubGoal = await this.getSubGoalConfiguration();
      const getGoal = await this.getGoalConfiguration();
      const getSystemGoal = await this.getSystemGoalConfiguration();
      
      console.log('Banner data:', getGoalMetrix);



      const element: React.ReactElement<ISystemGoalProps> = React.createElement(
        SystemGoalKpi,
        {
          description: this.properties.description,          
          getGoalMetrix: getGoalMetrix,
          getHospital: getHospital,
          getKPI: getKPI,
          getSubGoal: getSubGoal,
          getGoal: getGoal,
          getSystemGoal: getSystemGoal  ,
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
