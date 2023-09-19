import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { IFormItem } from 'src/app/shared/types/formType';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { RegisterHttpService } from './register-http.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Observable } from 'rxjs';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';

@Component({
    selector: 'app-register',
    template: `
        <header class="pt-10 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest text-center">
                REGISTER
            </h1>
        </header>
        <section>
            <form
                class="flex flex-col"
                method="POST"
                [formGroup]="formHelper.formGroup"
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-4">
                    <!-- USERNAME -->
                    <div class="flex flex-col gap-2">
                        <label [htmlFor]="usernameField.id">{{
                            usernameField.label
                        }}</label>
                        <input
                            [id]="usernameField.id"
                            [attr.aria-describedby]="usernameField.id + '-help'"
                            [formControlName]="usernameField.label"
                            [readOnly]="registerHttp.isLoading"
                            [autocomplete]="true"
                            (blur)="
                                formHelper
                                    .getFormControl(usernameField.label)!
                                    .markAsDirty()
                            "
                            pInputText
                        />
                        <small
                            *ngIf="usernameField.hint !== null"
                            id="{{ usernameField.id }}-help"
                            [ngClass]="{
                                hidden: !formHelper.isInputInvalid(
                                    usernameField.label
                                )
                            }"
                            class="p-error"
                            >{{ usernameField.hint }}
                        </small>
                    </div>
                    <!-- EMAIL -->
                    <div class="flex flex-col gap-2">
                        <label [htmlFor]="emailField.id">{{
                            emailField.label
                        }}</label>
                        <input
                            [id]="emailField.id"
                            [attr.aria-describedby]="emailField.id + '-help'"
                            [formControlName]="emailField.label"
                            [readonly]="registerHttp.isLoading"
                            [autocomplete]="true"
                            (blur)="
                                formHelper
                                    .getFormControl(emailField.label)!
                                    .markAsDirty()
                            "
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
                                [readOnly]="registerHttp.isLoading"
                                (blur)="
                                    formHelper
                                        .getFormControl(passwordField.label)!
                                        .markAsDirty()
                                "
                                pInputText
                            />
                            <button
                                type="button"
                                pButton
                                icon="pi {{
                                    showPassword ? 'pi-eye-slash' : 'pi-eye'
                                }}"
                                (click)="showPassword = !showPassword"
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
                    <!-- CONFIRM PASSWORD -->
                    <div class="flex flex-col gap-2">
                        <label [htmlFor]="confirmPasswordField.id">{{
                            confirmPasswordField.label
                        }}</label>
                        <div class="p-inputgroup">
                            <input
                                [id]="confirmPasswordField.id"
                                [attr.aria-describedby]="
                                    confirmPasswordField.id + '-help'
                                "
                                [type]="
                                    showConfirmPassword ? 'text' : 'password'
                                "
                                [autocomplete]="false"
                                [formControlName]="confirmPasswordField.label"
                                [readOnly]="registerHttp.isLoading"
                                (blur)="
                                    formHelper
                                        .getFormControl(
                                            confirmPasswordField.label
                                        )!
                                        .markAsDirty()
                                "
                                pInputText
                            />
                            <button
                                type="button"
                                pButton
                                icon="pi {{
                                    showConfirmPassword
                                        ? 'pi-eye-slash'
                                        : 'pi-eye'
                                }}"
                                (click)="
                                    showConfirmPassword = !showConfirmPassword
                                "
                            ></button>
                        </div>
                        <small
                            *ngIf="confirmPasswordField.hint !== null"
                            id="{{ confirmPasswordField.id }}-help"
                            [ngClass]="{
                                hidden: !formHelper.isInputInvalid(
                                    confirmPasswordField.label
                                )
                            }"
                            class="p-error"
                            >{{ confirmPasswordField.hint }}</small
                        >
                    </div>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="registerHttp.isLoading"
                        type="submit"
                        styleClass="w-full"
                        label="Register"
                    ></p-button>
                    <p-button
                        [disabled]="registerHttp.isLoading"
                        [routerLink]="accountConstants.loginEndpoint"
                        type="button"
                        styleClass="w-full p-button-outlined p-button-secondary"
                        label="Go back"
                    ></p-button>
                </div>
            </form>
        </section>
        <ng-container *ngIf="register$ | async"></ng-container>
    `,
    styles: [
        `
            :host {
                @apply w-full max-w-lg z-[1];
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        AccountConstantsService,
        FormHelperService,
        RegisterHttpService,
        PasswordHelperService,
    ],
})
export class RegisterComponent {
    public register$: Observable<void> = new Observable<void>();
    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public readonly usernameField: IFormItem =
        this.accountConstants.registerForm['username'];
    public readonly emailField: IFormItem =
        this.accountConstants.registerForm['email'];
    public readonly passwordField: IFormItem =
        this.accountConstants.registerForm['password'];
    public readonly confirmPasswordField: IFormItem =
        this.accountConstants.registerForm['confirmPassword'];

    constructor(
        public accountConstants: AccountConstantsService,
        public formHelper: FormHelperService,
        public registerHttp: RegisterHttpService,
        public passwordHelper: PasswordHelperService,
        private _loading: LoadingService
    ) {
        _loading.endLoading();
        this.register$ = this.registerHttp.watchRegister$();
        formHelper.setFormGroup(
            new FormGroup({
                [this.usernameField.label]: new FormControl('', [
                    Validators.required,
                ]),
                [this.emailField.label]: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
                [this.passwordField.label]: new FormControl('', [
                    Validators.required,
                ]),
                [this.confirmPasswordField.label]: new FormControl('', [
                    Validators.required,
                    passwordHelper.passwordsMustMatch(
                        formHelper.getFormControl(this.passwordField.label),
                        formHelper.getFormControl(
                            this.confirmPasswordField.label
                        )
                    ),
                ]),
            })
        );
    }

    public onSubmit(): void {
        console.log(this.formHelper.formGroup);
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this._loading.showLoading();
        this.registerHttp.register(this.formHelper.formGroup.value);
    }
}
