import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectaccountComponent } from './selectaccount.component';

describe('SelectaccountComponent', () => {
  let component: SelectaccountComponent;
  let fixture: ComponentFixture<SelectaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
