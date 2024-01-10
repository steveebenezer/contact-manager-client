import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgForOf, NgIf } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { ToasterService } from '../../toaster.service';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [RouterModule, NgIf, NgForOf, SpinnerComponent],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.scss'
})
export class ContactManagerComponent {
  public loading: boolean = false;
  public contacts: IContact[] = [];
  public errorMessage: string | null = null;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    centered: true,
    windowClass: 'md-class',
  };

  constructor(private contactService: ContactService, private modalService: NgbModal, private toaster: ToasterService) {}

  ngOnInit(): void {
    this.getAllContactsFromServer();
  }

  getAllContactsFromServer() {
    this.loading = true;
    this.contactService.getAllContacts()
    .subscribe((data) => {
      this.contacts = data;
      this.loading = false;
    }, (error) => {
      this.errorMessage = error;
      this.loading = false;
    });
  }

  clickDeleteContact(contactId: string | undefined) {
    if (contactId) {
      this.contactService.deleteContact(contactId).subscribe((data) => {
        this.getAllContactsFromServer();
        this.toaster.success("Contact deleted succesfully");
      }, (error) => {
        this.errorMessage = error;
        this.toaster.success("Contact delete failed");
      })
    }
  }

  addContactPopup() {
    this.ngbModalOptions.windowClass = 'app-create-user-popup';
    const modalRef = this.modalService.open(AddContactComponent, this.ngbModalOptions);
    modalRef.componentInstance.createContact.subscribe((resp: any) => {
      this.getAllContactsFromServer();
    });
  }

  editContactPopup(contact: IContact) {
    this.ngbModalOptions.windowClass = 'app-create-user-popup';
    const modalRef = this.modalService.open(EditContactComponent, this.ngbModalOptions);
    modalRef.componentInstance.contact = contact;
    modalRef.componentInstance.updateContact.subscribe((resp: any) => {
      this.getAllContactsFromServer();
    });
  }
}
