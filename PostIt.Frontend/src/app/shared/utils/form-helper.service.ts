import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormHelperService {
    private _formGroup: FormGroup = new FormGroup({}, { updateOn: 'blur' });

    get formGroup(): FormGroup {
        return this._formGroup;
    }

    public setFormGroup(formControls: {
        [key: string]: FormControl;
    }): FormGroup {
        this._formGroup = new FormGroup(formControls);
        return this._formGroup;
    }

    public getFormControl(formControlName: string): FormControl<any> | null {
        return this._formGroup.get(formControlName) as FormControl;
    }

    public isInputInvalid(formControlName: string): boolean {
        const formControl: AbstractControl<any, any> | null =
            this._formGroup.get(formControlName);
        if (formControl === null) {
            return true;
        }
        if (formControl.pristine) {
            return false;
        }
        return formControl.invalid;
    }

    public validateAllFormInputs() {
        Object.keys(this._formGroup.controls).forEach(
            (field) => {
                const control = this._formGroup.get(field);
                if (control instanceof FormControl) {
                    control.markAsDirty({ onlySelf: true });
                }
            }
        );
    }
}
