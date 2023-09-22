import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { AuthHttpService } from './auth-http.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth',
    template: `
        <header class="flex justify-between items-end pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest">LOGIN</h1>
            <div class="flex flex-col items-end">
                <span>Not a member?</span>
                <a
                    [routerLink]="loginConstants.registerRoute"
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
                            [attr.aria-describedby]="emailField.id + '-help'"
                            [formControlName]="emailField.label"
                            [readonly]="authHttp.isLoading"
                            [autocomplete]="true"
                            pInputText
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
                                [readonly]="authHttp.isLoading"
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
                        [label]="rememberField.label"
                        (onChange)="onChanged($event)"
                    ></p-checkbox>
                    <a
                        [routerLink]="loginConstants.forgotPasswordRoute"
                        class="hover:underline"
                        style="color: var(--primary-color)"
                        >Forgot your password?</a
                    >
                </div>
                <p-button
                    [loading]="authHttp.isLoading"
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
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoginConstantsService, FormHelperService, AuthHttpService],
})
export class AuthComponent implements AfterViewInit {
    public login$: Observable<void> = new Observable<void>();
    public showPassword: boolean = false;

    public readonly emailField: IFormItem =
        this.loginConstants.loginForm['email'];
    public readonly passwordField: IFormItem =
        this.loginConstants.loginForm['password'];
    public readonly rememberField: IFormItem =
        this.loginConstants.loginForm['remember'];

    constructor(
        public loginConstants: LoginConstantsService,
        public authHttp: AuthHttpService,
        public formHelper: FormHelperService,
        private _loading: LoadingService
    ) {
        this.login$ = authHttp.watchLogin$();
        formHelper.setFormGroup(
            new FormGroup({
                [this.emailField.label]: new FormControl(
                    'JuanDelaCruz@gmail.com'
                ),
                [this.passwordField.label]: new FormControl('TestTest!23'),
                [this.rememberField.label]: new FormControl(
                    localStorage.getItem(this.emailField.label) ? true : false
                ),
            })
        );
    }

    public ngAfterViewInit(): void {
        this._loading.endLoading();
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
        this._loading.showLoading();
        this.authHttp.login(this.formHelper.formGroup.value);
    }
}
