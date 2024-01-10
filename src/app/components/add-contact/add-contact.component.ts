import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgModel, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../toaster.service';

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
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  @Output() public createContact: EventEmitter<IContact> = new EventEmitter<IContact>();

  public contactForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private contactService: ContactService, private formBuilder: FormBuilder, private toaster: ToasterService) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
          this.createContact.emit(newContact);
          this.loading = false;
          this.toaster.success("Contact added succesfully");
          this.activeModal.dismiss('Cross click');
        },
        (error) => {
          this.errorMessage = error;
          this.loading = false;
          this.toaster.error("Contact added failed");
        }
      );
    }
  }
}
