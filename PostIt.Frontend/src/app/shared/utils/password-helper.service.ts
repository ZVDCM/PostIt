import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class PasswordHelperService {
    public passwordsMustMatch(
        formControl1: FormControl<any> | null,
        formControl2: FormControl<any> | null
    ): () => ValidationErrors | null {
        return (): ValidationErrors | null => {
            if (
                formControl1 !== null &&
                formControl2 !== null &&
                formControl1.value !== formControl2.value
            ) {
                return { matchError: true };
            }

            return null;
        };
    }
}
