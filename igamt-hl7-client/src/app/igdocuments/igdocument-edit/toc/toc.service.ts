/**
 * Created by ena3 on 10/26/17.
 */
import {Injectable}  from "@angular/core";
import {BehaviorSubject} from "rxjs";

import * as _ from 'lodash';


@Injectable()
export  class TocService{

  activeNode :BehaviorSubject<any> =new BehaviorSubject(null);
  constructor(){
  }

  setActiveNode(node){
    console.log("Called Active node");
    this.activeNode.next(node);
  }
  getActiveNode(){

    return  this.activeNode;
  }

  findDirectChildByType(nodes, type){

    for(let i=0;i<nodes.length; i++){
      if(nodes[i].data.type==type){
        return nodes[i];
      }
    }
    return null;

  }

  addNodesByType(toAdd, toc,type ){
    var profile= this.findDirectChildByType(toc,"PROFILE");
    var registry = this.findDirectChildByType(profile.children,type);
    var position=registry.children.length+1;
    for(let i=0 ; i<toAdd.length; i++){
      toAdd[i].data.position =position;
      position++;
      registry.children.push(toAdd[i]);
    }


  }






}
