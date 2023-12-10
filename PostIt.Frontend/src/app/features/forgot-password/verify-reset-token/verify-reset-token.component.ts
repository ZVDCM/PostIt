import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { VerifyResetTokenHttpService } from '../../../shared/services/users/forget-password/verify-reset-token-http.service';
import { Observable } from 'rxjs';

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
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-2">
                    <label [htmlFor]="resetTokenField.id">{{
                        resetTokenField.label
                    }}</label>
                    <input
                        [id]="resetTokenField.id"
                        [attr.aria-describedby]="resetTokenField.id + '-help'"
                        [formControlName]="resetTokenField.name"
                        [readonly]="loading.isLoading"
                        [autocomplete]="true"
                        (blur)="
                            formHelper
                                .getFormControl(resetTokenField.name)!
                                .markAsDirty()
                        "
                        pInputText
                    />
                    <small
                        *ngIf="resetTokenField.hint !== null"
                        id="{{ resetTokenField.id }}-help"
                        [ngClass]="{
                            hidden: !formHelper.isInputInvalid(
                                resetTokenField.name
                            )
                        }"
                        class="p-error"
                        >{{ resetTokenField.hint }}
                    </small>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="loading.isLoading"
                        type="submit"
                        styleClass="w-full"
                        label="Verify reset token"
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
                            (click)="verifyResetTokenHttp.cancelRequest()"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-danger"
                            label="Cancel"
                        ></p-button>
                    </ng-template>
                </div>
            </form>
        </section>
        <ng-container *ngIf="loading$ | async"></ng-container>
        <ng-container *ngIf="verifyResetToken$ | async"></ng-container>
    `,
    styles: [
        `
            :host {
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyResetTokenComponent {
    public verifyResetToken$: Observable<void> = new Observable<void>();
    public loading$: Observable<boolean> = new Observable<boolean>();
    public resetTokenField: IFormItem =
        this.forgotPasswordConstants.resetTokenForm['token'];

    constructor(
        public forgotPasswordConstants: ForgotPasswordConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public loading: LoadingService,
        public verifyResetTokenHttp: VerifyResetTokenHttpService
    ) {
        this.verifyResetToken$ = verifyResetTokenHttp.watchVerifyResetToken$();
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.resetTokenField.name]: new FormControl('', [
                    Validators.required,
                ]),
            })
        );
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this.verifyResetTokenHttp.verifyResetToken(
            this.formHelper.formGroup.value
        );
    }
}
