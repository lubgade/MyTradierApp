import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { SelectaccountComponent } from '../selectaccount/selectaccount.component';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts;
  accountSelected = String;
  user;
  
  constructor(private authService: AuthService,
              private router: Router,
              private flashMessage: FlashMessagesService,
              private route: ActivatedRoute,
              private accountService: AccountService,
              ) { 
                
              }

  ngOnInit() {
    this.user = this.authService.loadUser();
    console.log(this.user);
    this.accountService.getUserAccounts(this.user).subscribe((data) => {
      console.log(data.accounts);
      this.accounts = data.accounts;
      });
  }

  selectAccount(name){
    console.log(name);
    this.router.navigate(['/account', name]);
  }
}
