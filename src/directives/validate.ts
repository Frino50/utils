import { DirectiveBinding } from "vue";

export interface ValidationOptions {
    required?: boolean;
    messageRequired?: string;
    regex?: RegExp;
    messageRegex?: string;
    number?: boolean;
    alphanumeric?: boolean;
}

function findInputElement(
    el: HTMLElement
): HTMLInputElement | HTMLSelectElement | null {
    if (el.tagName === "INPUT" || el.tagName === "SELECT") {
        return el as HTMLInputElement | HTMLSelectElement;
    }

    const input = el.querySelector("input, select");
    return input as HTMLInputElement | HTMLSelectElement | null;
}

export const validateDirective = {
    mounted(el: HTMLElement, binding: DirectiveBinding<ValidationOptions>) {
        const options = binding.value || {};
        const inputEl = findInputElement(el);
        if (!inputEl) return;

        const parent = inputEl.parentElement;
        if (!parent) return;

        parent.style.position = "relative";

        if (!document.getElementById("validate-directive-styles")) {
            const style = document.createElement("style");
            style.id = "validate-directive-styles";
            style.textContent = `
                .input-error {
                    border-color: var(--red) !important;
                }
                .error-message {
                    position: absolute;
                    color: var(--red);
                    font-size: 0.85rem;
                    line-height: 1.2;
                    z-index: 10;
                    text-align: start;
                    white-space: normal;
                    word-wrap: break-word;
                    max-width: 100%;
                }
            `;
            document.head.appendChild(style);
        }

        const errorEl = document.createElement("div");
        errorEl.classList.add("error-message");

        const updatePosition = () => {
            errorEl.style.top = `${inputEl.offsetTop + inputEl.offsetHeight + 4}px`;
            errorEl.style.left = `${inputEl.offsetLeft}px`;
            errorEl.style.width = `${inputEl.offsetWidth}px`;
        };
        updatePosition();

        inputEl.insertAdjacentElement("afterend", errorEl);
        window.addEventListener("resize", updatePosition);

        const setInputError = (hasError: boolean) => {
            inputEl.classList.toggle("input-error", hasError);
        };

        const showError = (message: string | null) => {
            if (message) {
                errorEl.textContent = message;
                setInputError(true);
            } else {
                errorEl.textContent = "";
                setInputError(false);
            }
        };

        const validateRequired = () => {
            const isEmpty =
                inputEl instanceof HTMLSelectElement
                    ? !inputEl.value || inputEl.value === ""
                    : !inputEl.value;

            if (options.required && isEmpty) {
                showError(options.messageRequired || "Ce champ est requis");
                return false;
            }
            return true;
        };

        const validateRegex = () => {
            if (options.regex && inputEl instanceof HTMLInputElement) {
                if (inputEl.value && !options.regex.test(inputEl.value)) {
                    showError(
                        options.messageRegex ||
                            "Le format du champ est invalide"
                    );
                    return false;
                }
            }
            return true;
        };

        const handleInput = (e: Event) => {
            const input = e.target as HTMLInputElement | HTMLSelectElement;

            if (input instanceof HTMLInputElement) {
                let value = input.value;

                if (options.number) {
                    value = value.replace(/\D/g, "");
                } else if (options.alphanumeric) {
                    value = value.replace(/[^a-zA-Z0-9]/g, "");
                }

                if (value !== input.value) {
                    input.value = value;
                }
            }

            if (validateRequired() && validateRegex()) {
                showError(null);
            }
        };

        if (inputEl instanceof HTMLInputElement) {
            inputEl.addEventListener("input", handleInput);
            inputEl.addEventListener("blur", () => {
                validateRequired() && validateRegex() && showError(null);
            });
        }

        if (inputEl instanceof HTMLSelectElement) {
            inputEl.addEventListener("change", () => {
                validateRequired() && showError(null);
            });
            inputEl.addEventListener("blur", () => {
                validateRequired() && showError(null);
            });
        }
    },
};
