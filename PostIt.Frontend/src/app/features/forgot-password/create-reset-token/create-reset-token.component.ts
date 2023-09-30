import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/core/models/form.model';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';

@Component({
    selector: 'app-create-reset-token',
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
                            hidden: !formHelper.isInputInvalid(emailField.label)
                        }"
                        class="p-error"
                        >{{ emailField.hint }}
                    </small>
                </div>
                <div class="flex flex-col gap-5 mt-10">
                    <p-button
                        [loading]="loading.isLoading"
                        [routerLink]="
                            forgotPasswordConstants.verifyResetTokenRoute
                        "
                        type="submit"
                        styleClass="w-full"
                        label="Send reset token"
                    ></p-button>
                    <p-button
                        [disabled]="loading.isLoading"
                        [routerLink]="loginConstants.loginRoute"
                        type="button"
                        styleClass="w-full p-button-outlined p-button-secondary"
                        label="Go back"
                    ></p-button>
                </div>
            </form>
        </section>
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
        FormHelperService,
    ],
})
export class CreateResetTokenComponent {
    public loading$: Observable<boolean> = new Observable<boolean>();
    public emailField: IFormItem =
        this.forgotPasswordConstants.forgotPasswordForm['email'];

    constructor(
        public forgotPasswordConstants: ForgotPasswordConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService,
        public loading: LoadingService
    ) {
        this.loading$ = loading.watchLoading$();
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
