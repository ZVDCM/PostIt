import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { IFormItem } from 'src/app/shared/types/formType';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';

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
                            (blur)="
                                formHelper
                                    .getFormControl(usernameField.label)!
                                    .markAsDirty()
                            "
                            pInputText
                            autocomplete
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
                            (blur)="
                                formHelper
                                    .getFormControl(emailField.label)!
                                    .markAsDirty()
                            "
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
                    <!-- CONFIRM PASSWORD -->
                    <div class="flex flex-col gap-2">
                        <label [htmlFor]="passwordField.id">{{
                            passwordField.label
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
                                (click)="toggleConfirmPasswordType()"
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
                        type="submit"
                        styleClass="w-full"
                        label="Register"
                    ></p-button>
                    <p-button
                        type="button"
                        styleClass="w-full p-button-outlined p-button-secondary"
                        label="Cancel"
                        [routerLink]="accountConstants.loginEndpoint"
                    ></p-button>
                </div>
            </form>
        </section>
    `,
    styles: [
        `
            :host {
                @apply w-full max-w-lg;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AccountConstantsService, FormHelperService],
})
export class RegisterComponent {
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
        public formHelper: FormHelperService
    ) {
        formHelper.setFormGroup({
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
            ]),
        });
    }

    public togglePasswordType(): void {
        this.showPassword = !this.showPassword;
    }

    public toggleConfirmPasswordType(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            console.log(this.formHelper.formGroup);
        }
        console.log(this.formHelper.formGroup.invalid);
        console.log(this.formHelper.formGroup.value);
    }
}
