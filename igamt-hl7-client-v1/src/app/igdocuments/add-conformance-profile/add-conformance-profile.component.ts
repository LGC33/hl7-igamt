import { Component, OnInit ,Input} from '@angular/core';
import {WorkspaceService} from "../../service/workspace/workspace.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IgDocumentAddingService} from "../igdocument-edit/service/adding.service";
import {PrimeDialogAdapter} from "../../common/prime-ng-adapters/prime-dialog-adapter";
import {ChangeDetectionStrategy} from "@angular/core";

@Component({
  selector: 'app-add-conformance-profile',
  templateUrl: './add-conformance-profile.component.html',
  styleUrls: ['./add-conformance-profile.component.css']
})
export class AddConformanceProfileComponent extends PrimeDialogAdapter{

  @Input()
  id:any;

  selectedSize=0;
  selectedEvents:any[]=[];

  tableValue :any;
  tableValueMap={};
  loading=false;
  uploadedFiles: any[] = [];
  activeIndex: number = 0;
  selectedVerion:any;
  blockUI=false;

  metaData: any= {};


  selectdNodeMap={};
  msgEvts=[];
  hl7Versions: any[];
  selcetedVersion: any =null;

  constructor( private  addingService :IgDocumentAddingService,
              private router: Router,    private route: ActivatedRoute, private ws :  WorkspaceService
  ) {
    super();
    this.hl7Versions=ws.getAppConstant().hl7Versions;
  }





  ngOnInit(){
    // Mandatory
    super.hook(this);
  }

  onDialogOpen(){
    // Init code
  }

  close(){
    this.dismissWithNoData();
  }

  closeWithData(res : any){
    this.dismissWithData(res.data);
  }
  //
  // toggleEvent(event){
  //   console.log(event);
  //   console.log(this.selectedEvents);
  //   let index =this.selectedEvents.indexOf(event);
  //   if(index<0){
  //     this.selectedEvents.push(event);
  //
  //   }else{
  //     this.selectedEvents.splice(index,1);
  //   }
  // }
  //
  // isSelected(event){
  //   return this.selectedEvents.indexOf(event)>-1;
  // }

  isSelected(event){
    for( let i=0;i<this.selectedEvents.length; i++){

      if(this.selectedEvents[i].id==event.id&&this.selectedEvents[i].name==event.name){
        return true;
      }
    }
    return false;
  };
  toggleEvent(event){

    for( let i=0;i<this.selectedEvents.length; i++){

      if(this.selectedEvents[i].id==event.id&&this.selectedEvents[i].name==event.name) {
        this.selectedEvents.splice(i, 1);
        return;
      }
    }
    this.selectedEvents.push(event);
  };

  getMessages(v){
    this.tableValue=[];
    this.selectedVerion=v;

      this.addingService.getMessagesByVersion(v).subscribe(x=>{

        console.log(this.selectedVerion);
        this.tableValue=x;
      })

  }




  addMessages(){
    let wrapper:any ={};
    this.blockUI=true;
    wrapper.msgEvts=this.selectedEvents;
    wrapper.id=this.id;
    this.addingService.addMessages(wrapper).subscribe(
      res => {
        console.log(res);
        this.closeWithData(res);
        this.blockUI=false;
      }
    )


  };

  goTo(res:any) {


    this.route.queryParams
      .subscribe(params => {
        var link="/ig/"+res.id;
        this.loading=false;
        this.router.navigate([link], params); // add the parameters to the end
      });
  }

  print(obj){

    console.log(obj);
    // this.submitEvent();
    // this.getMessages();
  }

  selectEvent(event){
    this.selectNode(event.node);

  }
  selectNode(node){

    if(node.children&& node.children.length>0){
    }else {
      this.msgEvts.push(node.data);
    }
  }

  unselectEvent(event){

    this.unselectNode(event.node);
  }


  unselectNode(node){
    if(node.children&& node.children.length>0){
      for(let i=0;i<node.children.length;i++){
        this.unselectdata(node.children[i].data);
      }
    }else {
      this.unselectdata(node.data);
    }
  };


  unselectdata(data){
    let index = this.msgEvts.indexOf(data);
    if(index >-1){
      this.msgEvts.splice(index,1);
    }

  }

  next(ev){
    console.log("call next")
    this.activeIndex=1;

  }
  previous(ev){

    console.log("call previous")
    this.activeIndex=0;

  }

  unselect(selected :any){
    console.log(selected);
    console.log(this.selectdNodeMap[this.selcetedVersion]);

    let index = this.selectdNodeMap[this.selcetedVersion].indexOf(selected);
    if(index >-1){
      this.selectdNodeMap[this.selcetedVersion].splice(index,1);
      if(selected.parent){
        this.unselectParent(selected.parent);
      }
    }
    this.tableValue=[...this.tableValue];
  }

  unselectParent(parent){

    parent.partialSelected=this.getPartialSelection(parent);
    console.log(parent.partialSelected);
    this.unselect(parent);

  }

  getPartialSelection(parent){
    for(let i=0; i<parent.children.length; i++){
      if(this.selectdNodeMap[this.selcetedVersion].indexOf(parent.children[i])>-1){
        return true;
      }
    }
    return false;
  }




  getSelected(){
    let ret=[];

    let versions= Object.keys(this.selectdNodeMap);
    if(versions.length>0){
      for(let i = 0 ; i<versions.length; i++) {
        let version = versions[i];
        if (this.selectdNodeMap[version]){
          for (let j = 0; j < this.selectdNodeMap[version].length; j++) {
            if(this.selectdNodeMap[version][j].parent){
              ret.push(this.selectdNodeMap[version][j])

            }
          }
        }
      };
    }

    this.selectedSize= ret.length;
    return ret;


  }




}
