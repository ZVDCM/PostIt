import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { IFormItem } from 'src/app/shared/types/formType';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerifyResetTokenHttpService } from './verify-reset-token-http.service';

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
                class="flex flex-col"
                method="POST"
                [formGroup]="formHelper.formGroup"
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
                        [routerLink]="accountConstants.resetPasswordEndpoint"
                        type="submit"
                        styleClass="w-full"
                        label="Verify reset token"
                    ></p-button>
                    <p-button
                        [disabled]="verifyResetTokenHttp.isLoading"
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
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        AccountConstantsService,
        VerifyResetTokenHttpService,
        FormHelperService,
    ],
})
export class VerifyResetTokenComponent {
    public resetTokenField: IFormItem =
        this.accountConstants.resetTokenForm['token'];

    constructor(
        public accountConstants: AccountConstantsService,
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