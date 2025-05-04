import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService, Member } from '../../services/member.service';

@Component({
  selector: 'app-member-form',
  standalone: true,
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MemberFormComponent implements OnInit {
  memberId: number | null = null;

  memberForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.memberId = +id;
      this.memberService.getMemberById(this.memberId).subscribe((member: Member) => {
        this.memberForm.patchValue(member);
      });
    }
  }
  onSubmit(): void {
    if (this.memberForm.valid) {
      const member: Member = {
        memberId: this.memberId!, // ✅ ensure it's included!
        fullName: this.memberForm.value.fullName ?? '',
        email: this.memberForm.value.email ?? '',
        phone: this.memberForm.value.phone ?? ''
      };

      this.memberService.updateMember(this.memberId!, member).subscribe(() => {
        this.router.navigate(['/members']);
      });
    }
  }

}

