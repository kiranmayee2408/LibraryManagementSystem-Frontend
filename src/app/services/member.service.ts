import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
    memberId: number;
    fullName: string;
    email: string;
    phone: string;
    joinDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private apiUrl = 'https://localhost:7011/api/members';

    constructor(private http: HttpClient) { }

    getMembers(): Observable<Member[]> {
        return this.http.get<Member[]>(this.apiUrl);
    }

    getMemberById(id: number): Observable<Member> {
        return this.http.get<Member>(`${this.apiUrl}/${id}`);
    }

    createMember(member: Omit<Member, 'memberId'>): Observable<Member> {
        return this.http.post<Member>(this.apiUrl, member);
    }

    updateMember(id: number, member: Member): Observable<Member> {
        return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
    }

    deleteMember(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
