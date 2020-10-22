import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Icons } from '../../constants/icons.enum';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';
import { SubMenu } from '../../models/sub-menu.class';

@Component({
  selector: 'app-toc-sub-menu',
  templateUrl: './toc-sub-menu.component.html',
  styleUrls: ['./toc-sub-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocSubMenuComponent implements OnInit {
  @Input() element: IDisplayElement;

  @Input() delta: boolean;
  items: SubMenu[];
  constructor() {
  }

  ngOnInit() {
    if (this.element.type) {
      this.items = this.getMenuItems();
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  getMenuItems() {
    const type = this.element.type.toLowerCase();
    const ret: SubMenu[] = [];
    if (type === Type.COCONSTRAINTGROUP.toLowerCase()) {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Table', Icons.TABLE));
    } else {
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'metadata', 'Metadata', Icons.EDIT));
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'pre-def', 'Pre-definition', Icons.PRE));
      if (type !== Type.VALUESET.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Structure', Icons.TABLE));
      } else {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'structure', 'Value Set Definition', Icons.TABLE));
      }
      ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'post-def', 'Post-definition', Icons.POST));

      if (type !== Type.VALUESET.toLowerCase()) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'conformance-statement', 'Conformance statements', Icons.TABLE));
      }
      if (type === Type.SEGMENT.toLocaleLowerCase() && this.element.fixedName === 'OBX') {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'dynamic-mapping', 'Dynamic Mapping', Icons.LIST));
      }
      if (type === 'conformanceprofile') {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'co-constraint', 'Co-Constraints', Icons.TABLE));
      }
    }
    ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'cross-references', 'Cross references', Icons.LIST));

    if (this.element.origin) {

      if (this.isDateAndTime() ) {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'delta', 'Delta', Icons.LIST));
      } else {
        ret.push(new SubMenu('./' + type + '/' + this.element.id + '/' + 'dtm-delta', 'Delta', Icons.LIST));
      }
    }
    return ret;
  }
  isDateAndTime() {
    return this.element.fixedName === 'DT' || this.element.fixedName === 'TM' || this.element.fixedName === 'DTM' ;
  }
}
