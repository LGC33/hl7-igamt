import {MessageService} from "primeng/components/common/messageservice";
import {NgForm} from "@angular/forms";
/**
 * Created by ena3 on 5/10/18.
 */
export interface WithSave{

  save() :Promise<any>;
  reset(): any;
  getCurrent():any;
  getBackup():any;
  canSave(): boolean;
  hasChanged():boolean;
}

export class WithNotification{

  constructor(private messageService: MessageService){

  }
  showError() {
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }

}
