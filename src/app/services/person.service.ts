import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Persona } from '../models/Person';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  
  constructor(private http: HttpClient) { }

  public host = environment.apiUrl;

  public findPeopleByIdentification(id:string): Observable<Persona> {
    return this.http.get<Persona>(`${this.host}/person/get-by-identification/${id}`)
  }

  public getAllPeople(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.host}/person/get-all`)
  }
  
  public getAllPeoplePaginate(id:number): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.host}/person//get-all-paginate`)
  }

  public deleteByIdentification(id: number): Observable<Persona> {
    return this.http.delete<Persona>(`${this.host}/person/delete-by-id/${id}`)
  }

  public createPerson(data:any): Observable<Persona> {
    return this.http.post<Persona>(`${this.host}/person/create`, data)
  }

  public editPerson(id:any, data:any): Observable<Persona> {
    return this.http.post<Persona>(`${this.host}/person/update/${id}`, data)
  }

}
