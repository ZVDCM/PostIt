import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { ForgotPasswordHttpService } from './forgot-password-http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IFormItem } from 'src/app/core/models/form.model';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'app-forgot-password',
    template: `
        <header class="pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest text-center">
                FORGOT PASSWORD
            </h1>
        </header>
        <section>
            <form
                [formGroup]="formHelper.formGroup"
                class="flex flex-col"
                method="POST"
            >
                <div class="flex flex-col gap-2">
                    <label [htmlFor]="emailField.id">{{
                        emailField.label
                    }}</label>
                    <input
                        [id]="emailField.id"
                        [attr.aria-describedby]="emailField.id + '-help'"
                        [formControlName]="emailField.label"
                        [readonly]="forgotPasswordHttp.isLoading"
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
                            hidden: !formHelper.isInputInvalid(emailField.label)
                        }"
                        class="p-error"
                        >{{ emailField.hint }}
                    </small>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="forgotPasswordHttp.isLoading"
                        [routerLink]="loginConstants.verifyResetTokenRoute"
                        type="submit"
                        styleClass="w-full"
                        label="Send reset token"
                    ></p-button>
                    <p-button
                        [disabled]="forgotPasswordHttp.isLoading"
                        [routerLink]="loginConstants.loginRoute"
                        type="button"
                        styleClass="w-full p-button-outlined p-button-secondary"
                        label="Go back"
                    ></p-button>
                </div>
            </form>
        </section>
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
        LoginConstantsService,
        ForgotPasswordHttpService,
        FormHelperService,
    ],
})
export class ForgotPasswordComponent {
    public emailField: IFormItem =
        this.loginConstants.forgotPasswordForm['email'];

    constructor(
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public forgotPasswordHttp: ForgotPasswordHttpService,
        private _loading: LoadingService
    ) {
        this._loading.endLoading();
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.emailField.label]: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
            })
        );
    }
}