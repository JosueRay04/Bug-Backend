import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Project } from 'src/app/interfaces/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef | undefined;

  view: [number, number] = [700, 400];

  // Options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  legendTitle = 'Legend';

  customColors: any[] = [
    { name: 'OPEN', value: '#FA3F16' },
    { name: 'CLOSED', value: '#A10A28' },
    // Agrega más categorías y colores según sea necesario
  ];

  colorScheme: any = {
    domain: this.customColors.map(color => color.value),
  };

  single: { name: string; value: number; percentage: string }[] = [];

  constructor(private projectService: ProjectService) {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getProjectsForUserAndCollaborations().subscribe(
      (data: Project[]) => {
        const categoryCounts: { [category: string]: number } = {};

        data.forEach(item => {
          const category: string = item.category || 'UndefinedCategory';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const totalProjects = data.length;
        this.single = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          value: count,
          percentage: ((count / totalProjects) * 100).toFixed(2)
        }));
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngAfterViewInit(): void {
    if (this.chartContainer) {
      const chartContainerElement: HTMLElement = this.chartContainer.nativeElement;
      chartContainerElement.style.marginTop = '30px';
    }
  }
}
