/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {HttpClient} from "@angular/common/http";
import {SegmentsService} from "../../../../service/segments/segments.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {ConformanceProfilesService} from "../../../../service/conformance-profiles/conformance-profiles.service";



@Component({
  templateUrl : './conformanceprofile-edit-predef.component.html',
  styleUrls : ['./conformanceprofile-edit-predef.component.css']
})
export class ConformanceprofileEditPredefComponent implements WithSave {
    currentUrl:any;
    conformanceprofileId:any;
    conformanceprofilePredef:any;
    backup:any;

    @ViewChild('editForm')
    private editForm: NgForm;

    constructor(private route: ActivatedRoute, private  router : Router, private conformanceProfilesService : ConformanceProfilesService, private http:HttpClient){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.conformanceprofileId = this.route.snapshot.params["conformanceprofileId"];
        this.route.data.map(data =>data.conformanceprofilePredef).subscribe(x=>{
            this.backup=x;
            this.conformanceprofilePredef=_.cloneDeep(this.backup);
        });
    }

    reset(){
        this.conformanceprofilePredef=_.cloneDeep(this.backup);
    }

    getCurrent(){
        return  this.conformanceprofilePredef;
    }

    getBackup(){
        return this.backup;
    }

    isValid(){
        return !this.editForm.invalid;
    }

    save(): Promise<any>{
        return this.conformanceProfilesService.saveConformanceProfilePreDef(this.conformanceprofileId, this.conformanceprofilePredef);
    }
}
