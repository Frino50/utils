<template>
    <div ref="gameContainer">
        <div
            v-for="ball in balls"
            :key="ball.id"
            :style="{
                left: `${ball.x}px`,
                top: `${ball.y}px`,
                backgroundColor: ball.color,
            }"
            class="ball"
        ></div>
    </div>

    <div class="gear-icon" @click="openPopUp = !openPopUp">⚙️</div>

    <Dialog v-model="openPopUp">
        <div class="button-container-ball">
            <button @click="addBall">Ajouter une balle</button>
            <button @click="removeBall">Supprimer une balle</button>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Dialog from "./Dialog.vue";

interface Ball {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
}

const props = defineProps({
    ballCount: { type: Number, default: 1 },
});

const BALL_SIZE = 20;
const MAX_SPEED = 5;
const COLOR_UPDATE_INTERVAL = 1000;

const openPopUp = ref<boolean>();
const balls = ref<Ball[]>([]);
const gameContainer = ref<HTMLElement | null>(null);
let ballIdCounter = 0;
let animationFrameId: number;
let colorUpdateInterval: ReturnType<typeof setInterval>;
let domObserver: MutationObserver | null = null;
let cachedElements: HTMLElement[] = [];

function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function randomColor() {
    return (
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
    );
}

function createBall(x: number, y: number): Ball {
    return {
        id: ++ballIdCounter,
        x,
        y,
        vx: randomInRange(-MAX_SPEED, MAX_SPEED),
        vy: randomInRange(-MAX_SPEED, MAX_SPEED),
        color: randomColor(),
    };
}

function updateCachedElements() {
    cachedElements = Array.from(
        document.querySelectorAll<HTMLElement>(
            "input,button,[class*='multiselect'],[class*='input'],[class*='checkbox']"
        )
    );
}

function initDOMObserver() {
    domObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                shouldUpdate = true;
                break;
            }
        }

        if (shouldUpdate) {
            updateCachedElements();
        }
    });

    domObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function detectBallCollision(ball1: Ball, ball2: Ball): boolean {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < BALL_SIZE;
}

function handleBallCollision(ball1: Ball, ball2: Ball) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const p =
        (2 *
            (ball1.vx * nx + ball1.vy * ny - (ball2.vx * nx + ball2.vy * ny))) /
        2;

    ball1.vx -= p * nx;
    ball1.vy -= p * ny;
    ball2.vx += p * nx;
    ball2.vy += p * ny;

    const overlap = BALL_SIZE - distance;
    if (overlap > 0) {
        const adjustX = (overlap * nx) / 2;
        const adjustY = (overlap * ny) / 2;
        ball1.x += adjustX;
        ball1.y += adjustY;
        ball2.x -= adjustX;
        ball2.y -= adjustY;
    }
}

function checkElementCollision(
    ball: Ball
): { element: HTMLElement; collision: boolean; rect: DOMRect } | null {
    for (const element of cachedElements) {
        const rect = element.getBoundingClientRect();
        const ballRight = ball.x + BALL_SIZE;
        const ballBottom = ball.y + BALL_SIZE;

        if (
            ball.x < rect.right &&
            ballRight > rect.left &&
            ball.y < rect.bottom &&
            ballBottom > rect.top
        ) {
            return { element, collision: true, rect };
        }
    }
    return null;
}

function handleElementCollision(
    ball: Ball,
    element: HTMLElement,
    rect: DOMRect
) {
    const ballCenterX = ball.x + BALL_SIZE / 2;
    const ballCenterY = ball.y + BALL_SIZE / 2;

    const dx = ballCenterX - (rect.left + rect.width / 2);
    const dy = ballCenterY - (rect.top + rect.height / 2);

    if (Math.abs(dx) / rect.width > Math.abs(dy) / rect.height) {
        ball.vx *= -1;
        ball.x = dx > 0 ? rect.right : rect.left - BALL_SIZE;
        element.classList.add("touched-side");
    } else {
        ball.vy *= -1;
        ball.y = dy > 0 ? rect.bottom : rect.top - BALL_SIZE;
        element.classList.add("touched-top");
    }

    element.classList.add("touched");
    element.style.boxShadow = `0 0 15px 5px ${ball.color}`;

    setTimeout(() => {
        element.classList.remove("touched", "touched-top", "touched-side");
        element.style.boxShadow = "";
    }, 500);
}

function updateBalls() {
    const { innerWidth, innerHeight } = window;

    for (const ball of balls.value) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x <= 0 || ball.x >= innerWidth - BALL_SIZE) {
            ball.vx *= -1;
            ball.x = Math.max(0, Math.min(ball.x, innerWidth - BALL_SIZE));
        }
        if (ball.y <= 0 || ball.y >= innerHeight - BALL_SIZE) {
            ball.vy *= -1;
            ball.y = Math.max(0, Math.min(ball.y, innerHeight - BALL_SIZE));
        }

        const collision = checkElementCollision(ball);
        if (collision) {
            handleElementCollision(ball, collision.element, collision.rect);
        }
    }

    for (let i = 0; i < balls.value.length; i++) {
        for (let j = i + 1; j < balls.value.length; j++) {
            if (detectBallCollision(balls.value[i], balls.value[j])) {
                handleBallCollision(balls.value[i], balls.value[j]);
            }
        }
    }

    animationFrameId = requestAnimationFrame(updateBalls);
}

onMounted(() => {
    updateCachedElements();
    initDOMObserver();

    const createInitialBall = () => {
        const x = randomInRange(0, window.innerWidth - BALL_SIZE);
        const y = randomInRange(0, window.innerHeight - BALL_SIZE);
        return createBall(x, y);
    };

    balls.value = Array.from({ length: props.ballCount }, createInitialBall);

    animationFrameId = requestAnimationFrame(updateBalls);
    colorUpdateInterval = setInterval(() => {
        balls.value.forEach((ball) => (ball.color = randomColor()));
    }, COLOR_UPDATE_INTERVAL);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    clearInterval(colorUpdateInterval);
    if (domObserver) {
        domObserver.disconnect();
    }
});

function addBall() {
    const x = randomInRange(0, window.innerWidth - BALL_SIZE);
    const y = randomInRange(0, window.innerHeight - BALL_SIZE);
    balls.value.push(createBall(x, y));
}

function removeBall() {
    if (balls.value.length > 0) {
        balls.value.pop();
    }
}
</script>

<style>
.ball {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: background-color 1s ease;
}

.button-container-ball {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.gear-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f4f4f4;
    border: 2px solid #ccc;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #333;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.gear-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.button-container-ball button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.button-container-ball button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.touched {
    transition: all 0.5s ease;
}

.touched-side {
    animation: shake-side 0.5s ease-in-out;
}

.touched-top {
    animation: shake-top 0.5s ease-in-out;
}

@keyframes shake-side {
    0%,
    100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    50% {
        transform: translateX(5px);
    }
    75% {
        transform: translateX(-5px);
    }
}

@keyframes shake-top {
    0%,
    100% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(5px);
    }
    75% {
        transform: translateY(-5px);
    }
}
</style>
