import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/core/models/form.model';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { SendResetTokenHttpService } from './send-reset-token-http.service';

@Component({
    selector: 'app-send-reset-token',
    template: `
        <header class="pt-40 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest text-center">
                SEND RESET TOKEN
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
                    <label [htmlFor]="emailField.id">{{
                        emailField.label
                    }}</label>
                    <input
                        [id]="emailField.id"
                        [attr.aria-describedby]="emailField.id + '-help'"
                        [formControlName]="emailField.name"
                        [readonly]="loading.isLoading"
                        [autocomplete]="true"
                        (blur)="
                            formHelper
                                .getFormControl(emailField.name)!
                                .markAsDirty()
                        "
                        pInputText
                    />
                    <small
                        *ngIf="emailField.hint !== null"
                        id="{{ emailField.id }}-help"
                        [ngClass]="{
                            hidden: !formHelper.isInputInvalid(emailField.name)
                        }"
                        class="p-error"
                        >{{ emailField.hint }}
                    </small>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="loading.isLoading"
                        type="submit"
                        styleClass="w-full"
                        label="Send reset token"
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
                            (click)="sendResetTokenHttp.cancelRequest()"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-danger"
                            label="Cancel"
                        ></p-button>
                    </ng-template>
                </div>
            </form>
        </section>
        <ng-container *ngIf="loading$ | async"></ng-container>
        <ng-container *ngIf="sendResetToken$ | async"></ng-container>
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
        FormHelperService,
        SendResetTokenHttpService,
    ],
})
export class SendResetTokenComponent {
    public loading$: Observable<boolean> = new Observable<boolean>();
    public sendResetToken$: Observable<void> = new Observable<void>();
    public emailField: IFormItem =
        this.forgotPasswordConstants.forgotPasswordForm['email'];

    constructor(
        public forgotPasswordConstants: ForgotPasswordConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public loading: LoadingService,
        public sendResetTokenHttp: SendResetTokenHttpService
    ) {
        this.loading$ = loading.watchLoading$();
        this.sendResetToken$ = sendResetTokenHttp.watchSendResetToken$();
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.emailField.name]: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
            })
        );
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this.sendResetTokenHttp.sendResetToken(this.formHelper.formGroup.value);
    }
}
