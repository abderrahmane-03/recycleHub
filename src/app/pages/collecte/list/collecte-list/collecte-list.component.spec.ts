import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollecteListComponent } from './collecte-list.component';

describe('CollecteListComponent', () => {
  let component: CollecteListComponent;
  let fixture: ComponentFixture<CollecteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollecteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollecteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
