import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  token: String;

  constructor(private authService: AuthService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    console.log(this.router.parseUrl(this.router.url).queryParams.access_token); 
    this.token = this.router.parseUrl(this.router.url).queryParams.access_token;
    const userToken = {token: this.token};
    if(this.token){
      console.log('Token available');
      this.authService.confirm = true;
      this.authService.confirmUser(userToken).subscribe(data => {
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});          
          //this.router.navigate(['/login']);
        }
        else{
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['']);
          return false;
        }
      });
    }

  }
}  
