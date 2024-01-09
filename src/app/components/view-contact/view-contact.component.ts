import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IContact } from '../../models/IContact';
import { NgIf } from '@angular/common';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-view-contact',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './view-contact.component.html',
  styleUrl: './view-contact.component.scss'
})
export class ViewContactComponent {
  public loading: boolean = false;
  public contactId: string | null = null;
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  constructor(private activatedRoute: ActivatedRoute,
    private contactService: ContactService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: any) => {
      this.contactId = param.get('contactId');
    });
    if(this.contactId) {
      this.loading = true;
      this.contactService.getContact(this.contactId)
        .subscribe((data: IContact) => {
          this.contact = data;
          this.loading = false;
        }, (error: string | null) => {
          this.errorMessage = error;
          this.loading = false;
        })
    }
  }

  public isNotEmpty() {
    return Object.keys(this.contact).length > 0;
  }
}
