<template>
    <div class="main" @click="!disabled && toggleState()">
        <div
            class="checkbox"
            :style="checkboxStyle"
            role="checkbox"
            :aria-checked="ariaChecked"
            :tabindex="disabled ? -1 : 0"
            @keydown.space.prevent="!disabled && toggleState()"
            :aria-disabled="disabled"
        >
            <span v-if="model === true">✓</span>
            <span v-else-if="model === false">X</span>
            <span v-else></span>
        </div>

        <div class="label-container">
            {{ label }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const model = defineModel<boolean | undefined>();
const props = defineProps<{
    undefinedLabel?: string;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    undefinedColor?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<(event: "change") => void>();

const label = computed(() => {
    if (props.undefinedLabel && model.value === undefined)
        return props.undefinedLabel;
    if (props.trueLabel && model.value === true) return props.trueLabel;
    if (props.falseLabel && model.value === false) return props.falseLabel;
    return "";
});

function toggleState() {
    if (model.value === undefined) model.value = true;
    else if (model.value) model.value = false;
    else model.value = undefined;

    emit("change");
}

const ariaChecked = computed(() =>
    model.value === true ? "true" : model.value === false ? "false" : "mixed"
);

const checkboxStyle = computed(() => {
    let bgColor: string;
    let color = "white";

    if (model.value === true) {
        bgColor = props.trueColor ?? "#007ad9";
    } else if (model.value === false) {
        bgColor = props.falseColor ?? "red";
    } else {
        bgColor = props.undefinedColor ?? "transparent";
    }

    return {
        backgroundColor: bgColor,
        color,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
    };
});
</script>

<style scoped>
.main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: default;
}

.label-container {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.checkbox {
    user-select: none;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
    border: 0.1rem solid #e5e7eb;
}
.main:hover .checkbox {
    border-color: #9ca3af;
}
</style>
