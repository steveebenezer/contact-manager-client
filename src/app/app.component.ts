import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToasterService } from './toaster.service';
import { Subscription, delay, startWith } from 'rxjs';
import { CustomToasterComponent } from './custom-toaster/custom-toaster.component';
import { animate, style, transition, trigger } from '@angular/animations';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NavbarComponent, HttpClientModule, FormsModule, CustomToasterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger(
      'toasterAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000)',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000)',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent {
  private toasterSubscription: Subscription | undefined;
  toasterData: any = {};
  private timeoutID: any = undefined;
  title = 'ContactManager';

  constructor(private toaster: ToasterService, private _changeDetect: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.toasterSubscription = this.toaster.showToaster
      .pipe(
        delay(0)
      )
      .subscribe(
      (toasterData: any) => {
        this.toasterData = toasterData;
        if (Object.entries(toasterData).length > 0) {
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
          };

          this.timeoutID = setTimeout(() => {
            this.toasterData = {};
          }, 500);

        } else {
          clearTimeout(this.timeoutID);
        };
        this._changeDetect.markForCheck();

      });
  }

  ngOnDestroy(): void {
    this.toasterSubscription?.unsubscribe();
  }

  closeAction(toasterAction: any) {
    this.toasterData = toasterAction;
  }
}
