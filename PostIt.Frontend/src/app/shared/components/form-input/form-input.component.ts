import {
    ChangeDetectionStrategy,
    Component,
    Input,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'form-input',
    template: `
        <label [htmlFor]="id">{{ label }}</label>
        <input
            [id]="id"
            pInputText
            [value]="value"
            [type]="type"
            [attr.aria-describedby]="id + '-help'"
            [autocomplete]="hasAutocomplete"
            #inputElement
            (input)="onChange(inputElement.value)"
            (blur)="onTouched()"
        />
        <small *ngIf="hint !== null" id="{{ id }}-help">{{ hint }}</small>
    `,
    styles: [
        `
            :host {
                @apply flex flex-col gap-2;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputComponent),
            multi: true,
        },
    ],
})
export class FormInputComponent implements ControlValueAccessor {
    @Input()
    public id: string = '';

    @Input()
    public label: string = '';

    @Input()
    public hint: string | null = null;

    @Input()
    public hasAutocomplete: boolean = true;

    @Input()
    public type: string = 'text';

    public value: string = '';
    public onChange: any = () => {};
    public onTouched: any = () => {};

    public writeValue(obj: any): void {
        this.value = obj;
    }
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
