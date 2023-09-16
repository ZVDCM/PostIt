import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginConstantsService } from 'src/app/constants/login-constants.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { LoginHttpService } from './login-http.service';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/shared/types/formType';

@Component({
    selector: 'app-login',
    template: `
        <header class="flex justify-between items-end pt-36 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest">LOGIN</h1>
            <div class="flex flex-col items-end">
                <span>Not a member?</span>
                <a
                    class="hover:underline"
                    style="color: var(--primary-color)"
                    [routerLink]="loginConstants.registerEndpoint"
                    >Create an account</a
                >
            </div>
        </header>
        <section>
            <form
                class="flex flex-col gap-4"
                method="POST"
                [formGroup]="loginForm"
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-4">
                    <form-input
                        [id]="emailField.id"
                        [label]="emailField.label"
                        [formControlName]="emailField.label"
                    />
                    <form-input-group
                        [id]="passwordField.id"
                        [label]="passwordField.label"
                        [formControlName]="passwordField.label"
                        [icon]="showPassword ? 'pi-eye-slash' : 'pi-eye'"
                        [type]="showPassword ? 'text' : 'password'"
                        [hasAutocomplete]="false"
                        (onButtonClick)="togglePasswordType()"
                    />
                </div>
                <div class="flex justify-between">
                    <p-checkbox
                        [formControlName]="rememberField.label"
                        [inputId]="rememberField.id"
                        [binary]="true"
                        (onChange)="onChanged($event)"
                        [label]="rememberField.label"
                    ></p-checkbox>
                    <a
                        class="hover:underline"
                        style="color: var(--primary-color)"
                        [routerLink]="loginConstants.forgotPasswordEndpoint"
                        >Forgot your password?</a
                    >
                </div>
                <p-button
                    [loading]="loginHttp.isLoading"
                    type="submit"
                    class="mt-10"
                    styleClass="w-full"
                    label="Login"
                ></p-button>
            </form>
        </section>
        <ng-container *ngIf="login$ | async"></ng-container>
    `,
    styles: [
        `
            :host {
                @apply block h-full max-w-lg mx-auto;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoginConstantsService, FormHelperService, LoginHttpService],
})
export class LoginComponent {
    public login$: Observable<void> = new Observable();
    public loginForm: FormGroup = new FormGroup({});
    public showPassword: boolean = false;

    public emailField: IFormItem = this.loginConstants.loginForm['email'];
    public passwordField: IFormItem = this.loginConstants.loginForm['password'];
    public rememberField: IFormItem = this.loginConstants.loginForm['remember'];

    constructor(
        public loginConstants: LoginConstantsService,
        public loginHttp: LoginHttpService,
        private _formHelper: FormHelperService
    ) {
        console.log(localStorage.getItem(this.emailField.label));
        this.loginForm = this._formHelper.setFormGroup({
            [this.emailField.label]: new FormControl('JuanDelaCruz@gmail.com'),
            [this.passwordField.label]: new FormControl('TestTest!23'),
            [this.rememberField.label]: new FormControl(
                localStorage.getItem(this.emailField.label) ? true : false
            ),
        });

        this.login$ = this.loginHttp.watchLogin$();
    }

    public onSubmit(): void {
        this.loginHttp.login(this.loginForm.value);
    }

    public togglePasswordType(): void {
        this.showPassword = !this.showPassword;
    }

    public onChanged({ checked }: any): void {
        localStorage.clear();
        if (checked) {
            localStorage.setItem(
                this.emailField.label,
                this.loginForm.get(this.emailField.label)?.value
            );
        }
    }
}
