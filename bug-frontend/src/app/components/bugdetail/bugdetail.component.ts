import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BugService } from 'src/app/services/bug.service';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bugdetail',
  templateUrl: './bugdetail.component.html',
  styleUrl: './bugdetail.component.css'
})
export class BugdetailComponent implements OnInit {
  bugs: any = {}; // Propiedad para almacenar la información del bug
  respuesta: string = '';
  name: string = "";
  summary: string = "";
  description: string = "";
  state: string = "";
  priority: string = "";
  severity: string = "";
  finishedAt: Date = new Date();

  constructor(private route: ActivatedRoute, private bugService: BugService) {}

  ngOnInit(): void {
    // Suscríbete a los cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      // Verifica si 'bugName' está presente en los parámetros
      if (params['bugName']) {
        const bugName = params['bugName'];
        console.log('Bug Name from route parameters:', bugName);
        console.log(bugName)
        // Llama a la función para cargar los bugs
        this.loadBugs(bugName);
      }
    });
  }

  loadBugs(bugName: string): void {
    // Llama al servicio para obtener los bugs por nombre
    this.bugService.GetBugByName(bugName).subscribe(
      (response) => {
        console.log(response);
        // Manejar la respuesta aquí, por ejemplo, asignarla a la propiedad bugs
        this.bugs = response;
      },
      (error) => {
        // Manejar el error aquí
        console.error('Error fetching bugs:', error);
      }
    );
  }

  submitFormChangeAll(id: number){
    console.log(this.name);
    console.log(this.description);
    console.log(this.summary);
    console.log(this.state);
    console.log(this.priority);
    console.log(this.severity);
    console.log(this.finishedAt);
  }

  submitFormChangeBug(id: number){
    this.bugService.ChangedState(id,this.state).subscribe(
      Response => {
        alert ("State changed successfully");
      },
      error => {
        console.error('Error cambiando los datos', error);
      }
    )
  }

  submitForm(id: number) {
    // Actualiza bugs.Answer con nuevoValorRespuesta
    console.log('Valor del textarea:', this.respuesta);
    // Luego, realiza la solicitud o la acción necesaria con el nuevo valor
    this.bugService.ChangeAnswerBug(id,this.respuesta).subscribe(
      response => {
        alert('Answer changed successfully');
        // Realiza cualquier acción adicional después de la actualización exitosa
      },
      error => {
        console.error('Error cambiando los datos', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }
}
