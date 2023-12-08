import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable, Subject, interval, take, tap } from 'rxjs';
import { IFormItem } from 'src/app/core/models/form.model';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { PasswordHelperService } from 'src/app/shared/utils/password-helper.service';
import { UpdateProfileHttpService } from './update-profile-http.service';
import { ChangePasswordHttpService } from './change-password-http.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { RefreshHttpService } from 'src/app/shared/services/refresh-http.service';
import { LogoutHttpService } from './logout-http.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { VerifyVerificationTokenHttpService } from './verify-verification-token-http.service';
import { SendVerificationTokenHttpService } from './send-verification-token-http.service';

@Component({
    selector: 'app-home',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <aside
                class="h-screen sticky top-0 flex flex-col flex-1 items-end bg-[var(--surface-ground)]"
                style="border-right: 1px solid var(--surface-border)"
            >
                <nav class="h-full flex flex-col gap-5 py-10 pl-10">
                    <header
                        (click)="onClickPosts()"
                        class="cursor-pointer mb-14 pr-10 focus:outline-none"
                    >
                        <h1
                            class="text-6xl font-extrabold tracking-widest rounded-none"
                        >
                            POST
                            <span class="text-[var(--primary-color)]">IT</span>
                        </h1>
                    </header>
                    <button
                        [ngClass]="{
                            active: location
                                .path()
                                .includes(homeConstants.postsRoute)
                        }"
                        (click)="onClickPosts()"
                        class="nav-button"
                        icon="pi pi-camera"
                        pButton
                    >
                        Posts
                    </button>
                    <button
                        [ngClass]="{
                            active:
                                location.path() === homeConstants.profileRoute
                        }"
                        (click)="onClickProfile()"
                        class="nav-button"
                        icon="pi pi-user"
                        pButton
                    >
                        Profile
                    </button>
                    <div class="w-full mt-auto flex justify-start items-center">
                        <p-splitButton
                            [menuStyle]="{ width: '100%' }"
                            [model]="items"
                            (onClick)="onClickUsername(user)"
                        >
                            <ng-template pTemplate="content">
                                <div
                                    [pTooltip]="addToolTip ? user.username : ''"
                                    class="w-full flex items-center gap-4"
                                    tooltipPosition="top"
                                >
                                    <i class="pi pi-at"></i>
                                    <span
                                        #username
                                        class="font-bold text-ellipsis overflow-hidden"
                                        >{{ user.username }}</span
                                    >
                                </div>
                            </ng-template>
                            <ng-template pTemplate="dropdownicon">
                                <i class="pi pi-chevron-up"></i>
                            </ng-template>
                        </p-splitButton>
                        <div class="w-[5rem] flex justify-center items-center">
                            <i
                                *ngIf="user.isVerified"
                                class="pi pi-verified text-[var(--primary-color)]"
                            ></i>
                        </div>
                    </div>
                </nav>
            </aside>
            <div
                class="h-full w-full max-w-3xl bg-[var(--surface-ground)]"
                style="border-right: 1px solid var(--surface-border)"
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
            <p-dialog
                [(visible)]="showModal"
                [modal]="true"
                [resizable]="false"
                [draggable]="false"
                [closeOnEscape]="false"
                [header]="setHeader()"
                (onHide)="onModalHide(user)"
                styleClass="w-full max-w-lg"
            >
                <div [ngSwitch]="activeForm">
                    <div *ngSwitchCase="0">
                        <form
                            [formGroup]="verifyAccountFormHelper.formGroup"
                            (submit)="onVerifyAccountSubmit()"
                            method="PUT"
                        >
                            <div class="flex flex-col gap-4">
                                <!-- TOKEN -->
                                <div class="flex flex-col gap-2">
                                    <label [htmlFor]="tokenField.id"
                                        >{{ tokenField.label }}
                                        <span
                                            class="float-right"
                                            [ngClass]="{
                                                'cursor-pointer': !loading.isLoading,
                                                'hover:underline': !loading.isLoading,
                                            }"
                                            [ngStyle]="{
                                                color: loading.isLoading
                                                    ? 'var(--primary-800)'
                                                    : 'var(--primary-color)'
                                            }"
                                            (click)="
                                                sendVerificationTokenHttp.sendVerificationToken()
                                            "
                                            >get token</span
                                        ></label
                                    >
                                    <input
                                        [id]="tokenField.id"
                                        [attr.aria-describedby]="
                                            tokenField.id + '-help'
                                        "
                                        [formControlName]="tokenField.name"
                                        [readOnly]="loading.isLoading"
                                        [autocomplete]="true"
                                        (blur)="
                                            verifyAccountFormHelper
                                                .getFormControl(
                                                    tokenField.name
                                                )!
                                                .markAsDirty()
                                        "
                                        pInputText
                                    />
                                    <small
                                        *ngIf="tokenField.hint !== null"
                                        id="{{ tokenField.id }}-help"
                                        [ngClass]="{
                                            hidden: !verifyAccountFormHelper.isInputInvalid(
                                                tokenField.name
                                            )
                                        }"
                                        class="p-error"
                                        >{{ tokenField.hint }}
                                    </small>
                                </div>
                            </div>
                            <div class="flex flex-col gap-5 mt-10">
                                <p-button
                                    [loading]="loading.isLoading"
                                    type="submit"
                                    styleClass="w-full"
                                    label="Verify account"
                                ></p-button>
                                <p-button
                                    *ngIf="!loading.isLoading; else cancel"
                                    (click)="showModal = false"
                                    type="button"
                                    styleClass="w-full p-button-outlined p-button-secondary"
                                    label="Cancel"
                                ></p-button>
                                <ng-template #cancel>
                                    <p-button
                                        (click)="
                                            verifyVerificationTokenHttp.cancelRequest()
                                        "
                                        type="button"
                                        styleClass="w-full p-button-outlined p-button-danger"
                                        label="Cancel"
                                    ></p-button>
                                </ng-template>
                            </div>
                        </form>
                    </div>
                    <div *ngSwitchCase="1">
                        <form
                            [formGroup]="profileFormHelper.formGroup"
                            (submit)="onProfileSubmit(user)"
                            method="PUT"
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
                                        [formControlName]="usernameField.name"
                                        [readOnly]="loading.isLoading"
                                        [autocomplete]="true"
                                        (blur)="
                                            profileFormHelper
                                                .getFormControl(
                                                    usernameField.name
                                                )!
                                                .markAsDirty()
                                        "
                                        pInputText
                                    />
                                    <small
                                        *ngIf="usernameField.hint !== null"
                                        id="{{ usernameField.id }}-help"
                                        [ngClass]="{
                                            hidden: !profileFormHelper.isInputInvalid(
                                                usernameField.name
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
                                        [formControlName]="emailField.name"
                                        [readonly]="loading.isLoading"
                                        [autocomplete]="true"
                                        (blur)="
                                            profileFormHelper
                                                .getFormControl(
                                                    emailField.name
                                                )!
                                                .markAsDirty()
                                        "
                                        pInputText
                                    />
                                    <small
                                        *ngIf="emailField.hint !== null"
                                        id="{{ emailField.id }}-help"
                                        [ngClass]="{
                                            hidden: !profileFormHelper.isInputInvalid(
                                                emailField.name
                                            )
                                        }"
                                        class="p-error"
                                        >{{ emailField.hint }}
                                    </small>
                                </div>
                            </div>
                            <div class="flex flex-col gap-5 mt-10">
                                <p-button
                                    [loading]="loading.isLoading"
                                    type="submit"
                                    styleClass="w-full"
                                    label="Update profile"
                                ></p-button>
                                <p-button
                                    *ngIf="!loading.isLoading; else cancel"
                                    (click)="showModal = false"
                                    type="button"
                                    styleClass="w-full p-button-outlined p-button-secondary"
                                    label="Cancel"
                                ></p-button>
                                <ng-template #cancel>
                                    <p-button
                                        (click)="
                                            updateProfileHttp.cancelRequest()
                                        "
                                        type="button"
                                        styleClass="w-full p-button-outlined p-button-danger"
                                        label="Cancel"
                                    ></p-button>
                                </ng-template>
                            </div>
                        </form>
                    </div>
                    <div *ngSwitchCase="2">
                        <form
                            [formGroup]="passwordFormHelper.formGroup"
                            (submit)="onPasswordSubmit()"
                            method="PUT"
                        >
                            <div class="flex flex-col gap-4">
                                <!-- OLD PASSWORD -->
                                <div class="flex flex-col gap-2">
                                    <label [htmlFor]="oldPasswordField.id">{{
                                        oldPasswordField.label
                                    }}</label>
                                    <div class="p-inputgroup">
                                        <input
                                            [id]="oldPasswordField.id"
                                            [attr.aria-describedby]="
                                                oldPasswordField.id + '-help'
                                            "
                                            [type]="
                                                showOldPassword
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            [autocomplete]="false"
                                            [formControlName]="
                                                oldPasswordField.name
                                            "
                                            [readOnly]="loading.isLoading"
                                            (blur)="
                                                passwordFormHelper
                                                    .getFormControl(
                                                        oldPasswordField.name
                                                    )!
                                                    .markAsDirty()
                                            "
                                            pInputText
                                        />
                                        <button
                                            type="button"
                                            pButton
                                            icon="pi {{
                                                showOldPassword
                                                    ? 'pi-eye-slash'
                                                    : 'pi-eye'
                                            }}"
                                            (click)="
                                                showOldPassword =
                                                    !showOldPassword
                                            "
                                        ></button>
                                    </div>
                                    <small
                                        *ngIf="oldPasswordField.hint !== null"
                                        id="{{ oldPasswordField.id }}-help"
                                        [ngClass]="{
                                            hidden: !passwordFormHelper.isInputInvalid(
                                                oldPasswordField.name
                                            )
                                        }"
                                        class="p-error"
                                        >{{ oldPasswordField.hint }}</small
                                    >
                                </div>
                                <!-- NEW PASSWORD -->
                                <div class="flex flex-col gap-2">
                                    <label [htmlFor]="newPasswordField.id">{{
                                        newPasswordField.label
                                    }}</label>
                                    <div class="p-inputgroup">
                                        <input
                                            [id]="newPasswordField.id"
                                            [attr.aria-describedby]="
                                                newPasswordField.id + '-help'
                                            "
                                            [type]="
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            [autocomplete]="false"
                                            [formControlName]="
                                                newPasswordField.name
                                            "
                                            [readOnly]="loading.isLoading"
                                            (blur)="
                                                passwordFormHelper
                                                    .getFormControl(
                                                        newPasswordField.name
                                                    )!
                                                    .markAsDirty()
                                            "
                                            pInputText
                                        />
                                        <button
                                            type="button"
                                            pButton
                                            icon="pi {{
                                                showNewPassword
                                                    ? 'pi-eye-slash'
                                                    : 'pi-eye'
                                            }}"
                                            (click)="
                                                showNewPassword =
                                                    !showNewPassword
                                            "
                                        ></button>
                                    </div>
                                    <small
                                        *ngIf="newPasswordField.hint !== null"
                                        id="{{ newPasswordField.id }}-help"
                                        [ngClass]="{
                                            hidden: !passwordFormHelper.isInputInvalid(
                                                newPasswordField.name
                                            )
                                        }"
                                        class="p-error"
                                        >{{ newPasswordField.hint }}</small
                                    >
                                </div>
                                <!-- CONFIRM PASSWORD -->
                                <div class="flex flex-col gap-2">
                                    <label
                                        [htmlFor]="confirmPasswordField.id"
                                        >{{ confirmPasswordField.label }}</label
                                    >
                                    <div class="p-inputgroup">
                                        <input
                                            [id]="confirmPasswordField.id"
                                            [attr.aria-describedby]="
                                                confirmPasswordField.id +
                                                '-help'
                                            "
                                            [type]="
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            [autocomplete]="false"
                                            [formControlName]="
                                                confirmPasswordField.name
                                            "
                                            [readOnly]="loading.isLoading"
                                            (blur)="
                                                passwordFormHelper
                                                    .getFormControl(
                                                        confirmPasswordField.name
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
                                        *ngIf="
                                            confirmPasswordField.hint !== null
                                        "
                                        id="{{ confirmPasswordField.id }}-help"
                                        [ngClass]="{
                                            hidden: !passwordFormHelper.isInputInvalid(
                                                confirmPasswordField.name
                                            )
                                        }"
                                        class="p-error"
                                        >{{ confirmPasswordField.hint }}</small
                                    >
                                </div>
                            </div>
                            <div class="flex flex-col gap-5 mt-10">
                                <p-button
                                    [loading]="loading.isLoading"
                                    type="submit"
                                    styleClass="w-full"
                                    label="Change password"
                                ></p-button>
                                <p-button
                                    *ngIf="!loading.isLoading; else cancel"
                                    (click)="showModal = false"
                                    type="button"
                                    styleClass="w-full p-button-outlined p-button-secondary"
                                    label="Cancel"
                                ></p-button>
                                <ng-template #cancel>
                                    <p-button
                                        (click)="
                                            changePasswordHttp.cancelRequest()
                                        "
                                        type="button"
                                        styleClass="w-full p-button-outlined p-button-danger"
                                        label="Cancel"
                                    ></p-button>
                                </ng-template>
                            </div>
                        </form>
                    </div>
                </div>
            </p-dialog>
        </ng-container>
        <ng-container *ngIf="refresh$ | async"></ng-container>
        <ng-container *ngIf="updateProfile$ | async"></ng-container>
        <ng-container *ngIf="loading$ | async"></ng-container>
        <ng-container *ngIf="tooltip$ | async"></ng-container>
        <ng-container *ngIf="logout$ | async"></ng-container>
        <ng-container *ngIf="sendVerificationToken$ | async"></ng-container>
        <ng-container *ngIf="verifyVerificationToken$ | async"></ng-container>
        <ng-container *ngIf="changePassword$ | async"></ng-container>
    `,
    styles: [
        `
            :host {
                @apply min-h-full flex;

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

                p-splitButton {
                    ::ng-deep li[aria-label='Verify Account'] a span {
                        color: var(--primary-color) !important;
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: 'profileFormHelper', useClass: FormHelperService },
        { provide: 'passwordFormHelper', useClass: FormHelperService },
        { provide: 'verifyAccount', useClass: FormHelperService },
    ],
})
export class HomeComponent implements AfterViewInit {
    @ViewChild('username')
    public usernameRef: ElementRef = new ElementRef(null);

    public user$: Observable<IUser> = new Observable<IUser>();
    public refresh$: Observable<void> = new Observable<void>();
    public updateProfile$: Observable<void> = new Observable<void>();
    public logout$: Observable<void> = new Observable<void>();
    public loading$: Observable<boolean> = new Observable<boolean>();
    public tooltip$$: Subject<boolean> = new Subject<boolean>();
    public tooltip$: Observable<boolean> = new Observable<boolean>();
    public sendVerificationToken$: Observable<void> = new Observable<void>();
    public verifyVerificationToken$: Observable<void> = new Observable<void>();
    public changePassword$: Observable<void> = new Observable<void>();

    public items: MenuItem[] = [];
    public showModal: boolean = false;
    public activeForm: number = 0;
    public showOldPassword: boolean = false;
    public showNewPassword: boolean = false;
    public showConfirmPassword: boolean = false;
    public addToolTip: boolean = false;

    public readonly tokenField: IFormItem =
        this.homeConstants.verificationForm['token'];

    public readonly usernameField: IFormItem =
        this.homeConstants.profileForm['username'];
    public readonly emailField: IFormItem =
        this.homeConstants.profileForm['email'];

    public readonly oldPasswordField: IFormItem =
        this.homeConstants.passwordForm['oldPassword'];
    public readonly newPasswordField: IFormItem =
        this.homeConstants.passwordForm['newPassword'];
    public readonly confirmPasswordField: IFormItem =
        this.homeConstants.passwordForm['confirmPassword'];

    constructor(
        public loginConstants: LoginConstantsService,
        public homeConstants: HomeConstantsService,
        @Inject('profileFormHelper')
        public profileFormHelper: FormHelperService,
        public updateProfileHttp: UpdateProfileHttpService,
        @Inject('passwordFormHelper')
        public passwordFormHelper: FormHelperService,
        public changePasswordHttp: ChangePasswordHttpService,
        @Inject('verifyAccount')
        public verifyAccountFormHelper: FormHelperService,
        public verifyVerificationTokenHttp: VerifyVerificationTokenHttpService,
        public sendVerificationTokenHttp: SendVerificationTokenHttpService,
        public loading: LoadingService,
        public location: Location,
        private _passwordHelper: PasswordHelperService,
        private _store: Store,
        private _refreshHttp: RefreshHttpService,
        private _logoutHttp: LogoutHttpService,
        private _messageService: MessageService,
        private _clipboard: Clipboard,
        private _router: Router
    ) {
        this.user$ = _store.select(selectUser).pipe(
            tap((user: IUser) => {
                this.items = [
                    {
                        label: 'Verify Account',
                        icon: 'pi pi-verified',
                        command: () => {
                            this.activeForm = 0;
                            this.showModal = true;
                        },
                        disabled: user.isVerified,
                    },
                    {
                        label: 'Update Profile',
                        icon: 'pi pi-user-edit',
                        command: () => {
                            this.activeForm = 1;
                            this.showModal = true;
                        },
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-lock',
                        command: () => {
                            this.activeForm = 2;
                            this.showModal = true;
                        },
                    },
                    { separator: true },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => _logoutHttp.logout(),
                    },
                ];

                this.initProfileForm(user);
            })
        );
        this.refresh$ = this._refreshHttp.refresh$();
        this.updateProfile$ = this.updateProfileHttp.watchUpdateProfile$();
        this.logout$ = this._logoutHttp.watchLogout$();
        this.loading$ = loading.watchLoading$();
        this.tooltip$ = this.tooltip$$.asObservable();
        this.sendVerificationToken$ =
            this.sendVerificationTokenHttp.watchSendVerificationToken$();
        this.verifyVerificationToken$ =
            this.verifyVerificationTokenHttp.watchVerifyVerificationToken$();
        this.changePassword$ = this.changePasswordHttp.watchChangePassword$();

        this.initVerificationForm();
        this.initPasswordForm();
    }

    ngAfterViewInit(): void {
        const element = this.usernameRef.nativeElement;
        interval(300)
            .pipe(take(2))
            .subscribe(() => {
                if (
                    element.scrollHeight > element.clientHeight ||
                    element.scrollWidth > element.clientWidth
                ) {
                    this.tooltip$$.next(true);
                    this.addToolTip = true;
                }
            });
    }

    public initVerificationForm(): void {
        this.verifyAccountFormHelper.setFormGroup(
            new FormGroup({
                [this.tokenField.name]: new FormControl('', [
                    Validators.required,
                ]),
            })
        );
    }

    public initProfileForm(user: IUser): void {
        this.profileFormHelper.setFormGroup(
            new FormGroup({
                [this.usernameField.name]: new FormControl(user.username, [
                    Validators.required,
                ]),
                [this.emailField.name]: new FormControl(user.email, [
                    Validators.required,
                    Validators.email,
                ]),
            })
        );
    }

    public initPasswordForm(): void {
        this.passwordFormHelper.setFormGroup(
            new FormGroup({
                [this.oldPasswordField.name]: new FormControl('', [
                    Validators.required,
                ]),
                [this.newPasswordField.name]: new FormControl('', [
                    Validators.required,
                ]),
                [this.confirmPasswordField.name]: new FormControl(''),
            })
        );

        this.passwordFormHelper
            .getFormControl(this.confirmPasswordField.name)
            ?.addValidators([
                Validators.required,
                this._passwordHelper.passwordsMustMatch(
                    this.passwordFormHelper.getFormControl(
                        this.newPasswordField.name
                    ),
                    this.passwordFormHelper.getFormControl(
                        this.confirmPasswordField.name
                    )
                ),
            ]);
    }

    public onClickPosts() {
        this._router.navigate([this.homeConstants.postsRoute]);
    }

    public onClickProfile() {
        this._router.navigate([this.homeConstants.profileRoute]);
    }

    public onVerifyAccountSubmit(): void {
        if (this.verifyAccountFormHelper.formGroup.invalid) {
            this.verifyAccountFormHelper.validateAllFormInputs();
            return;
        }

        this.verifyVerificationTokenHttp.verifyVerificationToken(
            this.verifyAccountFormHelper.formGroup.value
        );
    }

    public onProfileSubmit(user: IUser): void {
        if (this.profileFormHelper.formGroup.invalid) {
            this.profileFormHelper.validateAllFormInputs();
            return;
        }
        if (
            this.profileFormHelper.formGroup.value[this.usernameField.name] ===
                user.username &&
            this.profileFormHelper.formGroup.value[this.emailField.name] ===
                user.email
        ) {
            return;
        }

        this.updateProfileHttp.updateProfile(
            this.profileFormHelper.formGroup.value
        );
    }

    public onPasswordSubmit(): void {
        if (this.passwordFormHelper.formGroup.invalid) {
            this.passwordFormHelper.validateAllFormInputs();
        }
        const {
            [this.confirmPasswordField.name]: confirmPassword,
            ...newObject
        } = this.passwordFormHelper.formGroup.value;
        this.changePasswordHttp.changePassword(newObject);
    }

    public onModalHide(user: IUser) {
        switch (this.activeForm) {
            case 0:
                this.verifyVerificationTokenHttp.cancelRequest();
                this.initVerificationForm();
                break;
            case 1:
                this.updateProfileHttp.cancelRequest();
                this.initProfileForm(user);
                break;
            case 2:
                this.initPasswordForm();
                break;
            default:
                throw Error('Unknown form');
        }
    }

    public onClickUsername(user: IUser): void {
        this._clipboard.copy(user.username);
        this._messageService.add({
            severity: 'info',
            summary: 'Copied to Clipboard',
            detail: 'You have copied username to clipboard',
        });
    }

    public setHeader(): string {
        switch (this.activeForm) {
            case 0:
                return 'Verify Account';
            case 1:
                return 'Update Profile';
            case 2:
                return 'Change Password';
            default:
                throw Error('Unknown form');
        }
    }
}
