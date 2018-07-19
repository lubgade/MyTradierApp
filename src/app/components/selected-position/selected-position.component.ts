import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedataService } from '../../services/sharedata.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-selected-position',
  templateUrl: './selected-position.component.html',
  styleUrls: ['./selected-position.component.css']
})
export class SelectedPositionComponent implements OnInit {
  position: any;
  user: any;
  account_name: any;
  bp_price = 0;
  sl_price = 0;
  price=0;
  clicked_bp = false;
  clicked_sl = false;
  id;

  @Input() selectedPosition;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sharedata: SharedataService,
              private authService: AuthService,
              private dataService: DataService) { }

  ngOnInit() {
    console.log(this.sharedata.storage);
    this.position = this.sharedata.storage.position;
    this.user = this.sharedata.storage.user;
    this.account_name = this.sharedata.storage.account;
    this.bp_price = this.position.bp_price;
    this.sl_price = this.position.sl_price;
    console.log(this.position);
    console.log(this.user);
    console.log(this.account_name);

    //using queryParams - works
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    //   this.user  = JSON.parse(params['user']);
    //   this.position = JSON.parse(params['position']);
    //   console.log(this.position);
    //   console.log(this.user);
    // });
  }

  addPrice(){
    console.log(this.sl_price);    
    console.log(this.bp_price);
    //this.authService.updateUserData(this.user, this.position, this.sl_price, this.bp_price)
  }

  goBack(){
    this.router.navigate(['/account', this.account_name]);
  }

  update_price(event){
    console.log(event.target.id);
    if(event.target.id === 'bp_price')
      this.clicked_bp = true;
    else  
      this.clicked_sl = true;
    this.id = event.target.id;
    // console.log(this.price);
  }

  onPriceUpdate(value){
    console.log(value);
    
    if(this.id === 'bp_price'){
      this.clicked_bp = false;      
      this.bp_price = value;
    }
    else{
      this.clicked_sl = false;      
      this.sl_price = value;
    }
    this.authService.updateUserData(this.user, this.account_name, this.position, this.id, value).subscribe(data => {
      console.log(data);
    });         
  }

}
