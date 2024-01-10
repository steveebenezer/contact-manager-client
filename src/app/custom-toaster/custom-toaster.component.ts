import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-toaster',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './custom-toaster.component.html',
  styleUrl: './custom-toaster.component.scss'
})
export class CustomToasterComponent {
  @Input() toasterData: any;
  @Output() closeAction = new EventEmitter<any>();
  setOpacity: number = 1;
  private toasterTimeout: any;
  constructor() { }

  closeToaster(): void {
    this.toasterTimeout = setTimeout(() => {
      this.closeAction.emit({});
    }, 1000);
  }

  ngOnDestroy(): void{
    clearTimeout(this.toasterTimeout);
  }
}
