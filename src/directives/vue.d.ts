import { ValidationOptions } from "./validate";

declare module "@vue/runtime-core" {
    export interface GlobalDirectives {
        validate: Directive<HTMLInputElement, ValidationOptions>;
    }
}
