<template>
    <div class="main">
        <div class="center-checkbox">
            <div
                class="checkbox"
                :style="checkboxStyle"
                @click="!disabled && toggleState()"
                role="checkbox"
                :aria-checked="ariaChecked"
                :tabindex="disabled ? -1 : 0"
                @keydown.space.prevent="!disabled && toggleState()"
            >
                <span v-if="model === true">✓</span>
                <span v-else-if="model === false">X</span>
                <span v-else></span>
            </div>
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
    let bgColor = "";
    let borderColor = "";
    let color = "white";

    if (model.value === true) {
        bgColor = props.trueColor ?? "#007ad9";
        borderColor = bgColor;
    } else if (model.value === false) {
        bgColor = props.falseColor ?? "red";
        borderColor = bgColor;
    } else {
        bgColor = props.undefinedColor ?? "transparent";
        borderColor = "lightgray";
        color = "inherit";
    }

    return {
        backgroundColor: bgColor,
        border: `0.1rem solid ${borderColor}`,
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
}

.label-container {
    min-width: 6.25rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.center-checkbox {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
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
}
</style>
