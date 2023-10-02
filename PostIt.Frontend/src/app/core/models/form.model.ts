export interface IFormItem {
    id: string;
    name: string;
    label: string;
    hint: string | null;
}

export interface IForm {
    [key: string]: IFormItem;
}
