import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerRotationsComponent } from './banner-rotations.component';

describe('BannerRotationsComponent', () => {
  let component: BannerRotationsComponent;
  let fixture: ComponentFixture<BannerRotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerRotationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerRotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
