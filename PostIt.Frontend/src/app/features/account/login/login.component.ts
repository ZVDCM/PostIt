import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { LoginHttpService } from './login-http.service';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/shared/types/formType';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';

@Component({
    selector: 'app-login',
    template: `
        <header class="flex justify-between items-end pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest">LOGIN</h1>
            <div class="flex flex-col items-end">
                <span>Not a member?</span>
                <a
                    class="hover:underline"
                    style="color: var(--primary-color)"
                    [routerLink]="accountConstants.registerEndpoint"
                    >Create an account</a
                >
            </div>
        </header>
        <section>
            <form
                class="flex flex-col gap-4"
                method="POST"
                [formGroup]="formHelper.formGroup"
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-4">
                    <!-- EMAIL -->
                    <div class="flex flex-col gap-2">
                        <label [htmlFor]="emailField.id">{{
                            emailField.label
                        }}</label>
                        <input
                            [id]="emailField.id"
                            [attr.aria-describedby]="emailField.id + '-help'"
                            [formControlName]="emailField.label"
                            pInputText
                            autocomplete
                        />
                        <small
                            *ngIf="emailField.hint !== null"
                            id="{{ emailField.id }}-help"
                            [ngClass]="{
                                hidden: !formHelper.isInputInvalid(
                                    emailField.label
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
                                [formControlName]="passwordField.label"
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
                                    passwordField.label
                                )
                            }"
                            class="p-error"
                            >{{ passwordField.hint }}</small
                        >
                    </div>
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
                        [routerLink]="accountConstants.forgotPasswordEndpoint"
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
                @apply w-full max-w-lg;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AccountConstantsService, FormHelperService, LoginHttpService],
})
export class LoginComponent {
    public login$: Observable<void> = new Observable<void>();
    public showPassword: boolean = false;

    public readonly emailField: IFormItem =
        this.accountConstants.loginForm['email'];
    public readonly passwordField: IFormItem =
        this.accountConstants.loginForm['password'];
    public readonly rememberField: IFormItem =
        this.accountConstants.loginForm['remember'];

    constructor(
        public accountConstants: AccountConstantsService,
        public loginHttp: LoginHttpService,
        public formHelper: FormHelperService,
        private _loading: LoadingService
    ) {
        this.login$ = loginHttp.watchLogin$();
        formHelper.setFormGroup({
            [this.emailField.label]: new FormControl('JuanDelaCruz@gmail.com'),
            [this.passwordField.label]: new FormControl('TestTest!23'),
            [this.rememberField.label]: new FormControl(
                localStorage.getItem(this.emailField.label) ? true : false
            ),
        });
    }

    public togglePasswordType(): void {
        this.showPassword = !this.showPassword;
    }

    public onChanged({ checked }: any): void {
        localStorage.clear();
        if (checked) {
            localStorage.setItem(
                this.emailField.label,
                this.formHelper.formGroup.get(this.emailField.label)?.value
            );
        }
    }

    public onSubmit(): void {
        this.loginHttp.isLoading = this._loading.showLoading();
        this.loginHttp.login(this.formHelper.formGroup.value);
    }
}
