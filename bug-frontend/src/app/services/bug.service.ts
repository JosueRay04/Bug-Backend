import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  private APPUrl: string
  private APIUrl: string

  constructor(private http: HttpClient) {
    this.APPUrl = environment.endpoint;
    this.APIUrl = 'bug'
  }

  getBugs(): Observable<any[]> {
    return this.http.get<[]>(`${this.APPUrl}${this.APIUrl}`);
  }
  
  createBug(bugData: any): Observable<any> {
    console.log('metodo llamado');
    console.log(`${this.APPUrl}${this.APIUrl}/createBug`, bugData);
    return this.http.post(`${this.APPUrl}${this.APIUrl}/createBug`, bugData);
  }

  GetBugByName(Name: string): Observable<any> {
    return this.http.get(`${this.APPUrl}${this.APIUrl}/name/${Name}`);
  }

  ChangeAnswerBug(id: number, Answer: string): Observable<any> {
    const body = { Answer }; // Crea un objeto con la propiedad Answer
    
    // Construye la URL completa con la ruta y el ID del bug
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  ChangeBug(id: number, name: string, summary: string, description: string, state: string, priority:string, severity:string, FinishedAt: Date) : Observable<any> {
    const body = { name,summary,description,state,priority,severity,FinishedAt };
    
    // Construye la URL completa con la ruta y el ID del bug
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

  ChangedState(id: number, state: string){
    const body = {state}
    const url = `${this.APPUrl}${this.APIUrl}/${id}`;
  
    // Realiza la solicitud PATCH con el cuerpo de la respuesta
    return this.http.patch(url, body);
  }

}
