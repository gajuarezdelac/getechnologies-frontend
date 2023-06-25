import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoiceService } from './services/invoice.service';
import { PersonService } from './services/person.service';
import { Persona } from './models/Person';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpErrorResponse } from '@angular/common/http';
import { Invoice } from './models/Invoice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public subscriptions: Subscription[] = [];

  public isLoadingGeneralP = false;
  public isLoadingGeneralI = false;

  public createFormPerson!: FormGroup;
  public editFormPerson!: FormGroup;

  public createFormInvoice!: FormGroup;
  public editFormInvoice!: FormGroup;

  public visibleCreatePDrawer = false;
  public visibleEditPDrawer = false;
  public isLoadingCreateP = false;

  public visibleCreateFDrawer = false;
  public visibleEditFDrawer = false;
  public isLoadingCreateF = false;

  public selectPerson! : Persona;

  public personsBySelect : Persona[] = [];
  public personsDataTable : Persona[] = [];
  public invoicesDataTable : Invoice[] = [];
  
  ngOnInit(): void {

    this.createFormPerson = this.fb.group({
      apellidoMaterno: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      identificacion: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
    });

    this.editFormPerson = this.fb.group({
      apellidoMaterno: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      identificacion: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
    });

    this.createFormInvoice = this.fb.group({
      monto: [null, [Validators.required]],
      persona: [null, [Validators.required]],
    
    });

    this.editFormInvoice = this.fb.group({
      monto: [null, [Validators.required]],
      persona: [null, [Validators.required]],
    });

    this.getAllInvoices();
    this.getAllPersons();


  }

  constructor(private fb: FormBuilder, private serviceI : InvoiceService, private serviceP : PersonService,    private message: NzMessageService,) {

  }



  public submitCreateFormPerson() {

    if (!this.createFormPerson.valid) {
      Object.values(this.createFormPerson.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    } 

    let form = this.createFormPerson.value;
    this.isLoadingCreateP = true;

    this.subscriptions.push(
      this.serviceP.createPerson(form).subscribe(
          (response: Persona) => {
            this.getAllPersons();
            this.message.create('success', "Creado con exito");
            this.isLoadingCreateP = false;
            this.hideCreateDrawerPerson();
            this.createFormPerson.reset();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingCreateP = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );

  }

  public submitEditFormPerson() {

    if (!this.editFormPerson.valid) {
      Object.values(this.editFormPerson.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    } 

    let form = this.editFormPerson.value;
    this.isLoadingCreateP = true;

    this.subscriptions.push(
      this.serviceP.editPerson(this.selectPerson.id,form).subscribe((response: Persona) => {
            this.getAllPersons();
            this.message.create('success', "Creado con exito");
            this.isLoadingCreateP = false;
            this.hideeditDrawerPerson();
            this.editFormPerson.reset();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingCreateP = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

  public submitCreateFormInvoice() {

    if (!this.createFormInvoice.valid) {
      Object.values(this.createFormInvoice.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    } 

    let form = this.createFormInvoice.value;
    this.isLoadingCreateF = true;

    this.subscriptions.push(
      this.serviceI.generateInvoice(form).subscribe((response: Invoice) => 
         {
           this.getAllInvoices();
           this.getAllPersons();
            this.message.create('success', "Creado con exito");
            this.isLoadingCreateF = false;
            this.hideDCreaterawerInvoice();
            this.createFormInvoice.reset();
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingCreateF = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );


  }

  public submitEditormInvoice() {

    if (!this.editFormInvoice.valid) {

      Object.values(this.editFormInvoice.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      return;
    } 


    let invoice = this.editFormInvoice.value;

  


  }

  public showCreateDrawerPerson = () => { this.visibleCreatePDrawer = true; }
  public hideCreateDrawerPerson = () => { this.visibleCreatePDrawer = false; }

  public showCreateDrawerInvoice = () => { this.visibleCreateFDrawer = true; }
  public hideDCreaterawerInvoice = () => { this.visibleCreateFDrawer = false; }

  public showEditDrawerPerson = (person : any) => { 
    this.visibleEditPDrawer = true;
    this.selectPerson = person;
  }

  public hideeditDrawerPerson = () => { this.visibleEditPDrawer = false; }

  confirmDeletePerson(person :any) {
    this.isLoadingGeneralP = false;
    this.subscriptions.push(
      this.serviceP.deleteByIdentification(person.id)
        .subscribe(
          (response: Persona) => {
            this.getAllInvoices();
            this.getAllPersons();
            this.isLoadingGeneralP = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingGeneralP = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );

  }

  confirmDeleteInvoice(invoice : any) {
    this.isLoadingGeneralI = false;
    this.subscriptions.push(
      this.serviceI
        .deleteInvoice(invoice.id)
        .subscribe(
          (response: Invoice) => {
            this.getAllInvoices();
            this.isLoadingGeneralI = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingGeneralI = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }


  getAllPersons() {

    this.isLoadingGeneralP = true;
    this.subscriptions.push(
      this.serviceP
        .getAllPeople()
        .subscribe(
          (response: Persona[]) => {
            this.personsBySelect = response;
            this.personsDataTable = response;
            this.isLoadingGeneralP = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingGeneralP = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );

  }
  getAllInvoices() {
    this.isLoadingGeneralI = true;
    this.subscriptions.push(
      this.serviceI
        .findInvoicesByPerson(1)
        .subscribe(
          (response: Invoice[]) => {
            this.invoicesDataTable = response;
            this.isLoadingGeneralI = false;
          },
          (errorResponse: HttpErrorResponse) => {
            this.isLoadingGeneralI = false;
            this.message.create('error', errorResponse.error.message);
          }
        )
    );
  }

 

}


