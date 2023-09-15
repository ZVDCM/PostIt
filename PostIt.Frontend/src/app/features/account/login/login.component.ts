import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpConstantsService } from 'src/app/constants/http-constants.service';
import { LoginConstantsService } from 'src/app/constants/login-constants.service';
import { FormHelperService } from 'src/app/core/utils/form-helper.service';

@Component({
    selector: 'app-login',
    template: `
        <header class="flex justify-between items-end pt-36 pb-10">
            <h1 class="text-6xl font-extrabold tracking-widest">LOGIN</h1>
            <div class="flex flex-col items-end">
                <span>Not a member?</span>
                <a
                    class="hover:underline"
                    style="color: var(--primary-color)"
                    [routerLink]="loginConstants.registerEndpoint"
                    >Create an account</a
                >
            </div>
        </header>
        <section>
            <form
                class="flex flex-col gap-4"
                [method]="httpConstants.post"
                [formGroup]="loginForm"
                (submit)="onSubmit()"
            >
                <div class="flex flex-col gap-4">
                    <form-input
                        [label]="loginConstants.loginForm.username.label"
                        [formControlName]="
                            loginConstants.loginForm.username.label
                        "
                    />
                    <form-input-group
                        [label]="loginConstants.loginForm.password.label"
                        [formControlName]="
                            loginConstants.loginForm.password.label
                        "
                        [icon]="showPassword ? 'pi-eye-slash' : 'pi-eye'"
                        [type]="showPassword ? 'text' : 'password'"
                        [hasAutocomplete]="false"
                        (onButtonClick)="togglePasswordType()"
                    />
                </div>
                <div class="flex justify-between">
                    <p-checkbox
                        inputId="remember-me"
                        [value]="true"
                        label="Remember my username"
                    ></p-checkbox>
                    <a
                        class="hover:underline"
                        style="color: var(--primary-color)"
                        [routerLink]="loginConstants.forgotPasswordEndpoint"
                        >Forgot your password?</a
                    >
                </div>
                <p-button
                    type="submit"
                    class="mt-10"
                    styleClass="w-full"
                    label="Login"
                ></p-button>
            </form>
        </section>
    `,
    styles: [
        `
            :host {
                @apply block h-full max-w-2xl mx-auto;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HttpConstantsService, LoginConstantsService, FormHelperService],
})
export class LoginComponent {
    public loginForm: FormGroup = new FormGroup({});
    public showPassword: boolean = false;

    constructor(
        public httpConstants: HttpConstantsService,
        public loginConstants: LoginConstantsService,
        public formHelper: FormHelperService
    ) {
        this.loginForm = this.formHelper.setFormGroup({
            [this.loginConstants.loginForm.username.label]: new FormControl(''),
            [this.loginConstants.loginForm.password.label]: new FormControl(''),
        });
    }

    public onSubmit() {
        console.log(this.loginForm.value);
    }

    public togglePasswordType(): void {
        this.showPassword = !this.showPassword;
    }
}
