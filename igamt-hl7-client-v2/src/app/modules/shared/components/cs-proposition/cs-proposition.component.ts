import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { TreeNode } from 'primeng/primeng';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { Type } from '../../constants/type.enum';
import { ComparativeType, ConformanceStatementType, DeclarativeType, OccurrenceType, PropositionType, StatementType, VerbType } from '../../models/conformance-statements.domain';
import { AssertionMode, IComplement, IPath, ISimpleAssertion, ISubject } from '../../models/cs.interface';
import { IResource } from '../../models/resource.interface';
import { ElementNamingService, IPathInfo } from '../../services/element-naming.service';
import { PathService } from '../../services/path.service';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { IHL7v2TreeFilter, RestrictionCombinator, RestrictionType } from '../../services/tree-filter.service';
import { ICardinalityRange, IHL7v2TreeNode } from '../hl7-v2-tree/hl7-v2-tree.component';

@Component({
  selector: 'app-cs-proposition',
  templateUrl: './cs-proposition.component.html',
  styleUrls: ['./cs-proposition.component.scss'],
})
export class CsPropositionComponent implements OnInit {

  _assertion: BehaviorSubject<{
    value: ISimpleAssertion;
    is: boolean;
  }>;
  statementType: StatementType = StatementType.DECLARATIVE;
  _statementType = StatementType;
  _declarativeType = DeclarativeType;
  _comparativeType = ComparativeType;
  _propositionType = PropositionType;
  _occurrenceType = OccurrenceType;
  _csType = ConformanceStatementType;
  _context: BehaviorSubject<{
    path: IPath;
    is: boolean;
  }>;
  _tree: TreeNode[];

  res: IResource;
  subject: {
    name: string,
    node: IHL7v2TreeNode,
    valid: boolean,
  };

  compare: {
    name: string,
    node: IHL7v2TreeNode,
    valid: boolean,
  };

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
      codesyses: [],
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

  subjectIsComplex: boolean;
  subjectRepeatMax: number;
  complementRepeatMax: number;

  csType: ConformanceStatementType;
  @Input()
  set resource(r: IResource) {
    this.res = r;
  }

  treeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [],
  };

  @Input()
  set excludePaths(paths: string[]) {
    this.treeFilter.restrictions.push(
      {
        criterion: RestrictionType.PATH,
        allow: false,
        value: paths.map((path) => {
          return {
            path,
            excludeChildren: true,
          };
        }),
      },
    );
  }

  @Input()
  predicateMode: boolean;
  @Input()
  resourceType: Type;
  @Input()
  collapsed = false;
  @Input()
  set tree(t: TreeNode[]) {
    this._tree = t;
  }
  get tree() {
    return this._tree;
  }

  @Input()
  repository: AResourceRepositoryService;
  @Output()
  valueChange: EventEmitter<ISimpleAssertion>;

  @ViewChild('statementValues', { read: NgForm }) statementValues: NgForm;
  @ViewChild('targetOccurenceValues', { read: NgForm }) targetOccurenceValues: NgForm;
  @ViewChild('compOccurenceValues', { read: NgForm }) compOccurenceValues: NgForm;

  @Input()
  set value(assertion: ISimpleAssertion) {
    this.assertion = assertion;
    if (Object.values(ComparativeType).includes(this.assertion.complement.complementKey as ComparativeType)) {
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
    if (this.csType === ConformanceStatementType.STATEMENT) {
      this.treeFilter.restrictions.push(
        {
          criterion: RestrictionType.PRIMITIVE,
          combine: RestrictionCombinator.ENFORCE,
          allow: true,
          value: true,
        },
      );
    }
  }

  @Input()
  set context(ctx: IPath) {
    this._context.next({ path: ctx, is: true });
  }

  get context() {
    return this._context.getValue().path;
  }

  set assertion(value: ISimpleAssertion) {
    this._assertion.next({
      value,
      is: true,
    });
  }

  get assertion() {
    return this._assertion.getValue().value;
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
    { label: 'be valued sequentially starting with the value \'1\'.', value: DeclarativeType.SEQUENCE },
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

  complex_statements_allowed: string[] = [
    PropositionType.VALUED,
    PropositionType.NOT_VALUED,
  ];

  labelsMap = {};
  id: string;

  constructor(
    private elementNamingService: ElementNamingService,
    private pathService: PathService,
  ) {
    this.csType = ConformanceStatementType.PROPOSITION;
    this.valueChange = new EventEmitter<ISimpleAssertion>();
    this.id = Guid.create().toString();
    this.map(this.verbs);
    this.map(this.occurences);
    this.map(this.declarative_statements);
    this.map(this.comparative_statements);
    this.map(this.proposition_statements);
    this._context = new BehaviorSubject<any>({
      path: undefined,
      is: false,
    });
    this._assertion = new BehaviorSubject<any>({
      value: undefined,
      is: false,
    });
    this.assertion = Object.assign({}, this.blank);
    combineLatest(
      this._context.asObservable().pipe(filter((value) => value.is), map((value) => value.path)),
      this._assertion.asObservable().pipe(filter((value) => value.is), map((value) => value.value)),
    ).pipe(
      tap(([context, assertion]) => {
        this.setSubject(context, assertion);
        this.setCompare(context, assertion);
      }),
    ).subscribe();
  }

  getNameFullPath(pre: IPath, post: IPath): Observable<{
    name: string;
    nodeInfo: IPathInfo;
  }> {
    return this.getName(this.pathService.straightConcatPath(pre, post));
  }

  setSubject(context: IPath, assertion: ISimpleAssertion, node?: IHL7v2TreeNode) {
    this.subject = {
      name: '',
      valid: false,
      node,
    };

    try {
      this.getNameFullPath(context, assertion.subject.path).pipe(
        take(1),
        map((info) => {
          this.subject = {
            name: info.name,
            valid: true,
            node: undefined,
          };
          if (info.nodeInfo) {
            this.subjectIsComplex = !info.nodeInfo.leaf;
          }
        }),
      ).subscribe();
    } catch (e) {
      console.error(e);
    }
  }

  setCompare(context: IPath, assertion: ISimpleAssertion, node?: IHL7v2TreeNode) {
    this.compare = {
      name: '',
      valid: false,
      node,
    };

    if (assertion.complement.path) {
      try {
        this.getNameFullPath(context, assertion.subject.path).pipe(
          take(1),
          map((info) => {
            this.compare = {
              name: info.name,
              valid: true,
              node: undefined,
            };
          }),
        ).subscribe();
      } catch (e) {
        console.error(e);
      }
    }
  }

  map(list: Array<{ label: string, value: string }>) {
    for (const item of list) {
      this.labelsMap[item.value] = item.label;
    }
  }

  statementList() {
    if (this.csType === ConformanceStatementType.PROPOSITION) {
      return this.proposition_statements.filter((st) => {
        if (this.subjectIsComplex) {
          return this.complex_statements_allowed.indexOf(st.value) !== -1;
        } else {
          return true;
        }
      });
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
      this.getNameFullPath(this.context, this.assertion.subject.path),
      this.getNameFullPath(this.context, this.assertion.complement.path),
    ).pipe(
      take(1),
      map(([node, compNode]) => {
        const occurenceTarget = this.getOccurenceLiteral(this.assertion.subject);
        const verb = this.labelsMap[this.assertion.verbKey];
        const statement = this.getStatementLiteral(this.assertion.complement);
        const comparisonTarget = this.getOccurenceLiteral(this.assertion.complement);
        const comparison = `${comparisonTarget.toLowerCase()} ${this.valueOrBlank(compNode.name)}`;
        this.assertion.description = `${occurenceTarget} ${this.valueOrBlank(node.name)} ${this.csType === ConformanceStatementType.STATEMENT ? this.valueOrBlank(verb).toLowerCase() : ''} ${this.valueOrBlank(statement)} ${this.statementType === StatementType.COMPARATIVE ? comparison : ''}`;
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
          return `contain the value \'${this.valueOrBlank(complement.value)}\' drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODE_DESC:
          return `contain the value \'${this.valueOrBlank(complement.value)}\' (${this.valueOrBlank(complement.desc)}) drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
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
          return `contain one of the values in the list: [${this.valueOrBlank(complement.values.map((v) => '\'' + v + '\'').join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
        case DeclarativeType.CONTAINS_CODES_DESC:
          const _values = complement.values.map((v) => `\'${v}\'`).map((val, i) => {
            return `${val} (${complement.descs[i]})`;
          });
          return `contain one of the values in the list: [${this.valueOrBlank(_values.join(','))}] drawn from the code system \'${this.valueOrBlank(complement.codesys)}\'.`;
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
    return this.nodeValid(this.assertion.subject) && this.subject.valid;
  }

  nodeValid(elm: ISubject | IComplement) {
    return !!elm.path && !!elm.occurenceIdPath;
  }

  pathValid(context: IPath, path: IPath) {
    const ctx = this.pathService.pathToString(context);
    const elm = this.pathService.pathToString(path);
    return elm.startsWith(ctx);
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
      return this.nodeValid(this.assertion.complement) && this.subject.valid;
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
      codesyses: [],
    };
  }

  targetElement(event) {
    this.changeElement(event, this.assertion.subject);
    this.setSubject(this.context, this.assertion, event.node);
    this.subjectRepeatMax = this.getNodeRepeatMax(event.node);
  }

  getNodeRepeatMax(node: IHL7v2TreeNode) {
    const nodeRepeat = this.repeatMax(node.data.cardinality);
    if (nodeRepeat > 0) {
      return nodeRepeat;
    }

    if (node.data.type === Type.COMPONENT || node.data.type === Type.SUBCOMPONENT) {
      const field = this.getFieldFrom(node);
      if (field) {
        return this.repeatMax(field.data.cardinality);
      }
    }

    return 0;
  }

  getFieldFrom(node: IHL7v2TreeNode): IHL7v2TreeNode {
    if (!node) {
      return node;
    }

    if (node.data.type === Type.FIELD) {
      return node;
    }

    return this.getFieldFrom(node.parent);
  }

  comparativeElement(event) {
    this.changeElement(event, this.assertion.complement);
    this.setCompare(this.context, this.assertion, event.node);
    this.complementRepeatMax = this.getNodeRepeatMax(event.node);
  }

  changeElement(event, elm: ISubject | IComplement) {
    elm.path = this.pathService.trimPathRoot(event.path);
    elm.occurenceIdPath = event.node.data.id;
    elm.occurenceValue = undefined;
    elm.occurenceType = undefined;

    if (!event.node.leaf && this.assertion.complement.complementKey && this.complex_statements_allowed.indexOf(this.assertion.complement.complementKey) === -1) {
      this.assertion.complement.complementKey = undefined;
      this.changeStatement();
    }

    this.change();
  }

  getName(path: IPath): Observable<{ name: string, nodeInfo: IPathInfo }> {
    if (!path) {
      return of({ name: '', nodeInfo: undefined });
    }

    return this.elementNamingService.getPathInfoFromPath(this.res, this.repository, path).pipe(
      take(1),
      map((pathInfo) => {
        const name = this.elementNamingService.getStringNameFromPathInfo(pathInfo);
        const nodeInfo = this.getLeaf(pathInfo);
        return {
          name,
          nodeInfo,
        };
      }),
    );
  }

  getLeaf(pInfo: IPathInfo): IPathInfo {
    if (!pInfo.child) {
      return pInfo;
    } else {
      return this.getLeaf(pInfo.child);
    }
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
      codesyses: [],
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
      codesyses: [],
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
