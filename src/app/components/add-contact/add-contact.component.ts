import { Component, NgModule, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgModel, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf } from '@angular/common';

NgModule({
  declarations: [],
  exports: [NgModel],
});
@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NgIf, ReactiveFormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  public loading: boolean = false;
  public contactId: string | null = null;
  public contactForm: FormGroup;
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  constructor(private contactService: ContactService, private router: Router, private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
  }

  public createSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;
      const newContact: IContact = this.contactForm.value;
      this.contactService.createContact(newContact).subscribe(
        (data) => {
          this.router.navigate(['/']).then(() => {
            this.loading = false;
          });
        },
        (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      );
    }
  }
}
