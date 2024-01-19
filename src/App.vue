<script setup lang="ts">
import GameCanvasView from "@/components/GameCanvasView.vue";
</script>

<template>
    <header>
        <h1>
            <a
                href="https://baike.baidu.com/item/%E5%BA%B7%E5%A8%81%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F/22668799"
                target="_blank"
            >
                康威生命游戏
            </a>
        </h1>
    </header>
    <div class="container">
        <GameCanvasView />
    </div>
</template>

<style scoped>
.container {
    margin: 0.75rem;
}

header {
    text-align: center;
    white-space: nowrap;
    margin: 0.75rem 0;
}

header h1 {
    font-size: 1.25em;
    margin: 0;
}

header h1 a {
    color: #2a2a2a;
    text-decoration: none;
    transition: color 0.2s linear;
}

header h1 a:hover {
    color: #565656;
    text-decoration: underline;
    text-underline-offset: 0.15em;
}

header h1 a:active {
    color: #858585;
}
</style>
