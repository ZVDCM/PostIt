import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpConstantsService } from 'src/app/constants/http-constants.service';
import { LoginConstantsService } from 'src/app/constants/login-constants.service';

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
                    [routerLink]="loginConstants.ForgotPasswordEndpoint"
                    >Create an account</a
                >
            </div>
        </header>
        <section>
            <form class="flex flex-col gap-4" [method]="httpConstants.Post">
                <div class="flex flex-col gap-4">
                    <form-input
                        [Label]="loginConstants.LoginForm.Username.Label"
                    />
                    <form-input-group
                        [Label]="loginConstants.LoginForm.Password.Label"
                        Icon="pi-eye"
                        [HasAutocomplete]="false"
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
                        [routerLink]="loginConstants.ForgotPasswordEndpoint"
                        >Forgot your password?</a
                    >
                </div>
                <p-button
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
    providers: [HttpConstantsService, LoginConstantsService],
})
export class LoginComponent {
    constructor(
        public httpConstants: HttpConstantsService,
        public loginConstants: LoginConstantsService
    ) {}
}
