import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-create-post',
    template: `
        <section
            class="flex justify-between items-center gap-4 p-10 bg-[var(--surface-card)]"
        >
            <i
                class="pi pi-at text-[var(--primary-color)]"
                style="font-size: 2rem"
            ></i>
            <input
                [readOnly]="true"
                placeholder="Got something on your mind? Post It!"
                pInputText
                type="text"
                class="w-full cursor-pointer"
                style="border: none"
            />
        </section>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {}
