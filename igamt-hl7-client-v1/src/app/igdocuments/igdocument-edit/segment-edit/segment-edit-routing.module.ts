/**
 * Created by hnt5 on 10/23/17.
 */
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SegmentEditMetadataComponent} from './segment-metadata/segment-edit-metadata.component';
import {SegmentEditPredefComponent} from './segment-predef/segment-edit-predef.component';
import {SegmentEditPostdefComponent} from './segment-postdef/segment-edit-postdef.component';
import {SegmentEditStructureComponent} from './segment-structure/segment-edit-structure.component';
import {SegmentEditConformanceStatementsComponent} from './segment-conformancestatements/segment-edit-conformancestatements.component';
import {SegmentEditMetadatResolver} from './segment-metadata/segment-edit-metadata.resolver';
import {SegmentEditStructureResolver} from './segment-structure/segment-edit-structure.resolver';
import {SegmentEditPredefResolver} from './segment-predef/segment-edit-predef.resolver';
import {SegmentEditPostdefResolver} from './segment-postdef/segment-edit-postdef.resolver';
import {SegmentEditConformanceStatementsResolver} from './segment-conformancestatements/segment-edit-conformancestatements.resolver';
import {SaveFormsGuard} from '../../../guards/save.guard';
import {CoConstraintTableComponent} from './coconstraint-table/coconstraint-table.component';
import {SegmentCrossRefComponent} from "./segment-cross-ref/segment-cross-ref.component";
import {SegmentCrossRefResolver} from "./segment-cross-ref/segment-cross-ref.resolver";
import {SegmentEditDynamicMappingResolver} from "./segment-dynamicmapping/segment-edit-dynamicmapping.resolver";
import {SegmentEditDynamicMappingComponent} from "./segment-dynamicmapping/segment-edit-dynamicmapping.component";
import {DeltaResolver} from '../../../common/delta/service/delta.resolver';
import {SegmentDeltaComponent} from './segment-delta/segment-delta.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':segmentId',
        redirectTo: ':segmentId/structure'
      },
      {
        path: ':segmentId/metadata',
        component: SegmentEditMetadataComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentMetadata: SegmentEditMetadatResolver}
      },
      {
        path: ':segmentId/delta',
        component: SegmentDeltaComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {delta: DeltaResolver}
      },
      {
        path: ':segmentId/preDef',
        component: SegmentEditPredefComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentPredef: SegmentEditPredefResolver}
      },
      {
        path: ':segmentId/structure',
        component: SegmentEditStructureComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentStructure: SegmentEditStructureResolver}
      },
      {
        path: ':segmentId/postDef',
        component: SegmentEditPostdefComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentPostdef: SegmentEditPostdefResolver}
      },
      {
        path: ':segmentId/coConstraint',
        component: CoConstraintTableComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segment: SegmentEditStructureResolver}
      },
      {
        path: ':segmentId/conformanceStatement',
        component: SegmentEditConformanceStatementsComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentConformanceStatements: SegmentEditConformanceStatementsResolver, segmentStructure: SegmentEditStructureResolver}
      },
      {
        path: ':segmentId/crossRef', component: SegmentCrossRefComponent,resolve: { refs : SegmentCrossRefResolver}
      },
      {
        path: ':segmentId/dynamicMapping',
        component: SegmentEditDynamicMappingComponent,
        canDeactivate: [SaveFormsGuard],
        resolve: {segmentDynamicMapping: SegmentEditDynamicMappingResolver}
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SegmentEditRoutingModule {
}
