import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, Question } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.base}/quizzes/${id}`);
  }

  createQuiz(data: { title: string; description?: string }): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.base}/quizzes`, data);
  }

  updateQuiz(id: number, data: { title: string; description?: string }): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.base}/quizzes/${id}`, { id, ...data });
  }

  deleteQuiz(id: number): Observable<Quiz> {
    return this.http.delete<Quiz>(`${this.base}/quizzes/${id}`);
  }

  createQuestion(data: { quizId: number; title: string; answer: boolean }): Observable<Question> {
    return this.http.post<Question>(`${this.base}/questions`, data);
  }

  updateQuestion(id: number, data: { title: string; answer: boolean }): Observable<Question> {
    return this.http.put<Question>(`${this.base}/questions/${id}`, data);
  }

  deleteQuestion(id: number): Observable<Question> {
    return this.http.delete<Question>(`${this.base}/questions/${id}`);
  }
}
