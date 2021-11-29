import {Injectable}  from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {IndexedDbService} from "../../service/indexed-db/indexed-db.service";
import * as _ from 'lodash';
import {Types} from "../../common/constants/types";
import {IgDocumentInfo} from "../../service/indexed-db/ig-document-info-database";
import {TocService} from "./service/toc.service";
import {ErrorService} from "../../error/error.service";



@Injectable()
export class IgDocumentService {
    constructor(private http: HttpClient,public indexedDbService: IndexedDbService, private tocService:TocService, private error: ErrorService) {
    }

    public save(changedObjects): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('api/igdocuments/' + changedObjects.igDocumentId + '/save', changedObjects).subscribe(
                result => {
                    console.log('IG Document successfully saved ' + result);
                    resolve();
                },
                error => {
                    reject();
                }
            );
        });
    }



    public getIg(igId){
        return new Promise(
            (resolve , reject) => {
              this.initIgDocument(igId, resolve);
            })
    };

    initIgDocument(igId:any,resolve){
        console.log("Calling Init")
        this.http.get("api/igdocuments/" + igId + "/display").toPromise().then(x => {
                // this.parseToc(x.toc);
                this.indexedDbService.initializeDatabase(igId).then(() => {

                        let  ig = new IgDocumentInfo(igId);
                        ig.metadata=x["metadata"];
                        this.tocService.metadata.next(ig.metadata);
                        this.tocService.igId=igId;
                        console.log('FROM');
                        console.log(x);
                        this.tocService.sourceIg = x['sourceIg'];
                        ig.toc=x["toc"];
                        this.indexedDbService.initIg(ig).then(
                            () => {
                              this.tocService.igId=igId;

                              resolve(ig);
                            }, error => {
                                console.log("Could not add elements to client db");
                            }
                        );
                    },
                    (error) => {
                        console.log("Could not load Ig : " + error);
                    }
                );

            }, error=>{
                resolve();
                this.error.redirect("Could not load IG with id "+ igId);
            }

        );
    }

    public getIGDocumentConformanceStatements(igid): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/igdocuments/' + igid + '/conformancestatement').toPromise().then(conformanceStatements => {
                resolve(conformanceStatements);
            }, error => {
                resolve();
                this.error.redirect("Could not load ConformanceStatements for IG ("+ igid + ")");
            });
        });
        return promise;
    }

    public getDatatypeLabels(igid): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/igdocuments/' + igid + '/datatypeLabels').toPromise().then(serverDatatypeLabels => {
                resolve(serverDatatypeLabels);
            }, error => {
            });
        });
        return promise;
    }

    public getValuesetLabels(igid): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this.http.get('api/igdocuments/' + igid + '/valuesetLabels').toPromise().then(serverValuesetLabels => {
                resolve(serverValuesetLabels);
            }, error => {
            });
        });
        return promise;
    }
}
