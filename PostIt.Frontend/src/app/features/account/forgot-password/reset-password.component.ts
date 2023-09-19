import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { ForgotPasswordHttpService } from './forgot-password-http.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { IFormItem } from 'src/app/shared/types/formType';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';
import { ResetPasswordHttpService } from './reset-password-http.service';

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
                class="flex flex-col"
                method="POST"
                [formGroup]="formHelper.formGroup"
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
                                [formControlName]="passwordField.label"
                                [readOnly]="resetPasswordHttp.isLoading"
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
                                [readOnly]="resetPasswordHttp.isLoading"
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
                        [loading]="resetPasswordHttp.isLoading"
                        [routerLink]="accountConstants.resetPasswordEndpoint"
                        type="submit"
                        styleClass="w-full"
                        label="Reset Password"
                    ></p-button>
                    <p-button
                        [disabled]="resetPasswordHttp.isLoading"
                        [routerLink]="accountConstants.loginEndpoint"
                        type="button"
                        styleClass="w-full p-button-outlined p-button-danger"
                        label="Cancel"
                    ></p-button>
                </div>
            </form>
        </section>
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
        ResetPasswordHttpService,
        FormHelperService,
        PasswordHelperService,
    ],
})
export class ResetPasswordComponent {
    public passwordField: IFormItem =
        this.accountConstants.resetPasswordForm['resetNewPassword'];
    public confirmPasswordField: IFormItem =
        this.accountConstants.resetPasswordForm['resetConfirmPassword'];
    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    constructor(
        public accountConstants: AccountConstantsService,
        public formHelper: FormHelperService,
        public resetPasswordHttp: ResetPasswordHttpService,
        private _loading: LoadingService,
        public passwordHelper: PasswordHelperService
    ) {
        _loading.endLoading();
        formHelper.setFormGroup(
            new FormGroup({
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
}
