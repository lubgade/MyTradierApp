import { Component, OnInit, OnDestroy, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { ArraysortPipe } from '../../pipes/arraysort.pipe'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { share } from 'rxjs/operators';

import { AccountsComponent } from '../accounts/accounts.component';
import { AccountService } from '../../services/account.service';
import { ValidateService } from '../../services/validate.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { SharedataService } from '../../services/sharedata.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs/Subscription';
import * as socketIO from 'socket.io-client';



@Component({
  selector: 'app-selectaccount',
  templateUrl: './selectaccount.component.html',
  styleUrls: ['./selectaccount.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelectaccountComponent implements OnInit, OnDestroy {
  account_name: String;
  username: String;
  password: String;
  account: any;
  gotAccount: boolean;
  //positions: any = [];
  positions: Observable<any>;
  //socket = socketIO('http://localhost:3000/users');
  sub: Subscription;
  somePositions;
  user;
  observable: Observable<Object>;
  showDialog = false;
  selectedPosition;
  

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private validateService: ValidateService,
              private flashMessagesService: FlashMessagesService,
              private dataService: DataService,
              private authService: AuthService,
              private sharedata: SharedataService) { 

                
                this.gotAccount = false;
                this.user = this.authService.loadUser(); 
                
                console.log('In constructor');

            
              }

  ngOnInit(){
    console.log(this.user);  
     this.route.params.subscribe(params => {
      console.log(params);
      this.account_name = params.name;
      console.log(this.account_name);
    });
    
    this.dataService.sendAccountName({user:this.user, account_name: this.account_name});    
    

    // Manual subscription - will work too
    // this.sub =  this.dataService.getQuotes()
    //   .subscribe(
    //     quotes => {
    //       console.log(Object.values(quotes));
    //       this.positions = quotes;
    //       console.log(this.positions);
    //       console.log(typeof this.positions);
    //     },
    //     error => console.log(error)
    // );

    this.positions = this.dataService.getQuotes().pipe(share());
    console.log(this.positions);
     
  }

  
  ngOnDestroy(){
     this.gotAccount = false;   
    
     //have to manually unsubscribe
     //this.sub.unsubscribe();
     this.dataService.disconnect();
     console.log('Disconnected from server');
    console.log('Destroy');
    console.log(this.gotAccount);
  }

  onSubmit(){
    /*const user = {
      username: this.username,
      password: this.password
    };

    if(!this.validateService.validateAccount(user)){
      this.flashMessagesService.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }*/

    this.accountService.loginAccount().subscribe(data => {
      console.log(data);
    });
  }

  selectPosition(position){
    console.log(position);
    console.log(this.user);
    console.log(this.account_name);
    this.sharedata.storage = {
      "user": this.user,
      "position": position,
      "account": this.account_name
    }
    // this.selectedPosition = position;
    // console.log(this.selectedPosition);
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     "user": JSON.stringify(this.user),
    //     "position": JSON.stringify(position)
    //   }
    // }
    // this.router.navigate(['position'], navigationExtras);
    this.router.navigate(['position']);
  }



  // selectPosition(position){
  //   console.log(this.showDialog);
  //   this.showDialog = !this.showDialog;
  //   console.log(position);
  //   this.selectedPosition = position;
  //   console.log(this.selectedPosition);
  //   //stop loss price
  //   //book profit price
  //     //only bpp ask_price == profit_price
  //     //only slp avg(bid+ask_price) == execute | +5%/ -5%(send email) stop loss price
  //     //both bpp & slp check if either one true
  // }

  // getUserData(){
    
  //   this.accountService.getUserData().subscribe(account => {
  //     //console.log(account);
  //     this.gotAccount = true;
  //     this.username = account.profile.name;
  //     //console.log(this.username);
  //     this.accountService.getAccountPositions(account.profile.id).subscribe(positions => {
  //       if(positions){
  //         this.positions = [];
  //         //console.log(positions);
  //         let allPositions = positions.accounts.account.positions;
  //         //console.log(allPositions);
  //         allPositions.position.forEach(position => {
  //           this.accountService.getAskPrice(position.symbol).subscribe(quotes => {
  //             //console.log(position);
  //             //console.log(quotes);
  //             let askPrice = quotes.quotes.quote.ask;
  //             //console.log(askPrice);
  //             position.askPrice = askPrice;
  //             position.currentValue = (askPrice * position.quantity * 100) - 5;
  //             position.volume = quotes.quotes.quote.volume;
  //             //console.log(position);
  //             this.positions.push(position);
  //             //console.log(this.positions);
  //           });
  //         });
  //         let ServerPositions = [];
  //         allPositions.position.forEach((position) => {
  //           //console.log(position);
  //           ServerPositions.push(position.symbol);
  //         });
  //         //console.log(positions);
  //         this.socket.emit('positions', {ServerPositions: ServerPositions});
  //       }
  //     });
   
  //   });
  //   console.log('end');
  //   this.socket.on('data', (data) => {
  //     console.log(data);
  //   });
    
  // }


}
