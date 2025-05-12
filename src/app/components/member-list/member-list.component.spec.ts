import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListComponent } from './member-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MemberService } from '../../services/member.service';
import { of } from 'rxjs';

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberListComponent, HttpClientTestingModule],
      providers: [
        {
          provide: MemberService,
          useValue: {
            getMembers: () => of([]),
            onMemberChange: {
              subscribe: () => ({ unsubscribe() { } })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
