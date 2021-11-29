import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClearAll } from 'src/app/modules/dam-framework/store/messages/messages.actions';
import { RegistrationRequest } from '../../../../root-store/registration/registration.actions';
import { IRegistration } from '../../../dam-framework/models/authentication/registration.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.store.dispatch(new ClearAll());
  }

  onSubmitApplication($event: IRegistration) {
    this.store.dispatch(new RegistrationRequest($event));
  }
}
