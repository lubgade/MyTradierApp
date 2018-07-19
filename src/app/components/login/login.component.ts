import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   username: String;
   password: String;
   token: String;
  expired: Boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    /*console.log(this.router.parseUrl(this.router.url).queryParams.access_token); 
    this.token = this.router.parseUrl(this.router.url).queryParams.access_token;
    const userToken = {token: this.token};
    if(this.token){
      console.log('Token available');
      this.authService.confirmUser(userToken).subscribe(data => {
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});          
          this.router.navigate(['/login']);
        }
        else{
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          return false;
        }
      });
    } */
    this.expired = false;
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    };

    

    this.authService.authenticateUser(user).subscribe(data => {
      console.log(data);
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['dashboard']);
      }
      else{
        if(data.expired){
          this.expired = true;

        }
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/login']);
        return false;
      }
    });
  }

  resendConfirmation(){
    console.log('In login resend confirmation');
    const user = {
      username: this.username,
      password: this.password
    };
    
    this.authService.resendConfirmation(user).subscribe(data => {
      console.log(data);
      if(data.success){
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 5000});        
        this.router.navigate(['']);                        
      }
      this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/register']);
      return false;
    });
  }

}
