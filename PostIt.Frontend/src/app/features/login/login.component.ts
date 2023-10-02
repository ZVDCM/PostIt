import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/core/models/form.model';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { LoginHttpService } from './login-http.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterConstantsService } from 'src/app/shared/constants/register-constants.service';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';

@Component({
    selector: 'app-account',
    template: `
        <div class="w-full">
            <header class="flex justify-between items-end pt-40 pb-10">
                <h1 class="text-6xl font-extrabold tracking-widest">LOGIN</h1>
                <div class="flex flex-col items-end">
                    <span>Not a member?</span>
                    <a
                        [routerLink]="registerConstants.registerRoute"
                        class="hover:underline"
                        style="color: var(--primary-color)"
                        >Create an account</a
                    >
                </div>
            </header>
            <section>
                <form
                    [formGroup]="formHelper.formGroup"
                    (submit)="onSubmit()"
                    class="flex flex-col gap-4"
                    method="POST"
                >
                    <div class="flex flex-col gap-4">
                        <!-- EMAIL -->
                        <div class="flex flex-col gap-2">
                            <label [htmlFor]="emailField.id">{{
                                emailField.label
                            }}</label>
                            <input
                                [id]="emailField.id"
                                [attr.aria-describedby]="
                                    emailField.id + '-help'
                                "
                                [formControlName]="emailField.name"
                                [readonly]="loading.isLoading"
                                [autocomplete]="true"
                                pInputText
                            />
                            <small
                                *ngIf="emailField.hint !== null"
                                id="{{ emailField.id }}-help"
                                [ngClass]="{
                                    hidden: !formHelper.isInputInvalid(
                                        emailField.name
                                    )
                                }"
                                class="p-error"
                                >{{ emailField.hint }}
                            </small>
                        </div>
                        <!-- PASSWORD -->
                        <div class="flex flex-col gap-2">
                            <label [htmlFor]="passwordField.id">{{
                                passwordField.label
                            }}</label>
                            <div class="p-inputgroup">
                                <input
                                    [id]="passwordField.id"
                                    [attr.aria-describedby]="
                                        passwordField.id + '-help'
                                    "
                                    [type]="showPassword ? 'text' : 'password'"
                                    [autocomplete]="false"
                                    [formControlName]="passwordField.name"
                                    [readonly]="loading.isLoading"
                                    pInputText
                                />
                                <button
                                    type="button"
                                    pButton
                                    icon="pi {{
                                        showPassword ? 'pi-eye-slash' : 'pi-eye'
                                    }}"
                                    (click)="togglePasswordType()"
                                ></button>
                            </div>
                            <small
                                *ngIf="passwordField.hint !== null"
                                id="{{ passwordField.id }}-help"
                                [ngClass]="{
                                    hidden: !formHelper.isInputInvalid(
                                        passwordField.name
                                    )
                                }"
                                class="p-error"
                                >{{ passwordField.hint }}</small
                            >
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <p-checkbox
                            [formControlName]="rememberField.name"
                            [inputId]="rememberField.id"
                            [binary]="true"
                            [label]="rememberField.label"
                            (onChange)="onChanged($event)"
                        ></p-checkbox>
                        <a
                            [routerLink]="
                                forgotPasswordConstants.forgotPasswordRoute
                            "
                            class="hover:underline"
                            style="color: var(--primary-color)"
                            >Forgot your password?</a
                        >
                    </div>
                    <p-button
                        [loading]="loading.isLoading"
                        type="submit"
                        class="mt-10"
                        styleClass="w-full"
                        label="Login"
                    ></p-button>
                </form>
            </section>
            <ng-container *ngIf="login$ | async"></ng-container>
            <ng-container *ngIf="loading$ | async"></ng-container>
        </div>
        <app-footer />
    `,
    styles: [
        `
            :host {
                @apply h-full max-w-3xl flex flex-col justify-start items-center mx-auto px-20;
                border-left: 1px solid var(--surface-border);
                border-right: 1px solid var(--surface-border);
                background-color: var(--surface-ground);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LoginConstantsService,
        RegisterConstantsService,
        ForgotPasswordConstantsService,
        LoginHttpService,
        FormHelperService,
    ],
})
export class LoginComponent {
    public login$: Observable<void> = new Observable<void>();
    public loading$: Observable<boolean> = new Observable<boolean>();
    public showPassword: boolean = false;

    public readonly emailField: IFormItem =
        this.loginConstants.loginForm['email'];
    public readonly passwordField: IFormItem =
        this.loginConstants.loginForm['password'];
    public readonly rememberField: IFormItem =
        this.loginConstants.loginForm['remember'];

    constructor(
        public loginConstants: LoginConstantsService,
        public registerConstants: RegisterConstantsService,
        public forgotPasswordConstants: ForgotPasswordConstantsService,
        public loginHttp: LoginHttpService,
        public formHelper: FormHelperService,
        public loading: LoadingService
    ) {
        this.loading$ = loading.watchLoading$();
        this.login$ = loginHttp.watchLogin$();
        formHelper.setFormGroup(
            new FormGroup({
                [this.emailField.name]: new FormControl(
                    'verj.morales@gmail.com'
                ),
                [this.passwordField.name]: new FormControl('TestTest!23'),
                [this.rememberField.name]: new FormControl(
                    localStorage.getItem(this.emailField.name) ? true : false
                ),
            })
        );
    }

    public togglePasswordType(): void {
        this.showPassword = !this.showPassword;
    }

    public onChanged({ checked }: any): void {
        localStorage.clear();
        if (checked) {
            localStorage.setItem(
                this.emailField.name,
                this.formHelper.formGroup.get(this.emailField.name)?.value
            );
        }
    }

    public onSubmit(): void {
        const { [this.rememberField.label]: remember, ...newObject } =
            this.formHelper.formGroup.value;
        this.loginHttp.login(newObject);
    }
}
