<template>
    <div class="main">
        <div class="center-checkbox">
            <div
                :class="checkboxClass"
                class="checkbox"
                @click="toggleState()"
                role="checkbox"
                :aria-checked="
                    model === true
                        ? 'true'
                        : model === false
                          ? 'false'
                          : 'mixed'
                "
                tabindex="0"
                @keydown.space.prevent="toggleState()"
            >
                <span v-if="model === true">✓</span>
                <span v-if="model === false">X</span>
                <span v-if="model === undefined"></span>
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
}>();

const emit = defineEmits<(event: "change") => void>();

const label = computed(() => {
    if (props.undefinedLabel && model.value === undefined) {
        return props.undefinedLabel;
    } else if (props.trueLabel && model.value === true) {
        return props.trueLabel;
    } else if (props.falseLabel && model.value === false) {
        return props.falseLabel;
    }
    return "";
});

function toggleState() {
    if (model.value === undefined) {
        model.value = true;
    } else if (model.value) {
        model.value = false;
    } else {
        model.value = undefined;
    }

    emit("change");
}

const checkboxClass = computed(() => {
    if (model.value === true) {
        return "checkbox-true";
    } else if (model.value === false) {
        return "checkbox-false";
    } else {
        return "";
    }
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
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--light-gray);
    border-radius: 0.5rem;
}

.checkbox-true {
    color: white;
    background-color: var(--blue);
    border: 0.1rem solid var(--blue);
}

.checkbox-false {
    background-color: var(--red);
    color: white;
    border: 0.1rem solid var(--red);
}
</style>
