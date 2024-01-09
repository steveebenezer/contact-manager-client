import { Component, NgModule, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgModel, FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';

NgModule({
  declarations: [],
  exports: [NgModel],
});
@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  public loading: boolean = false;
  public contactId: string | null = null;
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit(): void {
  }

  public createSubmit() {
    this.contactService.createContact(this.contact).subscribe((data) => {
      this.router.navigate(['/']).then();
    }, (error) => {
      this.errorMessage = error;
      this.router.navigate(['contacts/add']).then();
    })
  }
}
