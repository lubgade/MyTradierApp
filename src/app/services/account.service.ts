import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {Router} from '@angular/router';



@Injectable()
export class AccountService {
  // //token = 'FqMtGHXVS9ICAVc5WBkNj6M9tr5G';
   token = '8qms8lWUbIxGyzgZAxkuwMQLJrwY';
  username: String;
  email: String;
  account_name: String;
  access_token: String;

  constructor(private http: Http,
              private router: Router) { }

  loginAccount(){
    let headers = new Headers();
    headers.append('Authorization','Bearer'+ this.token);
    return this.http.get('http://localhost:3000/accounts/login', {headers: headers})
      .map(res => res.json());
  }

  getUserData(){
    //let token = '67ywroPC18adHjgCUuE7s70Ix5w6';
    //let token = '8qms8lWUbIxGyzgZAxkuwMQLJrwY';
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.token);
    return this.http.get('https://api.tradier.com/v1/user/profile', {headers:headers})
      .map(res => res.json());
  }

  getAccountPositions(id){
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.token);
    return this.http.get(`https://api.tradier.com/v1/user/positions`, {headers})
      .map(res => res.json());
  }

  getAskPrice(symbol){
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.token);
    return this.http.get(`https://api.tradier.com/v1/markets/quotes?symbols=${symbol}`, {headers})
      .map(res => res.json());
  }




  

  linkAccount(account){
    console.log(account);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/linkAccount', account, {headers: headers})
    .map(res => res.json());
  }

  getUserAccounts(user){
    console.log('User', user.email);
    let url = 'http://localhost:3000/users/getUserAccounts';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let myParams = new URLSearchParams();
    myParams.append('email', user.email);
    let options = new RequestOptions({ headers: headers});
    options.params = myParams;
    return this.http.get(url, options)
    .map(res => res.json());
  }

  unlinkAccount(user, accountName){
    let account = {email: user.email, accountName: accountName};
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/unlinkAccount', account, {headers: headers})
    .map(res => res.json());

  }
}
