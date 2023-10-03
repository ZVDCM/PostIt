import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';
import { ResetPasswordHttpService } from './reset-password-http.service';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-reset-password',
    template: `
        <header class="pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest text-center">
                RESET PASSWORD
            </h1>
        </header>
        <section>
            <form
                [formGroup]="formHelper.formGroup"
                class="flex flex-col"
                method="POST"
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-4">
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
                                [readOnly]="loading.isLoading"
                                (blur)="
                                    formHelper
                                        .getFormControl(passwordField.name)!
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
                                    passwordField.name
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
                                [formControlName]="confirmPasswordField.name"
                                [readOnly]="loading.isLoading"
                                (blur)="
                                    formHelper
                                        .getFormControl(
                                            confirmPasswordField.name
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
                                    confirmPasswordField.name
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
                        [routerLink]="
                            forgotPasswordConstants.resetPasswordRoute
                        "
                        type="submit"
                        styleClass="w-full"
                        label="Reset Password"
                    ></p-button>
                    <p-button
                        *ngIf="!loading.isLoading; else cancel"
                        [routerLink]="loginConstants.loginRoute"
                        type="button"
                        styleClass="w-full p-button-outlined p-button-secondary"
                        label="Go back"
                    ></p-button>
                    <ng-template #cancel>
                        <p-button
                            (click)="resetPasswordHttp.cancelRequest()"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-danger"
                            label="Cancel"
                        ></p-button>
                    </ng-template>
                </div>
            </form>
        </section>
        <ng-container *ngIf="resetPassword$ | async"></ng-container>
        <ng-container *ngIf="loading$ | async"></ng-container>
    `,
    styles: [
        `
            :host {
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ForgotPasswordConstantsService,
        LoginConstantsService,
        ResetPasswordHttpService,
        FormHelperService,
        PasswordHelperService,
    ],
})
export class ResetPasswordComponent {
    public loading$: Observable<boolean> = new Observable<boolean>();
    public resetPassword$: Observable<void> = new Observable<void>();

    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public passwordField: IFormItem =
        this.forgotPasswordConstants.resetPasswordForm['resetNewPassword'];
    public confirmPasswordField: IFormItem =
        this.forgotPasswordConstants.resetPasswordForm['resetConfirmPassword'];

    constructor(
        public forgotPasswordConstants: ForgotPasswordConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public resetPasswordHttp: ResetPasswordHttpService,
        public loading: LoadingService,
        private _passwordHelper: PasswordHelperService
    ) {
        this.resetPassword$ = resetPasswordHttp.watchResetPassword$();
        formHelper.setFormGroup(
            new FormGroup({
                [this.passwordField.name]: new FormControl('', [
                    Validators.required,
                ]),
                [this.confirmPasswordField.name]: new FormControl(''),
            })
        );

        formHelper
            .getFormControl(this.confirmPasswordField.name)
            ?.addValidators([
                Validators.required,
                _passwordHelper.passwordsMustMatch(
                    formHelper.getFormControl(this.passwordField.name),
                    formHelper.getFormControl(this.confirmPasswordField.name)
                ),
            ]);
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        const {
            [this.confirmPasswordField.name]: confirmPassword,
            ...newObject
        } = this.formHelper.formGroup.value;
        this.resetPasswordHttp.resetPassword(newObject);
    }
}
