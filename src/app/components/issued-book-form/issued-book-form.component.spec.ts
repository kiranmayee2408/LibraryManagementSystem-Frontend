import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssuedBookFormComponent } from './issued-book-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { IssuedBookService } from '../../services/issued-book.service';
import { of } from 'rxjs';

describe('IssuedBookFormComponent', () => {
  let component: IssuedBookFormComponent;
  let fixture: ComponentFixture<IssuedBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedBookFormComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        },
        {
          provide: IssuedBookService,
          useValue: {
            getIssuedBookById: () => of({ id: 1, bookId: 2, memberId: 3 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IssuedBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
