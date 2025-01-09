import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEddressComponent } from './my-eddress.component';

describe('MyEddressComponent', () => {
  let component: MyEddressComponent;
  let fixture: ComponentFixture<MyEddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyEddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
