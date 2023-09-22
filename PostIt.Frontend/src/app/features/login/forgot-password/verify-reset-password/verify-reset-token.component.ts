import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerifyResetTokenHttpService } from './verify-reset-token-http.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';

@Component({
    selector: 'app-verify-reset-token',
    template: `
        <header class="pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest text-center">
                VERIFY RESET TOKEN
            </h1>
        </header>
        <section>
            <form
                [formGroup]="formHelper.formGroup"
                class="flex flex-col"
                method="POST"
            >
                <div class="flex flex-col gap-2">
                    <label [htmlFor]="resetTokenField.id">{{
                        resetTokenField.label
                    }}</label>
                    <input
                        [id]="resetTokenField.id"
                        [attr.aria-describedby]="resetTokenField.id + '-help'"
                        [formControlName]="resetTokenField.label"
                        [readonly]="verifyResetTokenHttp.isLoading"
                        [autocomplete]="true"
                        (blur)="
                            formHelper
                                .getFormControl(resetTokenField.label)!
                                .markAsDirty()
                        "
                        pInputText
                    />
                    <small
                        *ngIf="resetTokenField.hint !== null"
                        id="{{ resetTokenField.id }}-help"
                        [ngClass]="{
                            hidden: !formHelper.isInputInvalid(
                                resetTokenField.label
                            )
                        }"
                        class="p-error"
                        >{{ resetTokenField.hint }}
                    </small>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="verifyResetTokenHttp.isLoading"
                        [routerLink]="loginConstants.resetPasswordRoute"
                        type="submit"
                        styleClass="w-full"
                        label="Verify reset token"
                    ></p-button>
                    <p-button
                        [disabled]="verifyResetTokenHttp.isLoading"
                        [routerLink]="loginConstants.loginRoute"
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
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        LoginConstantsService,
        VerifyResetTokenHttpService,
        FormHelperService,
    ],
})
export class VerifyResetTokenComponent {
    public resetTokenField: IFormItem =
        this.loginConstants.resetTokenForm['token'];

    constructor(
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public verifyResetTokenHttp: VerifyResetTokenHttpService,
        private _loading: LoadingService
    ) {
        this._loading.endLoading();
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.resetTokenField.label]: new FormControl('', [
                    Validators.required,
                ]),
            })
        );
    }
}
