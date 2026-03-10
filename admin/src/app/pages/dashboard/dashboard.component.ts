import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  quizzes = signal<Quiz[]>([]);
  loading = signal(true);
  deleteConfirmId = signal<number | null>(null);
  qrModalQuiz = signal<Quiz | null>(null);

  gameBaseUrl = environment.gameUrl;

  constructor(
    public auth: AuthService,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.auth.loadMe().subscribe({
      next: (user) => {
        this.quizzes.set(user.quizzes ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.auth.logout();
      },
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  doDelete(id: number): void {
    this.quizService.deleteQuiz(id).subscribe({
      next: () => {
        this.quizzes.update((list) => list.filter((q) => q.id !== id));
        this.deleteConfirmId.set(null);
      },
    });
  }

  openQr(quiz: Quiz): void {
    this.qrModalQuiz.set(quiz);
  }

  closeQr(): void {
    this.qrModalQuiz.set(null);
  }

  getGameUrl(quiz: Quiz): string {
    return `${this.gameBaseUrl}/?id=${quiz.id}`;
  }

  getQrImageUrl(quiz: Quiz): string {
    const url = encodeURIComponent(this.getGameUrl(quiz));
    return `https://api.qrserver.com/v1/create-qr-code/?data=${url}&size=250x250&margin=10`;
  }
}
