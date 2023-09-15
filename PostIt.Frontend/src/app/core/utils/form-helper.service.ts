import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class FormHelperService {
    private _formGroup: FormGroup = new FormGroup({});

    public setFormGroup(formControls: {
        [key: string]: FormControl;
    }): FormGroup {
        this._formGroup = new FormGroup(formControls);
        return this._formGroup;
    }

    public isInputInvalid(formControlName: string): boolean {
        return (
            (this._formGroup.get(formControlName)?.invalid &&
                this._formGroup.get(formControlName)?.dirty) ??
            false
        );
    }

    public acceptAllFormInputs() {
        Object.keys(this._formGroup.controls).forEach((field) => {
            const control = this._formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({ onlySelf: true });
            }
        });
    }
}
