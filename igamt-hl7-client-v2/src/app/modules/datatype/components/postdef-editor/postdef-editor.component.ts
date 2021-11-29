import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadDatatype } from '../../../../root-store/datatype-edit/datatype-edit.actions';
import { DefinitionEditorComponent } from '../../../core/components/definition-editor/definition-editor.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { ChangeType, PropertyType } from '../../../shared/models/save-change';
import { FroalaService } from '../../../shared/services/froala.service';
import { DatatypeService } from '../../services/datatype.service';

@Component({
  selector: 'app-predef-editor',
  templateUrl: '../../../core/components/definition-editor/definition-editor.component.html',
  styleUrls: ['../../../core/components/definition-editor/definition-editor.component.scss'],
})
export class PostdefEditorComponent extends DefinitionEditorComponent implements OnInit, OnDestroy {

  predefForm: FormGroup;
  changeSubscription: Subscription;
  syncSubscription: Subscription;
  constructor(
    actions$: Actions,
    store: Store<any>,
    messageService: MessageService,
    private datatypeService: DatatypeService, froalaService: FroalaService) {
    super({
      id: EditorID.POSTDEF,
      resourceType: Type.DATATYPE,
      title: 'Post-definition',
    },
      PropertyType.PREDEF,
      actions$, store, messageService, froalaService);
  }

  saveChange(elementId: string, documentRef: IDocumentRef, value: any, old: any, property: PropertyType): Observable<Action> {
    return this.datatypeService.saveChanges(elementId, documentRef, [{
      propertyType: PropertyType.POSTDEF,
      propertyValue: value,
      position: -1,
      changeType: ChangeType.UPDATE,
      location: elementId,
      oldPropertyValue: old,
    }]).pipe(
      flatMap((response) => {
        return [
          this.messageService.messageToAction(response),
          new LoadDatatype(elementId),
        ];
      }),
      catchError((error) => {
        return of(
          this.messageService.actionFromError(error),
          new fromDam.EditorSaveFailure(),
        );
      }),
    );
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectDatatypesById;
  }
}
