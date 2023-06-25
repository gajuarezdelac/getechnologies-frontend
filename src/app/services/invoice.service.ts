import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice } from '../models/Invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  public host = environment.apiUrl;

  public findInvoicesByPerson(id:number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.host}/invoice/get-by-person/${id}`)
  }

  public getAllInvoicesByPerson(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.host}/invoice/get-by-person-paginate`)
  }

  public generateInvoice(data:any): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.host}/invoice/create`, data)
  }

  public deleteInvoice(id: number): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.host}/invoice/delete-invoice/${id}`)
  }

}
