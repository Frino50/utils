<template>
    <div style="position: relative">
        <div :class="['float-label', { error: errorMessage }]">
            <input
                :id="label.toLowerCase()"
                v-model="localValue"
                :maxlength="maxLength"
                class="input-field"
                @blur="handleBlur"
                @focus="isFocused = true"
                @input="updateValue"
            />

            <label
                :class="[
                    'label',
                    {
                        'float-active': isFocused || localValue,
                        error: errorMessage,
                    },
                ]"
                :for="label.toLowerCase()"
            >
                {{ label }}
            </label>
        </div>
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
    modelValue: string | number | undefined;
    label: string;
    maxLength?: number;
    number?: boolean;
    regex?: RegExp;
    messageRegex?: string;
    required?: boolean;
    messageRequired?: string;
}>();

const emits = defineEmits(["update:modelValue", "change"]);
const localValue = ref<string | number | undefined>(props.modelValue);
const isFocused = ref(false);
const errorMessage = ref<string | null>(null);

function updateValue(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (props.number) {
        value = value.replace(/\D/g, "");
    }

    localValue.value = value;
    emits("update:modelValue", value);
    emits("change");

    if (props.required && !value) {
        errorMessage.value = props.messageRequired || "Invalid input";
    } else if (value && props.regex && !props.regex.test(value)) {
        errorMessage.value = props.messageRegex || "Invalid regex input";
    } else {
        errorMessage.value = null;
    }
}

function handleBlur() {
    isFocused.value = false;

    if (props.required && !localValue.value) {
        errorMessage.value = props.messageRequired || "Invalid input";
    } else if (
        localValue.value &&
        props.regex &&
        !props.regex.test(String(localValue.value))
    ) {
        errorMessage.value = props.messageRegex || "Invalid regex input";
    } else {
        errorMessage.value = null;
    }
}
</script>

<style scoped>
input:focus {
    outline: var(--blue) 0.18rem solid;
}

.float-label {
    position: relative;
}

.float-label.error input:focus {
    outline: var(--red) 0.18rem solid;
}

.label {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    transition: all 0.2s linear;
    pointer-events: none;
    color: var(--place-holder-gray);
    font-size: 1rem;
}

.label.error {
    color: var(--red);
}

.float-active {
    top: -1.1rem;
    font-size: 0.75rem;
    color: var(--blue);
}

.label.float-active.error {
    color: var(--red);
}

.input-field {
    padding: 0.75rem 0.75rem;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid var(--light-gray);
    font-size: 1.2rem;
    box-sizing: border-box;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.input-field:focus {
    border-color: var(--blue);
}

.float-label.error .input-field:focus {
    border-color: var(--red);
}

.input-field:focus + .label {
    top: -1.1rem;
    font-size: 0.75rem;
    color: var(--blue);
}

.input-field:focus + .label.error {
    color: var(--red);
}

.input-field {
    border-color: var(--light-gray);
}

.float-label.error .input-field {
    border-color: var(--red);
}

.input-field::placeholder {
    color: transparent;
}

.error-message {
    position: absolute;
    color: var(--red);
    font-size: 0.85rem;
    margin-top: 0.25rem;
}
</style>
