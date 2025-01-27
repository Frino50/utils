<template>
    <div style="display: flex; gap: 2rem">
        <FloatLabelInput v-model="username" :regex="/^[a-zA-Z0-9]+$/" label="Username"
                         message-regex="Seuls les lettres et chiffres sont autorisés."
        />
        <FloatLabelInput v-model="mail" :max-length="5" label="Email"
                         message-required="Besoin de texte" required />
        <FloatLabelInput v-model="age" label="Âge" number />
        <TriStateCheckbox v-model="gender" :label="listGender" style="width: 3rem" />
        <Ball :ball-count="10" />

    </div>

</template>

<script lang="ts" setup>
import { ref } from "vue";
import FloatLabelInput from "./components/FloatLabelInput.vue";
import TriStateCheckbox from "./components/TriStateCheckbox.vue";
import Ball from "./components/Ball.vue";

const username = ref<string>();
const mail = ref<string>();
const age = ref<number>();
const gender = ref<boolean>();
const listGender = ref<string[]>(["Other", "Male", "Female"]);
</script>
