import {Component,Inject,forwardRef} from '@angular/core';
import { Router }      from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  message: string;
  username: string;
  password: string;

  constructor(public authService: AuthService, public router: Router) {
  }

  login() {
    this.message = 'Trying to log in ...';

    this.authService.login(this.username,this.password).subscribe(x => {
      if (x==true) {
        console.log("test");
        console.log(this.authService.redirectUrl);
        let redirect = this.authService.redirectUrl;
        // Redirect the user
        this.router.navigate([redirect]);
      }
      else{
        this.router.navigate(["/"]);
      }
    });
  }

  logout() {
    this.authService.logout();  //?
  }
  register(){
    this.router.navigate(["/register"]);
  }

}
