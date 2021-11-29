import { Component, Input, OnInit } from '@angular/core';
import { Type } from '../../constants/type.enum';
import { IBindingContext } from '../../services/structure-element-binding.service';

export enum BindingLevel {
  MESSAGE,
  SEGMENT,
  DATATYPE,
  DATATYPE_COMPONENT,
  DATATYPE_FIELD,
  DATATYPE_SUBCOMPONENT,
}

@Component({
  selector: 'app-binding-badge',
  templateUrl: './binding-badge.component.html',
  styleUrls: ['./binding-badge.component.scss'],
})
export class BindingBadgeComponent implements OnInit {

  @Input()
  set context(c: IBindingContext) {
    switch (c.resource) {
      case Type.CONFORMANCEPROFILE:
        this.bindingLevel = BindingLevel.MESSAGE;
        break;
      case Type.SEGMENT:
        this.bindingLevel = BindingLevel.SEGMENT;
        break;
      case Type.DATATYPE:
        if (c.element === Type.COMPONENT) {
          this.bindingLevel = BindingLevel.DATATYPE_COMPONENT;
        } else if (c.element === Type.SUBCOMPONENT) {
          this.bindingLevel = BindingLevel.DATATYPE_SUBCOMPONENT;
        } else if (c.element === Type.FIELD) {
          this.bindingLevel = BindingLevel.DATATYPE_FIELD;
        } else {
          this.bindingLevel = BindingLevel.DATATYPE;
        }
        break;
    }
  }

  bindingLevel: BindingLevel;
  level = BindingLevel;

  constructor() { }

  ngOnInit() {
  }

}
