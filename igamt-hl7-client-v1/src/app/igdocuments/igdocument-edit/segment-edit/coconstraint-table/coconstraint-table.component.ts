/**
 * Created by hnt5 on 10/3/17.
 */

import {Component, Input, ViewChild, TemplateRef, OnInit} from '@angular/core';
import {
  CoConstraintTable, CCSelectorType, CCHeader, CellTemplate, VSCell, CCRow, CCGroup
} from './coconstraint.domain';
import {CCHeaderDialogDmComponent} from './header-dialog/header-dialog-dm.component';
import {CoConstraintTableService} from './coconstraint-table.service';
import {CCHeaderDialogUserComponent} from './header-dialog/header-dialog-user.component';
import {ValueSetBindingPickerComponent} from '../../../../common/valueset-binding-picker/valueset-binding-picker.component';
import {ActivatedRoute} from '@angular/router';
import {TocService} from '../../service/toc.service';
import {GeneralConfigurationService} from '../../../../service/general-configuration/general-configuration.service';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
import {WithSave} from '../../../../guards/with.save.interface';

@Component({
  selector: 'app-coconstraint-table',
  templateUrl: 'coconstraint-table.template.html',
  styleUrls: ['coconstraint-table.component.css']
})

export class CoConstraintTableComponent implements OnInit, WithSave {


  @ViewChild(ValueSetBindingPickerComponent) vsPicker: ValueSetBindingPickerComponent;
  @ViewChild(CCHeaderDialogDmComponent) headerDialogDm: CCHeaderDialogDmComponent;
  @ViewChild(CCHeaderDialogUserComponent) headerDialogUser: CCHeaderDialogUserComponent;

  @ViewChild('empty')
  empty: TemplateRef<any>;
  @ViewChild('value')
  value: TemplateRef<any>;
  @ViewChild('valueset')
  valueset: TemplateRef<any>;
  @ViewChild('datatype')
  datatype: TemplateRef<any>;
  @ViewChild('flavor')
  flavor: TemplateRef<any>;
  @ViewChild('textArea')
  textArea: TemplateRef<any>;
  @ViewChild('code')
  code: TemplateRef<any>;
  @ViewChild('varies')
  varies: TemplateRef<any>;
  @ViewChild('ccForm')
  ccFormVar;

  dndGroups: boolean;
  table: CoConstraintTable;
  tableId: any;
  display: any;
  config: any;
  activeType: string;
  ceBindingLocations: any;
  _segment: any;
  backUp: CoConstraintTable;

  constructor(private ccTableService: CoConstraintTableService,
              private configService: GeneralConfigurationService,
              private route: ActivatedRoute,
              private tocService: TocService,
              private http: HttpClient) {


  }

  @Input() set segment(value: any) {
    this._segment = value;
    const ctrl = this;
    this.ccTableService.getCCTableForSegment(this._segment).then(function (display) {
      ctrl.display = display;
      ctrl.table = ctrl.display.data;
      ctrl.backUp = _.cloneDeep(ctrl.table);
      if (ctrl.table.segment === 'OBX') {
        ctrl.config.dynCodes = [];

        ctrl.ccTableService.get_bound_codes(ctrl._segment).then(function (codes) {
          for (const code of codes) {
            if (code.usage !== 'E') {
              ctrl.config.dynCodes.push({label: code.value, value: code.value});
            }
          }
          ctrl.tocService.getDataypeList().then(function (dtList: any[]) {
            for (const dt of dtList) {
              ctrl.config.datatypes.push({label: dt.data.label, value: dt.id, display : dt.data});
            }
            ctrl.config.dynCodes = ctrl.filterDynCodeFromIg(ctrl.config.datatypes, ctrl.config.dynCodes).sort((a, b) => {
              return 0 - (a.value > b.value ? -1 : 1);
            });

          });
        });
      }
    });
  }

  exportExcel() {
    window.open('api/segments/'+ this.table.id +'/coconstraints/export', '_blank');
  }
  
  filterDynCodeFromIg(datatypes, codes) {
    const filtered = [];

    for (const code of codes) {
      for (const dt of datatypes) {
        if (dt.display.label === code.value) {
          filtered.push(code);
          break;
        }
      }
    }
    return filtered;
  }

  getCodes(id: string) {
    return this.http.get('api/valueset/' + id);
  }

  // ------ DND -----

  removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  headerDrop($event) {
    $event.event.preventDefault();
  }

  // ------ TEMPLATE -----

  headWidth(empty: boolean, x: number) {
    if (!empty) {
      return 'initial';
    } else {
      return 200 + x * 250;
    }
  }

  groupHeaderSize(table) {
    const data = table.headers.data.length === 0 ? 1 : table.headers.data.length;
    const selector = table.headers.selectors.length === 0 ? 1 : table.headers.selectors.length;
    const user = table.headers.user.length === 0 ? 1 : table.headers.user.length;
    return data + selector + user;
  }

  cTemplate(node: CCHeader) {
    if (node) {
      switch (node.template) {
        case CellTemplate.DATATYPE :
          return this.datatype;
        case CellTemplate.FLAVOR :
          return this.flavor;
        case CellTemplate.TEXTAREA :
          return this.textArea;
        case CellTemplate.VARIES :
          return this.varies;
        default :
          switch (node.content.type) {
            case CCSelectorType.VALUE :
              return this.value;
            case CCSelectorType.VALUESET :
              return this.valueset;
            case CCSelectorType.CODE :
              return this.code;
            default :
              return this.empty;
          }
      }
    }
  }

  isIgnore(node) {
    return node.type === CCSelectorType.IGNORE;
  }

  setVariesNodeValue(obj, key, node, value) {
    this.clearVariesNodeValue(obj, key, node);
    switch (value) {
      case 'value' :
        obj[key].type = CCSelectorType.VALUE;
        break;
      case 'vs' :
        obj[key].type = CCSelectorType.VALUESET;
        break;
      case 'code' :
        obj[key].type = CCSelectorType.CODE;
        break;
    }
  }

  clearVariesNodeValue(obj, key, node) {
    obj[key] = {
      type : CCSelectorType.IGNORE
    };
  }

  // ------ DIALOGS ------

  openVSDialog(obj: any, key: string, field: CCHeader) {
    console.log(obj);
    this.vsPicker.open({
      libraryId: this.tableId,
      selectedTables: (<VSCell> obj[key]).vs,
      complex: field.content.complex,
      coded: field.content.coded,
      version: field.content.version,
      varies: field.content.varies
    }).subscribe(
      result => {
        if ((<VSCell> obj[key]).vs !== result) this.ccFormVar.form.markAsDirty();
        (<VSCell> obj[key]).vs = result;

      }
    );
  }

  selectedPaths() {
    const paths: any[] = [];

    for (const h of this.table.headers.data) {
      if (h.content.type !== CCSelectorType.IGNORE) {
        paths.push({path: h.content.path, type: h.content.type});
      }
    }
    for (const h of this.table.headers.selectors) {
      if (h.content.type !== CCSelectorType.IGNORE) {
        paths.push({path: h.content.path, type: h.content.type});
      }
    }

    return paths;
  }

  openHeaderDialog(h: string) {
    const resolve = {
      header: h,
      selectedPaths: this.selectedPaths(),
      type: null,
      fixed: false
    };

    if (h === 'selectors') {
      resolve.type = CCSelectorType.VALUE;
      resolve.header = 'IF';
      resolve.fixed = true;
    } else if (h === 'data') {
      resolve.header = 'THEN';
    }

    this.headerDialogDm.open(resolve).subscribe(
      result => {
        this.ccFormVar.form.markAsDirty();
        this.table.headers[h].push(result);
        this.initColumn(result);
      }
    );
  }

  openUserHeaderDialog() {
    this.headerDialogUser.open({header: 'USER'}).subscribe(
      result => {
        this.ccFormVar.form.markAsDirty();
        this.table.headers.user.push(result);
        this.initColumn(result);
      }
    );
  }

  // ------- TABLE CONTROLS -------

  delCol(list: any[], i: number, column: string) {
    this.reqDel(this.table, column);
    list.splice(i, 1);
  }

  reqDel(obj, key) {
    if (obj.content.free) {
      for (const cc of obj.content.free) {
        delete cc[key];
      }
    }
    if (obj.content.groups) {
      for (const gr of obj.content.groups) {
        this.reqDel(gr, key);
      }
    }
  }

  delRow(list: any[], i: number) {
    list.splice(i, 1);
  }

  addCc(list: any[]) {
    list.push(this.ccTableService.new_line(this.table.headers.selectors, this.table.headers.data, this.table.headers.user));
  }

  initColumn(obj) {

    const ctrl = this;
    const initReq = function (table) {
      if (table.content.free) {
        for (const cc of table.content.free) {
          ctrl.ccTableService.init_cell(cc, obj);
        }
      }
      if (table.content.groups) {
        for (const grp of table.content.groups) {
          initReq(grp);
        }
      }
    };
    initReq(this.table);
  }

  addCcGroup() {
    this.table.content.groups.push({
      data: {
        name: '',
        requirements: {
          usage: 'R',
          cardinality: {
            min: 1,
            max: '1'
          }
        }
      },
      content: {
        free: []
      }
    });
  }

  delGroup(list: any[], i: number) {
    list.splice(i, 1);
  }

  dtChange(node) {
    node.value = '';
  }

  getLocationForCoded(version) {
    return this.configService.getValuesetLocationsForCE(version);
  }

  ngOnInit() {

    const ctrl = this;
    this.route.data.map(data => data.segment).subscribe(x => {
      ctrl.segment = x;
    });

    this.activeType = 'data';
    this.table = {
      id: '',
      supportGroups: true,
      segment: 'OBX',
      headers: {
        selectors: [],
        data: [],
        user: []
      },
      content: {
        free: [],
        groups: []
      },
    };
    this.ceBindingLocations = this.configService.getAllValuesetLocations();
    console.log(this.ceBindingLocations);
    this.config = {
      usages: [
        {
          label: 'R',
          value: 'R'
        },
        {
          label: 'O',
          value: 'O'
        }
      ],
      dynCodes: [],
      datatypes: []
    };

  }

  getBackup(): any {
    return this.backUp;
  }

  getCurrent(): any {
    return this.table;
  }

  canSave(): boolean {
    return  this.display&&!this.display.readOnly;
  }

  reset(): any {
    this.table = _.cloneDeep(this.getBackup());
  }

  save(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ccTableService.saveCoConstraintTable(this.table, this._segment.id).then((result) => {
        this.ccFormVar.form.markAsPristine();
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  saveButton() {
    const ctrl = this;
    this.save().then(function (data) {
      ctrl.table = data.data;
      ctrl.backUp = data.data;
    },
    function (reject) {

    });
  }

  hasChanged(): boolean {
    return this.ccFormVar && this.ccFormVar.dirty;
  }
}


