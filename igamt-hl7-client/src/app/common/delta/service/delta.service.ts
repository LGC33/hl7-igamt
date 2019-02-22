import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DeltaService {

  constructor(private $http: HttpClient) {}

  diffable(type: DiffType, ig: string, source: string, target: string): Observable<DiffableResult> {
    return this.$http.get<DiffableResult>('api/delta/' + type + '/' + ig + '/diffable/' + source + '/' + target);
  }

  delta(type: DiffType, sourceIg: string, entityId: string): Observable<EntityDelta> {
    return this.$http.get<EntityDelta>('/api/delta/' + type + '/' + sourceIg + '/' + entityId);
  }

}

export type DiffType = 'DATATYPE' | 'SEGMENT' | 'CONFORMANCEPROFILE';
export interface DiffableResult {
  diffable: boolean;
  source: any;
}

export interface EntityDelta {
  sourceDocument: any;
  sourceEntity: any;
  targetEntity: any;
  delta: any;
}
