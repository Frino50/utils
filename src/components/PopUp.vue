<template>
    <div v-if="open" ref="dialogRef" class="dialog">
        <div
            class="dialog-header"
            @mousedown="startDragging"
            @mouseup="stopDragging"
        >
            <span class="dialog-title">Gestion</span>
            <button class="close-btn" @click="open = false">&times;</button>
        </div>

        <div class="dialog-content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const open = defineModel();
const dialogRef = ref<HTMLElement | null>(null);
const mouseStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const dialogStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
let isDragging = false;

function startDragging(event: MouseEvent) {
    if (event.button !== 0) return;
    if (!dialogRef.value) return;

    isDragging = true;

    mouseStartPosition.value = { x: event.clientX, y: event.clientY };
    const rect = dialogRef.value.getBoundingClientRect();
    dialogStartPosition.value = { x: rect.left, y: rect.top };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDragging);
}

function handleDrag(event: MouseEvent) {
    if (!isDragging || !dialogRef.value) return;

    const deltaX = event.clientX - mouseStartPosition.value.x;
    const deltaY = event.clientY - mouseStartPosition.value.y;

    let newLeft = dialogStartPosition.value.x + deltaX;
    let newTop = dialogStartPosition.value.y + deltaY;

    const dialogWidth = dialogRef.value.offsetWidth;
    const dialogHeight = dialogRef.value.offsetHeight;

    const maxLeft = window.innerWidth - dialogWidth;
    const maxTop = window.innerHeight - dialogHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    dialogRef.value.style.left = `${newLeft}px`;
    dialogRef.value.style.top = `${newTop}px`;
}

function stopDragging() {
    isDragging = false;

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDragging);
}
</script>
<style scoped>
.dialog {
    position: absolute;
    top: 20px;
    left: 1200px;
    padding: 0;
    background-color: #ffffff;
    border: 0.1rem solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 300px;
    z-index: 1000;
    overflow: hidden;
    cursor: default;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ccc;
    cursor: move;
}

.dialog-title {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
}

.close-btn {
    background-color: transparent;
    border: none;
    font-size: 1.2rem;
    font-weight: bold;
    color: #e74c3c;
    cursor: pointer;
    line-height: 1;
}

.close-btn:hover {
    color: #c0392b;
}

.dialog-content {
    padding: 1rem;
    font-size: 0.9rem;
    color: #555;
}
</style>
