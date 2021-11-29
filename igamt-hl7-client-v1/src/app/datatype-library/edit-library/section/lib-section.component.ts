import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import * as _ from 'lodash';

import {TocService} from "../service/toc.service";
import {NgForm} from "@angular/forms";
import {WithSave} from "../../../guards/with.save.interface";
import {HasFroala} from "../../../configuration/has-froala";
import {LibErrorService} from "../lib-error/lib-error.service";

@Component({
  templateUrl: 'lib-section.component.html',


})

export class LibSectionComponent extends HasFroala implements OnInit, WithSave {
  constructor( private sp: ActivatedRoute, private  router : Router,private tocService:TocService, private errorService:LibErrorService) {
  super();
  }
  section:any;
  backup:any;
  currentNode:any;
  sectionId:any

  @ViewChild('editForm')
  private editForm: NgForm;

  ngOnInit() {

    this.sectionId= this.sp.snapshot.params["sectionId"];


    this.sp.data.map(data =>data.currentSection).subscribe(x=>{
      this.backup=x;
      this.section=_.cloneDeep(this.backup);
      //console.log(this.section);
    });


  }

  save(): Promise<any>{
    return new Promise((resolve, reject)=>{

       let treeModel=this.tocService.getTreeModel();
       let node = treeModel.getNodeById(this.section.id);

         console.log(node);

         node.data.data=this.section;
         this.tocService.setTreeModel(treeModel).then(x=>{
           console.log(treeModel);

           this.backup=_.cloneDeep(this.section);

           this.editForm.control.markAsPristine();


           resolve(true);

         },error=>{
           this.errorService.showError(error);
           reject(error.message);
         })
       }
     )
  };
  reset(){
    this.section=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();


  }

  getCurrent(){
    return this.section;
  }
  getBackup(){
    return this.backup;
  }

  canSave(){
    return !this.editForm.invalid;
  }

  hasChanged(){
    return this.editForm&& this.editForm.touched&&this.editForm.dirty;

  }



}
