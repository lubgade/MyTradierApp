import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPositionComponent } from './selected-position.component';

describe('SelectedPositionComponent', () => {
  let component: SelectedPositionComponent;
  let fixture: ComponentFixture<SelectedPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
