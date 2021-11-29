import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import { IBindingType, IValuesetStrength } from '../../models/binding.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { ICodes, IValueSet } from '../../models/value-set.interface';

@Component({
  selector: 'app-binding-selector',
  templateUrl: './binding-selector.component.html',
  styleUrls: ['./binding-selector.component.css'],
})
export class BindingSelectorComponent<T> implements OnInit {
  selectedBindingType: IBindingType = IBindingType.VALUESET;
  selectedValueSet: IDisplayElement;
  currentValueSet: IValueSet;
  edit = {};
  editableBinding: IValueSetBindingDisplay;
  temp: IDisplayElement = null;
  selectedSingleCode: ISingleCodeDisplay;
  bindingStrengthOptions = [
    { label: 'Required', value: IValuesetStrength.R }, { label: 'Suggested', value: IValuesetStrength.S }, { label: 'Unspecified', value: IValuesetStrength.U },
  ];
  locationInfo: IBindingLocationInfo;
  excludeBindingStrength: boolean;
  private selectedValueSets: IValueSetBindingDisplay[] = [];

  constructor(
    public dialogRef: MatDialogRef<BindingSelectorComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: IBindingSelectorData,
    private valueSetService: ValueSetService,
    private store: Store<any>) {
    this.excludeBindingStrength = data.excludeBindingStrength;
    this.selectedBindingType = this.data.existingBindingType ? this.data.existingBindingType : IBindingType.VALUESET;
    this.selectedSingleCode = this.data.selectedSingleCode;
    this.selectedValueSets = this.data.selectedValueSetBinding;
    this.locationInfo = this.data.locationInfo;
  }

  submit() {
    let result: IBindingDataResult = { selectedBindingType: this.selectedBindingType };
    switch (this.selectedBindingType) {
      case IBindingType.SINGLECODE:
        result = { ...result, selectedSingleCode: this.selectedSingleCode };
        break;
      case IBindingType.VALUESET:
        result = { ...result, selectedValueSets: this.selectedValueSets };
        break;
    }
    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
  addBinding() {
    if (!this.selectedValueSets) {
      this.selectedValueSets = [];
    }
    this.editableBinding = { valueSets: [], bindingStrength: IValuesetStrength.R, bindingLocation: this.getDefaultBindinglcation() };
    this.selectedValueSets.push(this.editableBinding);
  }
  submitValueSet(binding: IValueSetBindingDisplay, vs: IDisplayElement) {
    if (!binding.valueSets.filter((x) => x.id === vs.id).length) {
      binding.valueSets.push(vs);
    }
    this.temp = null;
    this.edit = {};
  }
  addValueSet(binding: IValueSetBindingDisplay, index) {
    this.edit[index] = true;
    this.temp = null;
  }
  removeValueSet(binding: IValueSetBindingDisplay, index: number) {
    binding.valueSets.splice(index, 1);
  }
  getDefaultBindinglcation() {
    if (this.data.locationInfo.allowedBindingLocations && this.data.locationInfo.allowedBindingLocations.length === 1) {
      return [... this.data.locationInfo.allowedBindingLocations[0].value];
    } else {
      return [];
    }
  }

  ngOnInit() {
  }

  loadCodes($event) {
    this.selectedSingleCode = null;
    this.store.dispatch(new fromDAM.TurnOnLoader({ blockUI: true }));
    this.getById($event.id).subscribe(
      (x) => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
        this.currentValueSet = x;
      },
      () => {
        this.store.dispatch(new fromDAM.TurnOffLoader());
      },
    );
  }

  getById(id: string): Observable<IValueSet> {
    return this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo).pipe(
      take(1),
      mergeMap((x) => {
        return this.valueSetService.getById(x, id);
      }),
    );
  }

  selectCode(code: ICodes) {
    this.selectedSingleCode = { valueSet: this.selectedValueSet, code: code.value, codeSystem: code.codeSystem };
  }

  clearCode() {
    this.selectedSingleCode = null;
  }

  removeBinding(index: number) {
    this.selectedValueSets.splice(index, 1);
  }
}

export interface IBindingLocationItem {
  label: string;
  value: number[];
}

export interface IBindingLocationInfo {
  allowedBindingLocations: IBindingLocationItem[];
  multiple: boolean;
  coded: boolean;
  allowSingleCode: boolean;
  allowValueSets: boolean;
}

export class IValueSetBindingDisplay {
  valueSets: IDisplayElement[];
  bindingStrength: IValuesetStrength;
  bindingLocation?: number[];
}

export class ISingleCodeDisplay {
  valueSet: IDisplayElement;
  code: string;
  codeSystem: string;
}

export interface IBindingDataResult {
  selectedBindingType?: IBindingType;
  selectedSingleCode?: ISingleCodeDisplay;
  selectedValueSets?: IValueSetBindingDisplay[];
}

export interface IBindingSelectorData {
  resources: IDisplayElement[];
  locationInfo: IBindingLocationInfo;
  excludeBindingStrength: boolean;
  path?: string;
  obx2?: boolean;
  existingBindingType: IBindingType;
  selectedValueSetBinding: IValueSetBindingDisplay[];
  selectedSingleCode: ISingleCodeDisplay;
}
