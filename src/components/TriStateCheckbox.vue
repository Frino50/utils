<template>
    <div class="main">
        <div v-if="props.left">
            {{ label }}
        </div>
        <div class="center-checkbox">
            <div :class="checkboxClass" class="checkbox"
                 @click="toggleState">
                <span v-if="model === true">✓</span>
                <span v-if="model === false">X</span>
                <span v-if="model === undefined"></span>
            </div>
        </div>
        <div v-if="!props.left">
            {{ label }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const model = defineModel();

const props = defineProps<{
    label?: string[];
    left?: boolean
}>();

const emit = defineEmits<(event: "change") => void>();

const label = computed(() => {
    if (props.label) {
        if (model.value === undefined) {
            return props.label[0];
        } else if (model.value === true) {
            return props.label[1];
        } else {
            return props.label[2];
        }
    }
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
    gap: 0.5rem
}

.center-checkbox {
    display: flex;
    align-items: center;
}

.checkbox {
    user-select: none;
    cursor: pointer;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--light-gray);
    border-radius: 0.5rem;
}

.checkbox-true {
    color: white;
    background-color: var(--blue);
    border: 1px solid var(--blue);
}

.checkbox-false {
    background-color: var(--red);
    color: white;
    border: 1px solid var(--red);
}


</style>
