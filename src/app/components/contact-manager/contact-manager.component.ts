import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgForOf, NgIf } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

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

  constructor(private contactService: ContactService, private router: Router) {}

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
        this.router.navigate(['/']).then();
        this.getAllContactsFromServer();
      }, (error) => {
        this.errorMessage = error;
      })
    }
  }
}
