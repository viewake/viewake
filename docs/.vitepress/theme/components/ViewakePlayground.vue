<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";
import {
  createViewake,
  type ViewakeAnimation,
  type ViewakeController,
  type ViewakeEventDetail,
  type ViewakeMode,
} from "viewake";

const mode = ref<ViewakeMode>("replay");
const delay = ref(200);
const duration = ref(600);
const easing = ref("cubic-bezier(0.22, 1, 0.36, 1)");
const animation = ref<ViewakeAnimation>("fade-up");
const threshold = ref(0.25);
const animationGroups = [
  {
    label: "Fade",
    options: [
      "fade",
      "fade-up",
      "fade-down",
      "fade-left",
      "fade-right",
      "fade-up-right",
      "fade-up-left",
      "fade-down-right",
      "fade-down-left",
    ],
  },
  {
    label: "Slide",
    options: [
      "slide-up",
      "slide-down",
      "slide-left",
      "slide-right",
    ],
  },
  {
    label: "Zoom in",
    options: [
      "zoom-in",
      "zoom-in-up",
      "zoom-in-down",
      "zoom-in-left",
      "zoom-in-right",
    ],
  },
  {
    label: "Zoom out",
    options: [
      "zoom-out",
      "zoom-out-up",
      "zoom-out-down",
      "zoom-out-left",
      "zoom-out-right",
    ],
  },
  {
    label: "Flip",
    options: [
      "flip-up",
      "flip-down",
      "flip-left",
      "flip-right",
    ],
  },
] satisfies Array<{
  label: string;
  options: ViewakeAnimation[];
}>;
const { lang } = useData();
const isKorean = computed(() => lang.value === "ko");
const scroller = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const eventLogPanel = ref<HTMLElement | null>(null);
const eventLog = ref<string[]>([]);
let controller: ViewakeController | null = null;

async function addEvent(detail: ViewakeEventDetail, message: string) {
  const time = new Date(detail.timestamp).toLocaleTimeString(
    isKorean.value ? "ko-KR" : "en-US",
    {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    },
  );

  eventLog.value = [
    ...eventLog.value,
    `#${String(detail.sequence).padStart(2, "0")} · ${time} · ${message}`,
  ].slice(-30);
  await nextTick();

  if (eventLogPanel.value) {
    eventLogPanel.value.scrollTop = eventLogPanel.value.scrollHeight;
  }
}

async function initialize() {
  controller?.destroy();
  scroller.value?.scrollTo({ top: 0 });
  eventLog.value = [];
  await nextTick();

  if (!scroller.value || !target.value) {
    return;
  }

  controller = createViewake({
    root: scroller.value,
    mode: mode.value,
    threshold: threshold.value,
    observeMutations: false,
    onAwake: (detail) =>
      addEvent(detail, isKorean.value ? "깨어남 (awake)" : "awake"),
    onSleep: (detail) =>
      addEvent(
        detail,
        isKorean.value
          ? "잠듦 — 다시 재생할 준비 완료"
          : "sleep — ready to replay",
      ),
  });
  controller.observe(target.value);
}

function meetElement() {
  scroller.value?.scrollTo({
    top: 520,
    behavior: "smooth",
  });
}

function returnAbove() {
  scroller.value?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(initialize);
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <section class="viewake-playground">
    <div class="playground-header">
      <div>
        <span class="eyebrow">LIVE PLAYGROUND</span>
        <h2>
          {{
            isKorean
              ? "마술이 아니라 상태 흐름을 직접 확인하세요."
              : "See the state model, not a magic trick."
          }}
        </h2>
      </div>
      <div class="playground-options">
        <label>
          {{ isKorean ? "애니메이션" : "Animation" }}
          <select v-model="animation" @change="initialize">
            <optgroup
              v-for="group in animationGroups"
              :key="group.label"
              :label="group.label"
            >
              <option
                v-for="option in group.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </optgroup>
          </select>
        </label>
        <label>
          {{ isKorean ? "모드" : "Mode" }}
          <select v-model="mode" @change="initialize">
            <option value="once">once</option>
            <option value="replay">replay</option>
          </select>
        </label>
        <label>
          {{ isKorean ? "지연 시간" : "Delay" }}
          <select v-model="delay" @change="initialize">
            <option :value="0">0ms</option>
            <option :value="200">200ms</option>
            <option :value="500">500ms</option>
          </select>
        </label>
        <label>
          {{ isKorean ? "재생 시간" : "Duration" }}
          <select v-model="duration" @change="initialize">
            <option :value="300">300ms</option>
            <option :value="600">600ms</option>
            <option :value="1000">1000ms</option>
            <option :value="1600">1600ms</option>
          </select>
        </label>
        <label>
          {{ isKorean ? "가속 곡선" : "Easing" }}
          <select v-model="easing" @change="initialize">
            <option value="linear">linear</option>
            <option value="ease">ease</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="cubic-bezier(0.22, 1, 0.36, 1)">smooth-out</option>
          </select>
        </label>
        <label>
          {{ isKorean ? "실행 지점" : "Trigger" }}
          <select v-model="threshold" @change="initialize">
            <option :value="0.1">10%</option>
            <option :value="0.25">25%</option>
            <option :value="0.5">50%</option>
          </select>
        </label>
      </div>
    </div>

    <div class="playground-layout">
      <div ref="scroller" class="demo-scroller">
        <div class="demo-intro">
          <strong>{{ isKorean ? "뷰포트" : "Viewport" }}</strong>
          <span>
            {{
              isKorean
                ? "직접 스크롤하거나 버튼을 사용하세요."
                : "Scroll down or use the controls."
            }}
          </span>
        </div>
        <div class="demo-spacer">
          <span>{{ isKorean ? "아래에서 sleeping 중 ↓" : "sleeping below ↓" }}</span>
        </div>
        <article
          ref="target"
          class="demo-card"
          :data-viewake="animation"
          :data-viewake-mode="mode"
          :data-viewake-delay="delay"
          :data-viewake-duration="duration"
          :data-viewake-easing="easing"
        >
          <span class="demo-badge">
            {{ animation }} · {{ mode }} · {{ delay }}ms + {{ duration }}ms
          </span>
          <h3>{{ isKorean ? "이제 awake 상태입니다." : "Now I’m awake." }}</h3>
          <p>
            {{
              isKorean
                ? "요소를 지나친 뒤 위로 돌아갔다 다시 내려오며 모드를 비교하세요."
                : "Pass me, return above me, and scroll down again to compare modes."
            }}
          </p>
        </article>
        <div class="demo-after">
          {{
            isKorean
              ? "계속 내려가도 화면 위의 카드는 awake 상태를 유지합니다."
              : "Continue scrolling. The card stays awake above the viewport."
          }}
        </div>
      </div>

      <div class="playground-panel">
        <div class="generated-code">
          <strong>{{ isKorean ? "현재 설정 코드" : "Current markup" }}</strong>
          <code
            >&lt;div data-viewake="{{ animation }}"
            data-viewake-mode="{{ mode }}"
            data-viewake-delay="{{ delay }}"
            data-viewake-duration="{{ duration }}"
            data-viewake-easing="{{ easing }}"&gt;</code
          >
          <small>
            {{
              isKorean
                ? `threshold: ${threshold}는 Viewake.init({ threshold: ${threshold} })에 넣습니다.`
                : `Put threshold: ${threshold} in Viewake.init({ threshold: ${threshold} }).`
            }}
          </small>
        </div>
        <div class="control-row">
          <button type="button" @click="meetElement">
            {{ isKorean ? "아래로 이동" : "Scroll down" }}
          </button>
          <button type="button" class="secondary" @click="returnAbove">
            {{ isKorean ? "위로 돌아가기" : "Return above" }}
          </button>
        </div>
        <ol class="steps">
          <li>
            {{ isKorean ? "아래로 내려가 카드를 깨웁니다." : "Scroll down to wake the card." }}
          </li>
          <li>
            {{ isKorean ? "카드가 화면 위로 지나갈 때까지 더 내립니다." : "Continue until it passes above." }}
          </li>
          <li>
            {{
              isKorean
                ? "맨 위로 돌아가 카드를 화면 아래에 둡니다."
                : "Return to the top so it is below again."
            }}
          </li>
          <li>{{ isKorean ? "다시 아래로 내려갑니다." : "Scroll down once more." }}</li>
        </ol>
        <div
          ref="eventLogPanel"
          class="event-log"
          aria-live="polite"
          aria-label="Viewake event log"
        >
          <strong>{{ isKorean ? "이벤트" : "Events" }}</strong>
          <p v-if="eventLog.length === 0">
            {{ isKorean ? "움직임을 기다리는 중…" : "Waiting for movement…" }}
          </p>
          <p v-for="entry in eventLog" :key="entry">{{ entry }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.viewake-playground {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 28px;
  background: var(--vp-c-bg);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
}

.playground-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 30px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.playground-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.eyebrow {
  display: inline-flex;
  border-radius: 999px;
  background: var(--viewake-accent);
  padding: 5px 8px;
  color: #071438;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

h2 {
  margin: 7px 0 0;
  border: 0;
  padding: 0;
  font-size: clamp(22px, 3vw, 30px);
  letter-spacing: -0.04em;
}

label {
  display: grid;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
}

select {
  min-width: 120px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  padding: 9px 34px 9px 12px;
  color: var(--vp-c-text-1);
  font: inherit;
}

.playground-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
}

.demo-scroller {
  height: 460px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  background:
    linear-gradient(rgba(217, 255, 54, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(217, 255, 54, 0.06) 1px, transparent 1px),
    var(--vp-c-bg-alt);
  background-size: 32px 32px;
  padding: 24px;
}

.demo-intro {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  padding: 12px 14px;
  font-size: 12px;
  backdrop-filter: blur(12px);
}

.demo-intro span,
.demo-spacer,
.demo-after {
  color: var(--vp-c-text-2);
}

.demo-spacer {
  display: grid;
  height: 500px;
  place-items: end center;
  padding-bottom: 24px;
  font-size: 12px;
  font-weight: 700;
}

.demo-card {
  border: 1px solid rgba(217, 255, 54, 0.42);
  border-radius: 22px;
  background: linear-gradient(145deg, #102552, #071438);
  padding: 28px;
  color: white;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
}

.demo-card h3 {
  margin: 18px 0 8px;
  font-size: 28px;
  color: white;
}

.demo-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.65;
}

.demo-badge {
  border-radius: 999px;
  background: #d9ff36;
  padding: 6px 10px;
  color: #071438;
  font-size: 11px;
  font-weight: 800;
}

.demo-after {
  display: grid;
  min-height: 520px;
  place-items: center;
  text-align: center;
  font-size: 13px;
}

.playground-panel {
  border-left: 1px solid var(--vp-c-divider);
  padding: 28px;
}

.generated-code {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-code-block-bg);
  padding: 14px;
}

.generated-code strong,
.generated-code small {
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.generated-code code {
  overflow-wrap: anywhere;
  color: var(--viewake-link);
  font-size: 11px;
  line-height: 1.65;
}

.control-row {
  display: grid;
  gap: 10px;
}

button {
  border: 0;
  border-radius: 12px;
  background: var(--viewake-accent);
  padding: 12px 16px;
  color: #071438;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

button.secondary {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.steps {
  margin: 24px 0;
  padding-left: 20px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.8;
}

.event-log {
  height: 148px;
  max-height: 148px;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  padding: 16px;
  scrollbar-gutter: stable;
}

.event-log strong {
  position: sticky;
  top: -16px;
  z-index: 1;
  display: block;
  margin-bottom: 8px;
  background: var(--vp-c-bg-soft);
  padding: 16px 0 6px;
  font-size: 12px;
}

.event-log p {
  margin: 4px 0;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}

@media (max-width: 760px) {
  .playground-header {
    align-items: stretch;
    flex-direction: column;
  }

  .playground-layout {
    grid-template-columns: 1fr;
  }

  .playground-panel {
    border-top: 1px solid var(--vp-c-divider);
    border-left: 0;
  }
}
</style>
