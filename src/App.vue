<template>
    <div style="display: flex; gap: 2rem">
        <FloatLabelInput
            v-model="username"
            :regex="/^[a-zA-Z0-9]+$/"
            label="Username"
            message-regex="Seuls les lettres et chiffres sont autorisés."
        />
        <FloatLabelInput
            v-model="mail"
            :max-length="5"
            label="Email"
            message-required="Besoin de texte"
            required
        />
        <FloatLabelInput v-model="age" label="Âge" number />
        <TriStateCheckbox
            v-model="gender"
            false-label="false"
            true-label="true"
            undefined-label="undefined"
        />
        <Ball :ball-count="10" />
    </div>
    <Dialog v-model="pop" title="test">rterteetr</Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FloatLabelInput from "./components/FloatLabelInput.vue";
import TriStateCheckbox from "./components/TriStateCheckbox.vue";
import Ball from "./components/Ball.vue";
import Dialog from "@/components/Dialog.vue";

const username = ref<string>();
const mail = ref<string>();
const age = ref<number>();
const gender = ref<boolean>();
const pop = ref<boolean>(true);
</script>
