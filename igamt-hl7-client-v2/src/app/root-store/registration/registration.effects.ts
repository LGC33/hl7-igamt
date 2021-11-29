import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { User } from 'src/app/modules/dam-framework/models/authentication/user.class';
import { RxjsStoreHelperService } from 'src/app/modules/dam-framework/services/rxjs-store-helper.service';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { RegistrationService } from '../../modules/core/services/registration.service';
import { Message } from '../../modules/dam-framework/models/messages/message.class';
import {
  RegistrationActionTypes,
  RegistrationFailure,
  RegistrationRequest,
  RegistrationSuccess,
} from './registration.actions';

@Injectable()
export class RegistrationEffects {

  @Effect()
  registration$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationRequest),
    concatMap((action: RegistrationRequest) => {
      this.store.dispatch(new fromDAM.TurnOnLoader({
        blockUI: false,
      }));
      return this.registrationService.register(action.payload).pipe(
        map((response: Message<User>) => {
          return new RegistrationSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          return of(new RegistrationFailure(error));
        }),
      );
    }),
  );
  @Effect()
  registrationSuccess$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationSuccess),
    this.helper.finalize<RegistrationSuccess, Message>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: RegistrationSuccess): Message => {
        return action.payload;
      },
      handler: (action: RegistrationSuccess): Action[] => {
        this.router.navigate(['/login']);
        return [];
      },
    }),
  );
  @Effect()
  registrationFailure$ = this.actions$.pipe(
    ofType(RegistrationActionTypes.RegistrationFailure),
    this.helper.finalize<RegistrationFailure, HttpErrorResponse>({
      clearMessages: true,
      turnOffLoader: true,
      message: (action: RegistrationFailure): HttpErrorResponse => {
        return action.payload;
      },
    }),
  );

  constructor(
    private actions$: Actions,
    private registrationService: RegistrationService,
    private store: Store<any>,
    private router: Router,
    private helper: RxjsStoreHelperService,
  ) {
  }
}
