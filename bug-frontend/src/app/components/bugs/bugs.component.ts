import { Component, OnInit } from '@angular/core';
import { BugService } from 'src/app/services/bug.service';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css']
})

export class BugsComponent implements OnInit {
  bugs: any[] = [];
  projects: any[] = [];
  allProjects: any[] = [];
  showBugForm: boolean = false;
  bugForm: FormGroup;
  public archivos: any[] = [];
  isRowHovered: boolean = false;
  clickedRow: number | null = null;
  buttonColor: string = '#FF0000';

  constructor(private route: Router, private bugService: BugService, private projectService: ProjectService, private fb: FormBuilder,private http: HttpClient) {
    this.archivos = [];
    this.bugForm = this.fb.group({
      name: ['', Validators.required],
      summary: ['', Validators.required],
      description: ['', Validators.required],
      selectedOptionState: ['', Validators.required],
      selectedOptionPriority: ['', Validators.required],
      selectedOptionSeverity: ['', Validators.required],
      expectedCompletionAt: ['', Validators.required],
      selectedOptionProjectName: ['', Validators.required],
      selectedOptionColaborations: [''],
      image: [null]
    });
  }

  navigateToBugDetails(bugName: string) {
    this.route.navigate(['bugdetail', bugName]);
  }
  
  loadBugByCategory(newState: string){
    this.bugService.getBugs().subscribe(
      (data) => {
        // Filtrar bugs por estado
        this.bugs = data.filter((bug: any) => bug.state === newState && this.isBugVisible(bug));
      },
      (error) => {
        console.error('Error fetching bugs:', error);
      }
    );
  }

    BUGOPEN(newState: string) {
      this.loadBugByCategory(newState);
    }
    RESOLVED(newState: string) {
      this.loadBugByCategory(newState);
    }
    CLOSED(newState: string) {
      this.loadBugByCategory(newState);
    }

  ngOnInit(): void {
    
    this.loadBugs();
    
    this.loadProjects();

    this.loadProjectsUserAndCollaborators();
  }

  onProjectSelectChange() {
    
    const selectedProjectName = this.bugForm.get('selectedOptionProjectName')?.value;
    const selectedProject = this.projects.find(project => project.name === selectedProjectName);
  
    if (selectedProject) {
      console.log('Selected Project:', selectedProject);
    } else {
      console.log('Project not found');
    }
  
    // Reinicia la lista de colaboradores siempre asignando un array vacío
    this.bugForm.get('selectedOptionColaborations')?.setValue([]);
  
    // Asigna la lista de colaboradores al formulario si el proyecto está seleccionado
    if (selectedProject && selectedProject.collaborators && selectedProject.collaborators.length > 0) {
      const collaboratorsNames = selectedProject.collaborators.map((collaborator: { collaborator: any; }) => collaborator.collaborator);
      const collaboratorsString = collaboratorsNames.join(', ');
  
      console.log('Collaborators:', collaboratorsString);
  
      this.bugForm.get('selectedOptionColaborations')?.setValue([...collaboratorsNames]);
    }
  }

  SearchButtonClick(bugname: string): void {
    this.bugs = [];
    this.bugService.GetBugByName(bugname).subscribe(
      (response) => {
        console.log(response);
        
        // Verificar si la respuesta es un array
        if (Array.isArray(response)) {
          // La respuesta ya es un array, simplemente asignar
          this.bugs = response;
        } else if (typeof response === 'object' && response !== null) {
          // La respuesta es un objeto, convertirlo en un array
          this.bugs = [response];
        } else {
          console.error('La respuesta no es un array ni un objeto válido:', response);
        }
      },
      (error) => {
        // Manejar el error aquí
        console.error('Error fetching bugs:', error);
      }
    );
  }
  

  loadProjectsUserAndCollaborators() {
    this.projectService.getProjectsForUserAndCollaborations().subscribe(
      (data) => {
        this.allProjects = data;
        console.log(data);
  
        // Filtra los proyectos que cumplen las condiciones
        this.projects = this.allProjects.filter(project => {
          const localUserName = localStorage.getItem('userName');
          
          // Verifica si el usuario local es un colaborador con el rol de "ADMINISTRATOR"
          const isAdminCollaborator = project.collaborators?.some((collaborator: { collaborator: string | null; role: string; }) =>
            collaborator.collaborator === localUserName && collaborator.role === 'ADMINISTRATOR'
          );
  
          // Verifica si el usuario local es el creador del proyecto
          const isProjectOwner = project.userName === localUserName;
  
          // Devuelve true si cumple alguna de las dos condiciones
          return isAdminCollaborator || isProjectOwner;
        });
  
        // Puedes eliminar este console.log si no lo necesitas
        this.projects.forEach(project => {
          console.log(project);
        });
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Puedes manejar el error de la manera que consideres adecuada
      }
    );
  }
  
  

  loadProjects() {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        console.log(data);
        this.projects.forEach(project => {
          console.log(project);
        });
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Puedes manejar el error de la manera que consideres adecuada
      },
      () => {
        console.log('Projects loaded successfully');
        // Puedes realizar acciones adicionales después de que se complete la solicitud
      }
    );
  }

  collaboratorsAvailable(): boolean {
    const collaborators = this.bugForm.get('selectedOptionColaborations')?.value;
    return collaborators && collaborators.length > 0;
}

  onFileChange(event: any) {
    const filesubido = event.target.files[0];
    this.archivos.push(filesubido);
    // Aquí puedes realizar las acciones necesarias con el archivo, por ejemplo, mostrar su nombre
    console.log('Selected File:', filesubido ? filesubido.name : 'No file selected');
  }
  

  loadBugs() {
    this.bugService.getBugs().subscribe(
      (data) => {
        this.bugs = data;
        this.bugs = this.bugs.filter(bug => this.isBugVisible(bug));
        // Aquí puedes acceder a la información del usuario para cada bug
        this.bugs.forEach(bug => {
          console.log(bug);
        });
      },
      (error) => {
        console.error('Error fetching bugs:', error);
      }
    );
  }

  isBugVisible(bug: any): boolean {
    const userName = localStorage.getItem('userName');
  
    // Verifica si el userName está en la lista de colaboradores del bug
    const isCollaborator = bug.collaborators?.some((collaborator: string) => collaborator === userName);

    const isAuthor = bug.userName === userName;

    return isCollaborator || isAuthor;
  }

  openBugForm() {
    this.showBugForm = true;
  }

  closeBugForm() {
    this.showBugForm = false;
  }

  submitBugForm() {

    const userName = localStorage.getItem('userName');
    const bugData = {
      name: this.bugForm.get('name')?.value,
      summary: this.bugForm.get('summary')?.value,
      description: this.bugForm.get('description')?.value,
      state: this.bugForm.get('selectedOptionState')?.value,
      priority: this.bugForm.get('selectedOptionPriority')?.value,
      severity: this.bugForm.get('selectedOptionSeverity')?.value,
      finishedAt: this.bugForm.get('expectedCompletionAt')?.value,
      ProjectName: this.bugForm.get('selectedOptionProjectName')?.value,
      collaborators: this.bugForm.get('selectedOptionColaborations')?.value,
      image: this.bugForm.get('image')?.value,  // Agregar directamente el archivo al objeto
      userName: userName,
    };
    // Agrega el archivo directamente al FormData
  
    
    this.bugService.createBug(bugData).subscribe(
      response => {
        // Maneja la respuesta de la API
        console.log(response);
        this.bugs.push(response);
        this.closeBugForm();
        alert('bug created successfully');
      },
      error => {
        // Maneja los errores si es necesario
        console.error(error);
      }
    );
  }
  
}