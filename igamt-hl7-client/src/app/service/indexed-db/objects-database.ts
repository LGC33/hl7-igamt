import Dexie from 'dexie';

export class IObject {
  id?: string;
  metadata?: object;
  structure?: object;
  preDef?: object;
  postDef?: object;
  crossReference?: object;
  conformanceStatements?: object;
}

export class Section {
  id?: string;
  description?: object;
  oldParent?: string;
  newParent?: string;
  position?: number;
  changeType?: string;
}

export class ObjectsDatabase extends Dexie {

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '&id',
      segments: '&id',
      sections: '&id,changeType',
      profileComponents: '&id',
      conformanceProfiles: '&id',
      compositeProfiles: '&id',
      valuesets: '&id'
    });
  }
}
