import { IBindingContext } from '../services/structure-element-binding.service';
export interface IChange<T = any> {
  location: string;
  propertyType: PropertyType;
  propertyValue: T;
  oldPropertyValue?: T;
  position?: number;
  changeType: ChangeType;
}

export interface IChangeReason {
  reason: string;
  date: Date;
}

export interface IChangeLog {
  [type: string]: IChangeReason;
}

export interface ILocationChangeLog {
  [type: string]: Array<{
    context: IBindingContext,
    log: IChangeReason;
  }>;
}

export enum ChangeType {
  UPDATE = 'UPDATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum PropertyType {
  USAGE = 'USAGE',
  DATATYPE = 'DATATYPE',
  SEGMENTREF = 'SEGMENTREF',
  STRUCTSEGMENT = 'STRUCTSEGMENT',
  CARDINALITYMAX = 'CARDINALITYMAX',
  LENGTHMIN = 'LENGTHMIN',
  LENGTHMAX = 'LENGTHMAX',
  LENGTHTYPE = 'LENGTHTYPE',
  FIELD = 'FIELD',
  CONFLENGTH = 'CONFLENGTH',
  CARDINALITYMIN = 'CARDINALITYMIN',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  VALUESET = 'VALUESET',
  COMMENT = 'COMMENT',
  DEFINITIONTEXT = 'DEFINITIONTEXT',
  EXT = 'EXT',
  DESCRIPTION = 'DESCRIPTION',
  AUTHORNOTES = 'AUTHORNOTES',
  USAGENOTES = 'USAGENOTES',
  CONSTANTVALUE = 'CONSTANTVALUE',
  PREDICATE = 'PREDICATE',
  CODES = 'CODES',
  CODESYSTEM = 'CODESYSTEM',
  EXTENSIBILITY = 'EXTENSIBILITY',
  CONTENTDEFINITION = 'CONTENTDEFINITION',
  STABILITY = 'STABILITY',
  BINDINGIDENTIFIER = 'BINDINGIDENTIFIER',
  URL = 'URL',
  INTENSIONALCOMMENT = 'INTENSIONALCOMMENT',
  STATEMENT = 'STATEMENT',
  SINGLECODE = 'SINGLECODE',
  NAME = 'NAME',
  AUTHORS = 'AUTHORS',
  PROFILETYPE = 'PROFILETYPE',
  ROLE = 'ROLE',
  PROFILEIDENTIFIER = 'PROFILEIDENTIFIER',
  COCONSTRAINTBINDINGS = 'COCONSTRAINTBINDINGS',
  COCONSTRAINTBINDING_CONTEXT = 'COCONSTRAINTBINDING_CONTEXT',
  COCONSTRAINTBINDING_SEGMENT = 'COCONSTRAINTBINDING_SEGMENT',
  COCONSTRAINTBINDING_CONDITION = 'COCONSTRAINTBINDING_CONDITION',
  COCONSTRAINTBINDING_TABLE = 'COCONSTRAINTBINDING_TABLE',
  COCONSTRAINTBINDING_HEADER = 'COCONSTRAINTBINDING_HEADER',
  COCONSTRAINTBINDING_GROUP = 'COCONSTRAINTBINDING_GROUP',
  COCONSTRAINTBINDING_ROW = 'COCONSTRAINTBINDING_ROW',
  COCONSTRAINTBINDING_CELL = 'COCONSTRAINTBINDING_CELL',
  ORGANISATION = 'ORGANISATION',
  DTMSTRUC = 'DTMSTRUC',
  SHORTDESCRIPTION = 'SHORTDESCRIPTION',
  DYNAMICMAPPINGITEM = 'DYNAMICMAPPINGITEM',
  DISPLAYNAME = 'DISPLAYNAME',
  CHANGEREASON = 'CHANGEREASON',
  CSCHANGEREASON = 'CSCHANGEREASON',
  FLAVORSEXTENSION = 'FLAVORSEXTENSION',
  DYNAMICMAPPING = 'DYNAMICMAPPING',
}
