import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IContact } from '../../models/IContact';
import { ContactService } from '../../services/contact.service';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Input() public loading: boolean = false;
  @Input() public contactId: string | null = null;
  @Input() public contact: IContact = {} as IContact;
  @Input() public errorMessage: string | null = null;

  @Output() updateContact: EventEmitter<IContact> = new EventEmitter<IContact>();

  public contactForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private contactService: ContactService, private router: Router, private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((param) => {
      this.contactId = param.get('contactId');
    });
    if (this.contactId) {
      this.contactService.getContact(this.contactId).subscribe((data) => {
        this.contact = data;
        this.contactForm.patchValue(data);
        this.loading = false;
      }, (error) => {
        this.errorMessage = error;
        this.loading = false;
      });
    }
  }

  submitUpdate() {
    if (this.contactId && this.contactForm.valid) {
      this.loading = true;
      const updatedContact: IContact = this.contactForm.value;
      this.contactService.updateContact(updatedContact, this.contactId).subscribe(
        (data) => {
          this.updateContact.emit(updatedContact);
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
