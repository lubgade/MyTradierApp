import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: string;
  accounts = ['Tradier', 'Etrade', 'Merril Edge', 'Robinhood'];
  account = this.accounts[0];
  Accounts;
  linkAccount: boolean;
  accessToken: String;
  
  constructor(private authService: AuthService,
              private accountService: AccountService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  this.linkAccount = false;
  this.user = this.authService.loadUser();
  console.log(this.user);
  this.accountService.getUserAccounts(this.user).subscribe((data) => {
    console.log(data.accounts);
    this.Accounts = data.accounts;
    });
  }

  onChange(event){
    console.log(event.target.value);
    this.account = event.target.value;
  }

  onAddAccount(){
    console.log('clicked');
    this.linkAccount = true;
  }


  onAccountLink(){
    //console.log('clicked');
    this.linkAccount = true;
    console.log(this.account);
    if(this.accessToken){
      const account = {
        name: this.account,
        access_token: this.accessToken,
        user: this.user
      };
      console.log(account);

      this.accountService.linkAccount(account).subscribe((data) => {
        console.log(data);
        this.linkAccount = false;
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.accountService.getUserAccounts(this.user).subscribe((data) => {
            console.log(data);
            this.Accounts = data.accounts;
          });
        }
        else{
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    }
    else{
      this.flashMessage.show('Access token is required to link account', {cssClass: 'alert-danger', timeout: 3000});      
    }
  }

  unlinkAccount(account){
    console.log(account);

    this.accountService.unlinkAccount(this.user, account).subscribe((data) => {
      console.log(data);
      if(data.success){
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});        
        this.Accounts = data.accounts;
      }
      else{
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});        
      }  
    });
  }

}
