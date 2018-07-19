import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIO from 'socket.io-client';
import {  Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class DataService {
  //socket = socketIO('http://localhost:3000');
  socket;
  observer: Observer<any>

  constructor(private http: Http) { }

  sendAccountName(account){
    console.log('Sending account name');
    this.socket = socketIO('http://localhost:3000');
    
    console.log(account);
    console.log(this.socket);
    this.socket.emit('account', {account: account});
  }

getQuotes() {  
  let observable = new Observable((observer) => {
    this.socket.on('data', (res) => {
      console.log(res);
      observer.next(res.data);
      //console.log(observer.next);
    });
    //observer.complete();
    // return () => {
    //   this.socket.disconnect();
    // };
  });
  //console.log(typeof observable);
  return observable;
}

private handleError(error) {
  console.error('server error:', error);
  if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
  }
  return Observable.throw(error || 'Socket.io server error');
}

// getQuotes(): Observable<string[]>{
//   this.socket.on('data', (res) => {
//     this.observer.next(res.data);
//     console.log(this.observer);
//   });

//   return this.createObservable();

// }

// createObservable(): Observable<string[]>{
//   return new Observable((observer) => {
//     //observer.complete();
//     this.observer = observer;
//   });
// }

disconnect(){
  this.socket.disconnect();
}


}
 