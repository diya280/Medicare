import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalareaComponent } from './medicalarea.component';

describe('MedicalareaComponent', () => {
  let component: MedicalareaComponent;
  let fixture: ComponentFixture<MedicalareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalareaComponent]
    });
    fixture = TestBed.createComponent(MedicalareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
