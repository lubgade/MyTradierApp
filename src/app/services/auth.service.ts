import { Injectable } from '@angular/core';
import {  Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../interfaces/user';


@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  userToken: any;
  confirm: Boolean;
  //currentUser: User;

  constructor(private http: Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  confirmUser(userToken){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/confirmation', userToken, {headers: headers})
      .map(res => res.json());
  }

  checkUsername(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/checkUsername', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  resendConfirmation(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/resendConfirmation', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers: headers})
      .map(res => res.json());
  }


  storeUserData(token, user){
    console.log(user);
    console.log(typeof user);
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loadUser(){
    const currentUser = JSON.parse(localStorage.getItem('user'));
    //console.log(currentUser);
    return currentUser;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  updateUserData(user, account, position, id, value){
    console.log(user);
    console.log(position);
    console.log(id, value);
  
    let userData = {
      user: user,
      account: account,
      position: position,
      id: id,
      value: value
    };
  
    console.log(userData);
  
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/updateUserData', userData, {headers: headers})
      .map(res => res.json());
  }
  

}
