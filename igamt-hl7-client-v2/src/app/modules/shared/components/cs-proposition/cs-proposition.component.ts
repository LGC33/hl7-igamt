import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { TreeNode } from 'primeng/primeng';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { AssertionMode, IComplement, IPath, ISimpleAssertion, ISubject } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { Hl7V2TreeService } from '../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { ICardinalityRange, IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

export interface IStatement {
  target?: {
    name: string,
    node: IHL7v2TreeNode,
    path: any,
    repeatMax: number,
  };
  compareTo?: {
    name: string,
    node: IHL7v2TreeNode,
    path: any,
    repeatMax: number,
  };
  complement?: any;
  occurence?: string;
  occurenceNumber?: number;
  verb?: string;
  statementType: StatementType;
  statement?: DeclarativeType | ComparativeType;
}

export enum OccurrenceType {
  AT_LEAST_ONE = 'atLeast',
  INSTANCE = 'instance',
  NONE = 'noOccurrence',
  ONE = 'exactlyOne',
  COUNT = 'count',
  ALL = 'all',
}

export enum VerbType {
  SHALL = 'SHALL',
  SHALL_NOT = 'SHALL NOT',
  SHOULD = 'SHOULD',
  SHOULD_NOT = 'SHOULD NOT',
  MAY = 'MAY',
  MAY_NOT = 'MAY NOT',
}

export enum DeclarativeType {
  CONTAINS_VALUE = 'containValue',
  CONTAINS_VALUE_DESC = 'containValueDesc',
  CONTAINS_CODE = 'containCode',
  CONTAINS_CODE_DESC = 'containCodeDesc',
  CONTAINS_VALUES = 'containListValues',
  CONTAINS_CODES = 'containListCodes',
  CONTAINS_REGEX = 'regex',
  CONTAINS_VALUES_DESC = 'containListValuesDesc',
  CONTAINS_CODES_DESC = 'containListCodesDesc',
  INTEGER = 'positiveInteger',
  SEQUENCE = 'sequentially',
  ISO = 'iso',
}

export enum PropositionType {
  CONTAINS_VALUE = 'containValue',
  NOT_CONTAINS_VALUE = 'notContainValue',
  CONTAINS_VALUE_DESC = 'containValueDesc',
  NOT_CONTAINS_VALUE_DESC = 'notContainValueDesc',
  CONTAINS_VALUES = 'containListValues',
  CONTAINS_VALUES_DESC = 'containListValuesDesc',
  NOT_CONTAINS_VALUES = 'notContainValues',
  NOT_CONTAINS_VALUES_DESC = 'notContainValuesDesc',
  VALUED = 'valued',
  NOT_VALUED = 'notValued',
}

export enum ComparativeType {
  IDENTICAL = 'c-identical',
  EARLIER = 'c-earlier',
  EARLIER_EQUIVALENT = 'c-earlier-equivalent',
  TRUNCATED_EARLIER = 'c-truncated-earlier',
  TRUNCATED_EARLIER_EQUIVALENT = 'c-truncated-earlier-equivalent',
  EQUIVALENT = 'c-equivalent',
  TRUNCATED_EQUIVALENT = 'c-truncated-equivalent',
  EQUIVALENT_LATER = 'c-equivalent-later',
  LATER = 'c-later',
  TRUNCATED_EQUIVALENT_LATER = 'c-truncated-equivalent-later',
  TRUNCATED_LATER = 'c-truncated-later',
}

export enum StatementType {
  DECLARATIVE = 'DECLARATIVE',
  COMPARATIVE = 'COMPARATIVE',
}

export enum ConformanceStatementType {
  STATEMENT = 'STATEMENT',
  PROPOSITION = 'PROPOSITION',
}

@Component({
  selector: 'app-cs-proposition',
  templateUrl: './cs-proposition.component.html',
  styleUrls: ['./cs-proposition.component.scss'],
})
export class CsPropositionComponent implements OnInit {

  // statement: IStatement;
  assertion: ISimpleAssertion;
  statementType: StatementType = StatementType.DECLARATIVE;
  _statementType = StatementType;
  _declarativeType = DeclarativeType;
  _comparativeType = ComparativeType;
  _propositionType = PropositionType;
  _occurrenceType = OccurrenceType;
  _csType = ConformanceStatementType;

  @Input()
  collapsed = false;

  subjectName: string;
  compareName: string;

  blank = {
    mode: AssertionMode.SIMPLE,
    complement: {
      complementKey: undefined,
      path: undefined,
      occurenceIdPath: undefined,
      occurenceLocationStr: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
      value: '',
      values: [],
      descs: [],
      desc: '',
      codesys: '',
    },
    subject: {
      path: undefined,
      occurenceIdPath: undefined,
      occurenceLocationStr: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
    },
    verbKey: '',
    description: '',
  };

  subjectRepeatMax: number;
  complementRepeatMax: number;

  csType: ConformanceStatementType;
  @Input()
  set resource(r: IResource) {
    this.res = r;
  }
  res: IResource;
  @Input()
  resourceType: Type;
  @Input()
  tree: TreeNode[];
  @Input()
  repository: AResourceRepositoryService;
  _context: IPath;
  @Output()
  valueChange: EventEmitter<ISimpleAssertion>;

  @ViewChild('statementValues', { read: NgForm }) statementValues: NgForm;
  @ViewChild('targetOccurenceValues', { read: NgForm }) targetOccurenceValues: NgForm;
  @ViewChild('compOccurenceValues', { read: NgForm }) compOccurenceValues: NgForm;

  @Input()
  set value(assertion: ISimpleAssertion) {
    this.assertion = assertion;
    if (Object.values(ComparativeType).includes(this.assertion.complement.complementKey)) {
      this.statementType = StatementType.COMPARATIVE;
    } else {
      this.statementType = StatementType.DECLARATIVE;
    }
    this.valueChange.emit(assertion);
  }

  get value() {
    return this.assertion;
  }

  @Input()
  set type(type: ConformanceStatementType) {
    this.csType = type;
  }

  @Input()
  set context(ctx: IPath) {
    this._context = ctx;
    if (this.assertion) {
      this.assertion.complement = {
        ...this.assertion.complement,
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
      };

      this.assertion.subject = {
        path: undefined,
        occurenceIdPath: undefined,
        occurenceLocationStr: undefined,
        occurenceValue: undefined,
        occurenceType: undefined,
      };
    }
  }

  get context() {
    return this._context;
  }

  occurences = [
    { label: 'At least one occurrence of', value: OccurrenceType.AT_LEAST_ONE },
    { label: 'The \'INSTANCE\' occurrence of', value: OccurrenceType.INSTANCE },
    { label: 'No occurrence of', value: OccurrenceType.NONE },
    { label: 'Exactly one occurrence of', value: OccurrenceType.ONE },
    { label: '\'COUNT\' occurrences of', value: OccurrenceType.COUNT },
    { label: 'All occurrences of', value: OccurrenceType.ALL },
  ];

  verbs = [
    { label: 'SHALL', value: VerbType.SHALL },
    { label: 'SHALL NOT', value: VerbType.SHALL_NOT },
    { label: 'SHOULD', value: VerbType.SHOULD },
    { label: 'SHOULD NOT', value: VerbType.SHOULD_NOT },
    { label: 'MAY', value: VerbType.MAY },
    // { label: 'MAY NOT', value: VerbType.MAY_NOT },
  ];

  declarative_statements = [
    { label: 'contain the value \'VALUE\'.', value: DeclarativeType.CONTAINS_VALUE },
    { label: 'contain the value \'VALUE\' (DESCRIPTION).', value: DeclarativeType.CONTAINS_VALUE_DESC },
    { label: 'contain the value \‘VALUE\’ (DESCRIPTION) drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODE_DESC },
    { label: 'contain the value \'VALUE\' drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODE },
    { label: 'contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: DeclarativeType.CONTAINS_VALUES },
    { label: 'contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: DeclarativeType.CONTAINS_VALUES_DESC },
    { label: 'contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' } drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODES },
    { label: 'contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) } drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODES_DESC },
    { label: 'match the regular expression \'REGULAR EXPRESSION\'.', value: DeclarativeType.CONTAINS_REGEX },
    { label: 'contain a positive integer.', value: DeclarativeType.INTEGER },
    // { label: 'be valued sequentially starting with the value \'1\'.', value: DeclarativeType.SEQUENCE },
    { label: 'be valued with an ISO-compliant OID.', value: DeclarativeType.ISO },
  ];

  comparative_statements = [
    { label: 'be identical to', value: ComparativeType.IDENTICAL },
    { label: 'be earlier than', value: ComparativeType.EARLIER },
    { label: 'be earlier than or equivalent to', value: ComparativeType.EARLIER_EQUIVALENT },
    { label: 'be truncated earlier than', value: ComparativeType.TRUNCATED_EARLIER },
    { label: 'be truncated earlier than or truncated equivalent to', value: ComparativeType.TRUNCATED_EARLIER_EQUIVALENT },
    { label: 'be equivalent to', value: ComparativeType.EQUIVALENT },
    { label: 'be truncated equivalent to', value: ComparativeType.TRUNCATED_EQUIVALENT },
    { label: 'be equivalent to or later than', value: ComparativeType.EQUIVALENT_LATER },
    { label: 'be later than', value: ComparativeType.LATER },
    { label: 'be truncated equivalent to or truncated later than', value: ComparativeType.TRUNCATED_EQUIVALENT_LATER },
    { label: 'be truncated later than', value: ComparativeType.TRUNCATED_LATER },
  ];

  proposition_statements = [
    { label: 'is valued', value: PropositionType.VALUED },
    { label: 'is not valued', value: PropositionType.NOT_VALUED },
    { label: 'contains the value \'VALUE\'.', value: PropositionType.CONTAINS_VALUE },
    { label: 'does not contain the value \'VALUE\'.', value: PropositionType.NOT_CONTAINS_VALUE },
    { label: 'contains the value \'VALUE\' (DESCRIPTION).', value: PropositionType.CONTAINS_VALUE_DESC },
    { label: 'does not contain the value \'VALUE\' (DESCRIPTION).', value: PropositionType.NOT_CONTAINS_VALUE_DESC },
    { label: 'contains one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: PropositionType.CONTAINS_VALUES },
    { label: 'contains one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: PropositionType.CONTAINS_VALUES_DESC },
    { label: 'does not contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: PropositionType.NOT_CONTAINS_VALUES },
    { label: 'does not contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: PropositionType.NOT_CONTAINS_VALUES_DESC },
  ];

  labelsMap = {};
  id: string;

  constructor(private treeService: Hl7V2TreeService) {
    this.assertion = Object.assign({}, this.blank);
    this.csType = ConformanceStatementType.PROPOSITION;
    this.valueChange = new EventEmitter<ISimpleAssertion>();
    this.id = Guid.create().toString();
    this.map(this.verbs);
    this.map(this.occurences);
    this.map(this.declarative_statements);
    this.map(this.comparative_statements);
    this.map(this.proposition_statements);
  }

  map(list: Array<{ label: string, value: string }>) {
    for (const item of list) {
      this.labelsMap[item.value] = item.label;
    }
  }

  statementList() {
    if (this.csType === ConformanceStatementType.PROPOSITION) {
      return this.proposition_statements;
    } else {
      if (this.statementType === StatementType.DECLARATIVE) {
        return this.declarative_statements;
      } else {
        return this.comparative_statements;
      }
    }
  }

  change() {
    combineLatest(
      this.getName(this.assertion.subject.path),
      this.getName(this.assertion.complement.path),
    ).pipe(
      take(1),
      map(([node, compNode]) => {
        const occurenceTarget = this.getOccurenceLiteral(this.assertion.subject);
        const verb = this.labelsMap[this.assertion.verbKey];
        const statement = this.getStatementLiteral(this.assertion.complement);
        const comparisonTarget = this.getOccurenceLiteral(this.assertion.complement);
        const comparison = `${comparisonTarget.toLowerCase()} ${this.valueOrBlank(compNode)}`;
        this.assertion.description = `${occurenceTarget} ${this.valueOrBlank(node)} ${this.csType === ConformanceStatementType.STATEMENT ? this.valueOrBlank(verb).toLowerCase() : ''} ${this.valueOrBlank(statement)}
        ${this.statementType === StatementType.COMPARATIVE ? comparison : ''}`;
        this.valueChange.emit(this.assertion);
      }),
    ).subscribe();
  }

  valueOrBlank(val): string {
    return val ? val : '_';
  }

  getOccurenceLiteral(elm: ISubject | IComplement): string {
    if (elm.occurenceType) {
      switch (elm.occurenceType) {
        case OccurrenceType.COUNT:
          return `${elm.occurenceValue ? elm.occurenceValue : '#'} occurrence${elm.occurenceValue > 1 ? 's' : ''} of`;
        case OccurrenceType.INSTANCE:
          return `The ${elm.occurenceValue ? this.getLiteralForNumber(elm.occurenceValue) : '#'} occurrence of`;
        default:
          return this.labelsMap[elm.occurenceType];
      }
    }
    return '';
  }

  min(a: number, b: number) {
    return a < b ? a : b;
  }

  getLiteralForNumber(nb: number) {
    switch (nb) {
      case 1: return 'first';
      case 2: return 'second';
      case 3: return 'third';
      case 4: return 'fourth';
      case 6: return 'sixth';
      case 7: return 'seventh';
      case 8: return 'eight';
      default: return '#';
    }
  }

  trackByFn(index, item) {
    return index;
  }

  getStatementLiteral(complement: IComplement): string {
    if (complement) {
      switch (complement.complementKey) {
        case DeclarativeType.CONTAINS_VALUE:
          return `contain the value \'${this.valueOrBlank(complement.value)}\'.`;
        case PropositionType.NOT_CONTAINS_VALUE:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\'.`;
        case DeclarativeType.CONTAINS_VALUE_DESC:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}).`;
        case PropositionType.NOT_CONTAINS_VALUE_DESC:
          return `does not contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}).`;
        case DeclarativeType.CONTAINS_CODE:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' drawn from the code system \'${this.valueOrBlank(complement.codesys[0])}\'.`;
        case DeclarativeType.CONTAINS_CODE_DESC:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) drawn from the code system \'${this.valueOrBlank(complement.codesys[0])}\'.`;
        case DeclarativeType.CONTAINS_VALUES:
          return `contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}].`;
        case DeclarativeType.CONTAINS_VALUES_DESC:
          const values = complement.values.map((v) => '\'' + v + '\'').map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain one of the values in the list: [${this.valueOrBlank(values.join(','))}].`;
        case PropositionType.NOT_CONTAINS_VALUES:
          return `does not contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}].`;
        case DeclarativeType.CONTAINS_CODES:
          return `contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys[0])}\'.`;
        case DeclarativeType.CONTAINS_CODES_DESC:
          const _values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain one of the values in the list: [${this.valueOrBlank(_values.join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys[0])}\'.`;
        case DeclarativeType.CONTAINS_REGEX:
          return `match the regular expression \'${this.valueOrBlank(complement.value)}\'.`;
        case PropositionType.NOT_CONTAINS_VALUES_DESC:
          const __values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `does not contain one of the values in the list: [${this.valueOrBlank(__values.join(','))}].`;
        default:
          return this.labelsMap[complement.complementKey];
      }
    }
    return '';
  }

  getStatenemtLiteral(elm: ISubject | IComplement): string {
    if (elm.occurenceType) {
      switch (elm.occurenceType) {
        case OccurrenceType.COUNT:
          return `${elm.occurenceValue ? elm.occurenceValue : '#'} occurrences of`;
        case OccurrenceType.INSTANCE:
          return `The \'${elm.occurenceValue ? elm.occurenceValue : '#'}\' occurrence of`;
      }
    }
    return '';
  }

  complete() {
    return this.targetOccurenceValid() && this.targetNodeValid() && this.verbValid() && this.statementValid() && this.comparisonOccurenceValid() && this.comparisonNodeValid();
  }

  targetOccurenceValid() {
    if (this.targetOccurenceValues && (this.assertion.subject && this.assertion.subject.occurenceType) || this.subjectRepeatMax > 0) {
      return !!this.assertion.subject.occurenceType && !!this.targetOccurenceValues.valid;
    } else {
      return true;
    }
  }

  targetNodeValid() {
    return this.nodeValid(this.assertion.subject);
  }

  nodeValid(elm: ISubject | IComplement) {
    return !!elm.path && !!elm.occurenceIdPath;
  }

  verbValid() {
    if (this.csType === this._csType.STATEMENT) {
      return this.assertion.verbKey;
    } else {
      return true;
    }
  }

  statementValid() {
    return !!this.assertion.complement.complementKey && !!this.statementValues.valid;
  }

  comparisonOccurenceValid() {
    if (this.compOccurenceValues && this.statementType === this._statementType.COMPARATIVE && (this.assertion.complement && this.assertion.complement.occurenceType) || this.complementRepeatMax > 0) {
      return !!this.assertion.complement.occurenceType && !!this.compOccurenceValues.valid;
    } else {
      return true;
    }
  }

  comparisonNodeValid() {
    if (this.statementType === this._statementType.COMPARATIVE) {
      return this.nodeValid(this.assertion.complement);
    } else {
      return true;
    }
  }

  switchStatementType() {
    this.complementRepeatMax = 0;
    this.assertion.complement = {
      complementKey: undefined,
      path: undefined,
      occurenceIdPath: undefined,
      occurenceLocationStr: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
      value: '',
      values: [],
      desc: '',
      descs: [],
      codesys: '',
    };
  }

  targetElement(event) {
    this.changeElement(event, this.assertion.subject);
    this.getName(this.treeService.concatPath(this.context, event.path)).pipe(
      take(1),
      map((name) => {
        this.subjectName = name;
      }),
    ).subscribe();
    this.subjectRepeatMax = this.repeatMax(event.node.data.cardinality);
  }

  comparativeElement(event) {
    this.changeElement(event, this.assertion.complement);
    this.getName(this.treeService.concatPath(this.context, event.path)).pipe(
      take(1),
      map((name) => {
        this.compareName = name;
      }),
    ).subscribe();
    this.complementRepeatMax = this.repeatMax(event.node.data.cardinality);
  }

  changeElement(event, elm: ISubject | IComplement) {
    elm.path = this.treeService.concatPath(this.context, event.path);
    elm.occurenceIdPath = event.node.data.id;
    elm.occurenceValue = undefined;
    elm.occurenceType = undefined;
    this.change();
  }

  getName(path: IPath): Observable<string> {
    if (!path) {
      return of('');
    }

    return this.treeService.getPathName(this.res, this.repository, path.child).pipe(
      take(1),
      map((pathInfo) => {
        return this.treeService.getNameFromPath(pathInfo);
      }),
    );
  }

  repeatMax(cardinality: ICardinalityRange) {
    if (!cardinality) {
      return 0;
    } else if (cardinality.max === '*') {
      return Number.MAX_VALUE;
    } else if (+cardinality.max === 1) {
      return 0;
    } else {
      return +cardinality.max;
    }
  }

  changeStatement() {
    this.assertion.complement = {
      ...this.assertion.complement,
      value: '',
      values: [],
      codesys: '',
      desc: '',
      descs: [],
    };
    this.change();
  }

  changeStatementType() {
    this.assertion.complement = {
      ...this.assertion.complement,
      path: undefined,
      occurenceIdPath: undefined,
      occurenceLocationStr: undefined,
      occurenceValue: undefined,
      occurenceType: undefined,
      complementKey: undefined,
      value: '',
      values: [],
      codesys: '',
      desc: '',
      descs: [],
    };
    this.complementRepeatMax = 0;
    this.change();
  }

  removeStr(list: any[], i: number) {
    list.splice(i, 1);
    this.change();
  }

  addStr(list: any[]) {
    list.push('');
    this.change();
  }

  removeStrDesc(list: any[], descs: any[], i: number) {
    list.splice(i, 1);
    descs.splice(i, 1);
    this.change();
  }

  addStrDesc(list: any[], descs: any[]) {
    list.push('');
    descs.push('');
    this.change();
  }

  ngOnInit() {
  }

}
