import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { IFormItem } from 'src/app/core/models/form.model';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';
import { UpdateProfileHttpService } from './update-profile-http.service';
import { UpdatePasswordHttpService } from './update-password-http.service';

@Component({
    selector: 'app-home',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <aside
                class="h-screen sticky top-0 flex flex-col flex-1 items-end"
                style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
            >
                <nav class="h-full flex flex-col gap-5 py-10 pl-10">
                    <header
                        [routerLink]="homeConstants.homeEndpoint"
                        class="cursor-pointer mb-14 pr-10 focus:outline-none"
                    >
                        <h1
                            class="text-6xl font-extrabold tracking-widest rounded-none"
                        >
                            POST
                            <span style="color: var(--primary-color)">IT</span>
                        </h1>
                    </header>
                    <button
                        [ngClass]="{ active: isPostsActive }"
                        (click)="onClickPosts()"
                        class="nav-button"
                        icon="pi pi-camera"
                        pButton
                    >
                        <span>Posts</span>
                    </button>
                    <button
                        [ngClass]="{ active: isProfileActive }"
                        (click)="onClickProfile()"
                        class="nav-button"
                        icon="pi pi-user"
                        pButton
                    >
                        <span>Profile</span>
                    </button>
                    <div class="mt-auto mr-11">
                        <p-splitButton
                            [menuStyle]="{ width: '100%' }"
                            [model]="items"
                            class="w-full"
                            styleClass="w-full"
                            label="JuanDelaCruz"
                        >
                            <ng-template pTemplate="content">
                                <div class="flex items-center gap-4">
                                    <i class="pi pi-at p-button-icon"></i>
                                    <span class="p-button-label">{{
                                        user.username
                                    }}</span>
                                </div>
                            </ng-template>
                            <ng-template pTemplate="dropdownicon">
                                <i class="pi pi-chevron-up"></i>
                            </ng-template>
                        </p-splitButton>
                    </div>
                </nav>
            </aside>
            <div
                class="h-full w-full max-w-3xl"
                style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
            >
                <router-outlet />
            </div>
            <aside class="h-screen sticky top-0 flex-1">
                <div class="flex flex-col p-10">
                    <div class="p-inputgroup">
                        <input
                            id="txt-search"
                            pInputText
                            placeholder="Search"
                        />
                        <button
                            type="button"
                            pButton
                            icon="pi pi-search"
                        ></button>
                    </div>
                </div>
                <div
                    class="absolute bottom-0 right-0 flex flex-col items-end p-12 font-extrabold text-slate-600"
                >
                    <div class="space-x-2">
                        <span>Z</span>
                        <span>V</span>
                        <span>D</span>
                        <span>C</span>
                        <span>M</span>
                    </div>
                    <div class="space-x-2">
                        <span>2</span>
                        <span>0</span>
                        <span>2</span>
                        <span>3</span>
                    </div>
                </div>
            </aside>
        </ng-container>
        <p-dialog
            [(visible)]="showModal"
            [modal]="true"
            [resizable]="false"
            [draggable]="false"
            [closeOnEscape]="false"
            [header]="isProfileForm ? 'Update Profile' : 'Update Password'"
            (onHide)="onModalHide()"
            styleClass="w-full max-w-lg"
        >
            <ng-container *ngIf="isProfileForm; else passwordForm">
                <form
                    [formGroup]="profileFormHelper.formGroup"
                    (submit)="onProfileSubmit()"
                    method="POST"
                >
                    <div class="flex flex-col gap-4">
                        <!-- USERNAME -->
                        <div class="flex flex-col gap-2">
                            <label [htmlFor]="usernameField.id">{{
                                usernameField.label
                            }}</label>
                            <input
                                [id]="usernameField.id"
                                [attr.aria-describedby]="
                                    usernameField.id + '-help'
                                "
                                [formControlName]="usernameField.label"
                                [readOnly]="updateProfileHttp.isLoading"
                                [autocomplete]="true"
                                (blur)="
                                    profileFormHelper
                                        .getFormControl(usernameField.label)!
                                        .markAsDirty()
                                "
                                pInputText
                            />
                            <small
                                *ngIf="usernameField.hint !== null"
                                id="{{ usernameField.id }}-help"
                                [ngClass]="{
                                    hidden: !profileFormHelper.isInputInvalid(
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
                                [attr.aria-describedby]="
                                    emailField.id + '-help'
                                "
                                [formControlName]="emailField.label"
                                [readonly]="updateProfileHttp.isLoading"
                                [autocomplete]="true"
                                (blur)="
                                    profileFormHelper
                                        .getFormControl(emailField.label)!
                                        .markAsDirty()
                                "
                                pInputText
                            />
                            <small
                                *ngIf="emailField.hint !== null"
                                id="{{ emailField.id }}-help"
                                [ngClass]="{
                                    hidden: !profileFormHelper.isInputInvalid(
                                        emailField.label
                                    )
                                }"
                                class="p-error"
                                >{{ emailField.hint }}
                            </small>
                        </div>
                    </div>
                    <div class="flex flex-col gap-5 mt-10">
                        <p-button
                            [loading]="updateProfileHttp.isLoading"
                            type="submit"
                            styleClass="w-full"
                            label="Register"
                        ></p-button>
                        <p-button
                            [disabled]="updateProfileHttp.isLoading"
                            (click)="showModal = false"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-danger"
                            label="Cancel"
                        ></p-button>
                    </div>
                </form>
            </ng-container>
            <ng-template #passwordForm>
                <form
                    [formGroup]="passwordFormHelper.formGroup"
                    (submit)="onPasswordSubmit()"
                    method="POST"
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
                                    [readOnly]="updatePasswordHttp.isLoading"
                                    (blur)="
                                        passwordFormHelper
                                            .getFormControl(
                                                passwordField.label
                                            )!
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
                                    hidden: !passwordFormHelper.isInputInvalid(
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
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    "
                                    [autocomplete]="false"
                                    [formControlName]="
                                        confirmPasswordField.label
                                    "
                                    [readOnly]="updatePasswordHttp.isLoading"
                                    (blur)="
                                        passwordFormHelper
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
                                        showConfirmPassword =
                                            !showConfirmPassword
                                    "
                                ></button>
                            </div>
                            <small
                                *ngIf="confirmPasswordField.hint !== null"
                                id="{{ confirmPasswordField.id }}-help"
                                [ngClass]="{
                                    hidden: !passwordFormHelper.isInputInvalid(
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
                            [loading]="updatePasswordHttp.isLoading"
                            type="submit"
                            styleClass="w-full"
                            label="Register"
                        ></p-button>
                        <p-button
                            [disabled]="updatePasswordHttp.isLoading"
                            (click)="showModal = false"
                            type="button"
                            styleClass="w-full p-button-outlined p-button-danger"
                            label="Cancel"
                        ></p-button>
                    </div>
                </form>
            </ng-template>
        </p-dialog>
    `,
    styles: [
        `
            :host {
                @apply h-full flex;

                .nav-button {
                    @apply h-[3rem] flex items-center gap-4 text-gray-400 tracking-wider font-medium;

                    &.active {
                        background-color: var(--primary-color);
                        color: black;
                    }

                    background-color: var(--surface-card);
                    border: none;
                    border-radius: 0;
                    transition: all 0.2s;
                }

                p-toggleButton {
                    ::ng-deep .p-button {
                        @apply rounded-none border-0;

                        &:not(.p-highlight) {
                            .p-button-label {
                                @apply text-gray-400;
                            }
                        }

                        .p-button-label {
                            @apply ml-5;
                            flex: unset;
                        }
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        HomeConstantsService,
        AccountConstantsService,
        { provide: 'profileFormHelper', useClass: FormHelperService },
        UpdateProfileHttpService,
        { provide: 'passwordFormHelper', useClass: FormHelperService },
        UpdatePasswordHttpService,
        FormHelperService,
        PasswordHelperService,
    ],
})
export class HomeComponent implements AfterViewInit {
    public user$: Observable<IUser> = new Observable<IUser>();
    public items: MenuItem[] = [];
    public isPostsActive: boolean = true;
    public isProfileActive: boolean = false;
    public showModal: boolean = false;
    public isProfileForm: boolean = true;
    public showPassword: boolean = false;
    public showConfirmPassword: boolean = false;

    public readonly usernameField: IFormItem =
        this.homeConstants.profileForm['username'];
    public readonly emailField: IFormItem =
        this.homeConstants.profileForm['email'];
    public readonly passwordField: IFormItem =
        this.homeConstants.passwordForm['password'];
    public readonly confirmPasswordField: IFormItem =
        this.homeConstants.passwordForm['confirmPassword'];

    constructor(
        public accountConstants: AccountConstantsService,
        public homeConstants: HomeConstantsService,
        @Inject('profileFormHelper')
        public profileFormHelper: FormHelperService,
        public updateProfileHttp: UpdateProfileHttpService,
        @Inject('passwordFormHelper')
        public passwordFormHelper: FormHelperService,
        public updatePasswordHttp: UpdatePasswordHttpService,
        private _passwordHelper: PasswordHelperService,
        private _store: Store,
        private _loading: LoadingService
    ) {
        this.user$ = this._store.select(selectUser);
        this.items = [
            {
                label: 'Update Profile',
                icon: 'pi pi-user',
                command: () => {
                    this.showModal = true;
                    this.isProfileForm = true;
                },
            },
            {
                label: 'Update Password',
                icon: 'pi pi-lock',
                command: () => {
                    this.showModal = true;
                    this.isProfileForm = false;
                },
            },
            { separator: true },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                routerLink: [accountConstants.loginEndpoint],
            },
        ];

        this.initProfileForm();
        this.initPasswordForm();
    }

    public ngAfterViewInit(): void {
        this._loading.endLoading();
    }

    public onClickPosts() {
        this.isPostsActive = true;
        this.isProfileActive = false;
    }

    public onClickProfile() {
        this.isPostsActive = false;
        this.isProfileActive = true;
    }

    public onProfileSubmit(): void {
        if (this.profileFormHelper.formGroup.invalid) {
            this.profileFormHelper.validateAllFormInputs();
        }
    }

    public onPasswordSubmit(): void {
        if (this.passwordFormHelper.formGroup.invalid) {
            this.passwordFormHelper.validateAllFormInputs();
        }
    }

    public onModalHide() {
        if (this.isProfileForm) {
            this.initProfileForm();
        } else {
            this.initPasswordForm();
        }
    }

    private initProfileForm(): void {
        this.profileFormHelper.setFormGroup(
            new FormGroup({
                [this.usernameField.label]: new FormControl('', [
                    Validators.required,
                ]),
                [this.emailField.label]: new FormControl('', [
                    Validators.required,
                    Validators.email,
                ]),
            })
        );
    }

    private initPasswordForm(): void {
        this.passwordFormHelper.setFormGroup(
            new FormGroup({
                [this.passwordField.label]: new FormControl('', [
                    Validators.required,
                ]),
                [this.confirmPasswordField.label]: new FormControl('', [
                    Validators.required,
                    this._passwordHelper.passwordsMustMatch(
                        this.passwordFormHelper.getFormControl(
                            this.passwordField.label
                        ),
                        this.passwordFormHelper.getFormControl(
                            this.confirmPasswordField.label
                        )
                    ),
                ]),
            })
        );
    }
}
