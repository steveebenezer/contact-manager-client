import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private _toasterBS = new BehaviorSubject<any>({});
  showToaster = this._toasterBS.asObservable();
  private toasterData: any = {};
  constructor() { }

  success(message: string, timeout?: number): void {
    this.toasterData = {
      text: message,
      toasterClass: 'toaster-success',
      iconClass: 'fa-check',
      timeout: timeout ?? 5000
    };
    this._toasterBS.next(this.toasterData);
  }

  warning(message: string, timeout?: number): void {
    this.toasterData = {
      text: message,
      toasterClass: 'toaster-warning',
      iconClass: 'fa-triangle-exclamation',
      timeout: timeout ?? 5000
    };
    this._toasterBS.next(this.toasterData);
  }

  error(message: string, timeout?: number): void {
    this.toasterData = {
      text: message,
      toasterClass: 'toaster-error',
      iconClass: 'fa-circle-xmark',
      timeout: timeout ?? 5000
    };
    this._toasterBS.next(this.toasterData);
  }
}
