<template>
    <div style="display: flex; gap: 2rem">
        <FloatLabelInput
            v-model="username"
            :regex="/^[a-zA-Z0-9]+$/"
            label="Username"
            message-regex="Seuls les lettres et chiffres sont autorisés"
        />

        <FloatLabelInput
            v-model="mail"
            label="Email"
            v-validate="{
                alphanumeric: true,
                required: true,
                messageRequired: 'SALazzzzzzzzzzzzzzzzzzzzzzzUT',
            }"
        />

        <FloatLabelInput v-model="age" label="Âge" number />

        <select
            v-model="selectedOption"
            v-validate="{
                required: true,
                messageRequired: 'Veuillez choisir une option',
            }"
        >
            <option disabled value="">Choisis une option</option>
            <option v-for="(item, index) in options" :key="index" :value="item">
                {{ item }}
            </option>
        </select>

        <input
            v-validate="{
                required: true,
                messageRequired: 'Le champ email est obligatoire',
                regex: /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/,
                messageRegex:
                    'Veuillez entrer une adresse e-mail valide, ex : jean@gmail.com',
            }"
            placeholder="Votre e-mail"
        />

        <TriStateCheckbox
            v-model="gender"
            false-label="false"
            true-label="true"
            undefined-label="undefined"
        />
    </div>

    <Dialog v-model="pop" title="test">rterteetr</Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FloatLabelInput from "./components/FloatLabelInput.vue";
import TriStateCheckbox from "./components/TriStateCheckbox.vue";
import Dialog from "@/components/Dialog.vue";

const username = ref<string>();
const mail = ref<string>();
const age = ref<number>();
const gender = ref<boolean>();
const pop = ref<boolean>(true);

// Liste des 5 éléments pour le select
const options = ref<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
]);

const selectedOption = ref<string>("");
</script>
