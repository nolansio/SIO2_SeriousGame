import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz, Question } from '../../models';

interface NewQuestion {
  title: string;
  answer: boolean;
}

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quiz-form.component.html',
})
export class QuizFormComponent implements OnInit {
  isNew = true;
  quizId: number | null = null;

  title = '';
  description = '';

  // Mode création : liste de questions à soumettre d'un coup
  newQuestions = signal<NewQuestion[]>([{ title: '', answer: true }]);

  // Mode édition
  quiz = signal<Quiz | null>(null);
  questions = signal<Question[]>([]);
  loadingQuiz = signal(false);

  saving = signal(false);
  error = signal('');
  success = signal('');

  addingQuestion = signal(false);
  newQuestionTitle = '';
  newQuestionAnswer: boolean = true;

  editingQuestionId = signal<number | null>(null);
  editTitle = '';
  editAnswer: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isNew = false;
        this.quizId = +id;
        this.loadQuiz(this.quizId);
      } else {
        this.isNew = true;
        this.quizId = null;
        this.title = '';
        this.description = '';
        this.newQuestions.set([{ title: '', answer: true }]);
      }
    });
  }

  loadQuiz(id: number): void {
    this.loadingQuiz.set(true);
    this.quizService.getQuiz(id).subscribe({
      next: (q) => {
        this.quiz.set(q);
        this.title = q.title;
        this.description = q.description ?? '';
        this.questions.set(q.questions ?? []);
        this.loadingQuiz.set(false);
      },
      error: () => {
        this.error.set('Quizz introuvable.');
        this.loadingQuiz.set(false);
      },
    });
  }

  // --- Mode création ---

  addNewQuestionField(): void {
    this.newQuestions.update((list) => [...list, { title: '', answer: true }]);
  }

  removeNewQuestionField(index: number): void {
    this.newQuestions.update((list) => list.filter((_, i) => i !== index));
  }

  trackByIndex(index: number): number {
    return index;
  }

  updateNewQuestion(index: number, field: 'title' | 'answer', value: any): void {
    this.newQuestions.update((list) => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  hasValidQuestions(): boolean {
    return this.newQuestions().some((q) => q.title.trim() !== '');
  }

  createQuiz(): void {
    if (!this.title.trim() || !this.description.trim()) return;
    this.saving.set(true);
    this.error.set('');

    this.quizService
      .createQuiz({ title: this.title.trim(), description: this.description.trim() })
      .subscribe({
        next: (quiz) => {
          const validQuestions = this.newQuestions().filter((q) => q.title.trim() !== '');
          if (validQuestions.length === 0) {
            this.saving.set(false);
            this.router.navigate(['/dashboard']);
            return;
          }

          let done = 0;
          for (const q of validQuestions) {
            this.quizService
              .createQuestion({ quizId: quiz.id, title: q.title.trim(), answer: q.answer })
              .subscribe({
                next: () => {
                  done++;
                  if (done === validQuestions.length) {
                    this.saving.set(false);
                    this.router.navigate(['/dashboard']);
                  }
                },
                error: () => {
                  done++;
                  if (done === validQuestions.length) {
                    this.saving.set(false);
                    this.router.navigate(['/dashboard']);
                  }
                },
              });
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.error ?? 'Une erreur est survenue.');
        },
      });
  }

  // --- Mode édition ---

  saveQuiz(): void {
    if (!this.title.trim() || !this.description.trim()) return;
    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.quizService
      .updateQuiz(this.quizId!, { title: this.title.trim(), description: this.description.trim() })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.success.set('Quizz mis à jour avec succès.');
          setTimeout(() => this.success.set(''), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.error ?? 'Une erreur est survenue.');
        },
      });
  }

  addQuestion(): void {
    if (!this.newQuestionTitle.trim() || this.quizId === null) return;
    this.addingQuestion.set(true);

    this.quizService
      .createQuestion({
        quizId: this.quizId,
        title: this.newQuestionTitle.trim(),
        answer: this.newQuestionAnswer,
      })
      .subscribe({
        next: (q) => {
          this.questions.update((list) => [...list, q]);
          this.newQuestionTitle = '';
          this.newQuestionAnswer = true;
          this.addingQuestion.set(false);
        },
        error: () => {
          this.addingQuestion.set(false);
        },
      });
  }

  startEdit(q: Question): void {
    this.editingQuestionId.set(q.id);
    this.editTitle = q.title;
    this.editAnswer = q.answer;
  }

  saveEdit(id: number): void {
    this.quizService
      .updateQuestion(id, { title: this.editTitle.trim(), answer: this.editAnswer })
      .subscribe({
        next: (updated) => {
          this.questions.update((list) => list.map((q) => (q.id === id ? updated : q)));
          this.editingQuestionId.set(null);
        },
      });
  }

  cancelEdit(): void {
    this.editingQuestionId.set(null);
  }

  deleteQuestion(id: number): void {
    this.quizService.deleteQuestion(id).subscribe({
      next: () => {
        this.questions.update((list) => list.filter((q) => q.id !== id));
      },
    });
  }
}
