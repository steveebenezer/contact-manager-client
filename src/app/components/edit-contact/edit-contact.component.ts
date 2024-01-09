import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NgIf, FormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  public loading: boolean = false;
  public contactId: string | null = null;
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  constructor(private activatedRoute: ActivatedRoute, private contactService: ContactService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((param) => {
      this.contactId = param.get('contactId');
    });
    if (this.contactId) {
      this.contactService.getContact(this.contactId).subscribe((data) => {
        this.contact = data;
        this.loading = false;
      }, (error) => {
        this.errorMessage = error;
        this.loading = false;
      })
    }
  }

  submitUpdate() {
    if (this.contactId) {
        this.contactService.updateContact(this.contact, this.contactId).subscribe((data) => {
        this.router.navigate(['/']).then();
      }, (error) => {
        this.errorMessage = error;
        this.router.navigate([`contacts/edit/${this.contactId}`]).then();
      })
    }
  }
}
