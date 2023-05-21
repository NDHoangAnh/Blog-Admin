import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcribersComponent } from './subcribers.component';

describe('SubcribersComponent', () => {
  let component: SubcribersComponent;
  let fixture: ComponentFixture<SubcribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcribersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
