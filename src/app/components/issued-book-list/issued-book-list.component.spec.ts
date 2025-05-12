import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuedBookListComponent } from './issued-book-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IssuedBookService } from '../../services/issued-book.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('IssuedBookListComponent', () => {
  let component: IssuedBookListComponent;
  let fixture: ComponentFixture<IssuedBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBookListComponent, HttpClientTestingModule],
      providers: [
        {
          provide: IssuedBookService,
          useValue: {
            getIssuedBooks: () => of([]),
            onIssuedBookChange: {
              subscribe: () => ({ unsubscribe() { } })
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IssuedBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
