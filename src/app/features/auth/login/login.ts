import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthService } from "@services/auth.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    // Đã đăng nhập rồi thì không cho vào lại trang login
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl(this.auth.homeUrl());
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } 

    this.loading.set(true);
    this.errorMessage.set('');
    const { email, password } = this.form.getRawValue();

    this.auth.login({ email, password }).subscribe({
      next: () => this.router.navigateByUrl(this.auth.homeUrl()),
      error: (err) => {
        this.loading.set(false);
        if (err.status === 0) {
          this.errorMessage.set('Không kết nối được máy chủ. Vui lòng thử lại sau.');
        } else {
          this.errorMessage.set(err.error?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      },
    });
  }
}