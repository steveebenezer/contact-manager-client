import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [RouterModule, NgIf, NgForOf],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.scss'
})
export class ContactManagerComponent {
  public loading: boolean = false;
  public contacts: IContact[] = [];
  public errorMessage: string | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
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


}
