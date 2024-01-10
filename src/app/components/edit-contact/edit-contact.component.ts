import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Input() public contact: IContact = {} as IContact;
  public loading: boolean = false;
  public contactId: string | null = null;
  public errorMessage: string | null = null;

  @Output() updateContact: EventEmitter<IContact> = new EventEmitter<IContact>();

  public contactForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private contactService: ContactService, private router: Router, private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  
  get id() { return this.contactForm.get("id"); }
  get firstName() { return this.contactForm.get("firstName"); }
  get lastName() { return this.contactForm.get("lastName"); }
  get email() { return this.contactForm.get("email"); }

  ngOnInit(): void {
    this.id?.setValue(this.contact.id);
    this.firstName?.setValue(this.contact.firstName);
    this.lastName?.setValue(this.contact.lastName);
    this.email?.setValue(this.contact.email);
  }

  submitUpdate() {
    if (this.contactId && this.contactForm.valid) {
      // this.loading = true;
      const updatedContact: IContact = this.contactForm.value;
      this.contactService.updateContact(updatedContact, this.contactId).subscribe(
        (data) => {
          this.loading = false;
          this.updateContact.emit(updatedContact);
          this.activeModal.dismiss('Cross click');
        },
        (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      );
    }
  }
}
