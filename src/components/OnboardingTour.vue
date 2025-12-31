<template>
  <div v-if="isActive" class="fixed inset-0 z-[100] pointer-events-auto">
    <!-- 遮罩层 (带挖孔效果的SVG实现可能会复杂，这里用简单的半透明遮罩+高亮元素之上的绝对定位提示框) 
         为了简单且高性能，我们采用 '基于坐标的提示框' 方案 
    -->
    <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="nextStep"></div>

    <!-- 引导内容容器 -->
    <div class="relative w-full h-full pointer-events-none">
      
      <!-- 步骤 1: 语音比价 -->
      <div v-if="currentStep === 0" class="absolute top-[110px] left-6 animate-bounce-in">
        <div class="bg-white text-slate-800 p-4 rounded-2xl shadow-2xl max-w-xs relative pointer-events-auto">
          <div class="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45"></div>
          <h3 class="font-bold text-lg mb-2">🎤 语音比价</h3>
          <p class="text-sm text-slate-600 mb-4">无需打字！点击麦克风，说出 <br/><b>"20块钱500克"</b> 即可自动填单。</p>
          <button @click="nextStep" class="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold w-full">知道了 (1/3)</button>
        </div>
      </div>

      <!-- 步骤 2: 摇一摇 -->
      <div v-if="currentStep === 1" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-fade-in">
        <div class="text-8xl mb-6 animate-shake">📳</div>
        <div class="bg-white text-slate-800 p-6 rounded-3xl shadow-2xl max-w-xs mx-auto pointer-events-auto">
          <h3 class="font-bold text-lg mb-2">👋 摇一摇清空</h3>
          <p class="text-sm text-slate-600 mb-4">比价结束后，用力<b>摇晃手机</b>，<br/>即可一键清空所有数据！</p>
          <button @click="nextStep" class="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold w-full">酷！ (2/3)</button>
        </div>
      </div>

      <!-- 步骤 3: 每日运势 -->
      <div v-if="currentStep === 2" class="absolute bottom-24 right-4 animate-slide-up">
        <div class="bg-white text-slate-800 p-4 rounded-2xl shadow-2xl max-w-xs ml-auto relative pointer-events-auto">
           <div class="absolute -bottom-2 right-12 w-4 h-4 bg-white rotate-45"></div>
          <h3 class="font-bold text-lg mb-2">🔮 每日运势</h3>
          <p class="text-sm text-slate-600 mb-4">点击<b>"修行"</b>，每天抽一支财运签，<br/>还能查看你的省钱段位！</p>
          <button @click="finishTour" class="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold w-full">开始省钱 (3/3)</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isActive = ref(false)
const currentStep = ref(0) // 0: Voice, 1: Shake, 2: Fortune

const startTour = () => {
  isActive.value = true
  currentStep.value = 0
}

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
  } else {
    finishTour()
  }
}

const finishTour = () => {
  isActive.value = false
  localStorage.setItem('price-ninja-tour-completed', 'true')
}

// 暴露给父组件调用
defineExpose({ startTour })

onMounted(() => {
  const isCompleted = localStorage.getItem('price-ninja-tour-completed')
  if (!isCompleted) {
    // 延迟一点显示，让页面先加载完
    setTimeout(() => {
      startTour()
    }, 1000)
  }
})
</script>

<style scoped>
.animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.animate-shake { animation: shake 2s infinite; }

@keyframes bounceIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
}
</style>
