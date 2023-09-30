import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { RegisterHttpService } from './register-http.service';
import { Observable } from 'rxjs';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RegisterConstantsService } from 'src/app/shared/constants/register-constants.service';

@Component({
    selector: 'app-register',
    template: `
        <div class="w-full">
            <header class="pt-10 pb-10">
                <h1 class="text-6xl font-extrabold tracking-widest text-center">
                    REGISTER
                </h1>
            </header>
            <section>
                <form
                    [formGroup]="formHelper.formGroup"
                    (submit)="onSubmit()"
                    class="flex flex-col"
                    method="POST"
                >
                    <div class="flex flex-col gap-4">
                        <!-- USERNAME -->
                        <div class="flex flex-col gap-2">
                            <label [htmlFor]="usernameField.id">{{
                                usernameField.label
                            }}</label>
                            <input
                                [id]="usernameField.id"
                                [attr.aria-describedby]="
                                    usernameField.id + '-help'
                                "
                                [formControlName]="usernameField.label"
                                [readOnly]="loading.isLoading"
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
                                [attr.aria-describedby]="
                                    emailField.id + '-help'
                                "
                                [formControlName]="emailField.label"
                                [readonly]="loading.isLoading"
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
                                    [readOnly]="loading.isLoading"
                                    (blur)="
                                        formHelper
                                            .getFormControl(
                                                passwordField.label
                                            )!
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
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    "
                                    [autocomplete]="false"
                                    [formControlName]="
                                        confirmPasswordField.label
                                    "
                                    [readOnly]="loading.isLoading"
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
                                        showConfirmPassword =
                                            !showConfirmPassword
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
                            [loading]="loading.isLoading"
                            type="submit"
                            styleClass="w-full"
                            label="Register"
                        ></p-button>

                        <p-button
                            *ngIf="!loading.isLoading; else cancelRegistration"
                            [routerLink]="loginConstants.loginRoute"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-secondary"
                            label="Go back"
                        ></p-button>
                        <ng-template #cancelRegistration>
                            <p-button
                                [routerLink]="loginConstants.loginRoute"
                                type="button"
                                styleClass="w-full p-button-outlined p-button-danger"
                                label="Cancel"
                            ></p-button>
                        </ng-template>
                    </div>
                </form>
            </section>
        </div>
        <app-footer />
        <ng-container *ngIf="register$ | async"></ng-container>
        <ng-container *ngIf="loading$ | async"></ng-container>
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
        RegisterConstantsService,
        LoginConstantsService,
        FormHelperService,
        RegisterHttpService,
        PasswordHelperService,
    ],
})
export class RegisterComponent {
    public register$: Observable<void> = new Observable<void>();
    public loading$: Observable<boolean> = new Observable<boolean>();
    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public readonly usernameField: IFormItem =
        this.registerConstants.registerForm['username'];
    public readonly emailField: IFormItem =
        this.registerConstants.registerForm['email'];
    public readonly passwordField: IFormItem =
        this.registerConstants.registerForm['password'];
    public readonly confirmPasswordField: IFormItem =
        this.registerConstants.registerForm['confirmPassword'];

    constructor(
        public registerConstants: RegisterConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public registerHttp: RegisterHttpService,
        public loading: LoadingService,
        private _passwordHelper: PasswordHelperService
    ) {
        this.loading$ = loading.watchLoading$();
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
                [this.confirmPasswordField.label]: new FormControl(''),
            })
        );

        formHelper
            .getFormControl(this.confirmPasswordField.label)
            ?.addValidators([
                Validators.required,
                this._passwordHelper.passwordsMustMatch(
                    formHelper.getFormControl(this.passwordField.label),
                    formHelper.getFormControl(this.confirmPasswordField.label)
                ),
            ]);
    }

    public onSubmit(): void {
        console.log(this.formHelper.formGroup);
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }

        this.registerHttp.register(this.formHelper.formGroup.value);
    }
}
