import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.html'
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  userService = inject(UserService);

  currentId: number = 1;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.currentId = +idParam;
        this.userService.loadUserById(this.currentId);
      }
    });
  }

  prev(): void {
    if (this.currentId > 1) {
      this.router.navigate(['/users', this.currentId - 1]);
    }
  }

  next(): void {
    this.router.navigate(['/users', this.currentId + 1]);
  }
}