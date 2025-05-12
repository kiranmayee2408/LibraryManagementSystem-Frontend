import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemberService, Member } from '../../services/member.service';

@Component({
  selector: 'app-member-form',
  standalone: true,
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MemberFormComponent implements OnInit {
  memberId: number | null = null;
  formData: Member = {
    memberId: 0,
    fullName: '',
    email: '',
    phone: '',
    joinDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.memberId) {
      this.memberService.getMemberById(this.memberId).subscribe(member => {
        this.formData = {
          ...member,
          joinDate: member.joinDate?.split('T')[0]
        };
      });
    }
  }

  onSubmit(): void {
    if (this.memberId) {
      this.memberService.updateMember(this.memberId, this.formData).subscribe(() => {
        this.router.navigate(['/members']);
      });
    } else {
      const { fullName, email, phone, joinDate } = this.formData;
      this.memberService.createMember({ fullName, email, phone, joinDate }).subscribe(() => {
        this.router.navigate(['/members']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/members']);
  }
}
