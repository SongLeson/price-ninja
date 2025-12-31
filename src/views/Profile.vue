<template>
  <div class="space-y-6 pb-24 animate-slide-up">
    <!-- 头部：忍者执照卡片 -->
    <div class="relative overflow-hidden rounded-3xl bg-slate-800 text-white shadow-2xl shadow-slate-300 p-6">
      <!-- 背景装饰 -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
              {{ ninjaRank.icon }}
            </div>
            <div>
              <div class="text-xs text-slate-400 font-bold tracking-widest uppercase">NINJA LICENSE</div>
              <h2 class="text-2xl font-black tracking-tight">{{ ninjaRank.title }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <div class="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-400 rounded-full" :style="{ width: progressToNextLevel + '%' }"></div>
                </div>
                <span class="text-[10px] text-slate-400" v-if="ninjaRank.nextTarget">
                  还差 ¥{{ (ninjaRank.nextTarget - userStats.totalSaved).toFixed(0) }} 晋升
                </span>
                <span class="text-[10px] text-emerald-400 font-bold" v-else>已达巅峰</span>
              </div>
            </div>
          </div>
          <div class="text-right">
             <div class="text-xs text-slate-400">ID: {{ String(Date.now()).slice(-6) }}</div>
             <div class="text-3xl font-black mt-2">LV.{{ userStats.level }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <div class="text-slate-400 text-xs mb-1">累计省钱</div>
            <div class="text-2xl font-bold text-emerald-400">¥{{ userStats.totalSaved.toFixed(0) }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <div class="text-slate-400 text-xs mb-1">避雷次数</div>
            <div class="text-2xl font-bold text-rose-400">{{ userStats.productsAvoided }} <span class="text-sm text-slate-400 font-normal">次</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计图表 (CSS 模拟) -->
    <div class="card p-6">
      <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📊</span> 购物偏好
      </h3>
      <div v-if="productStore.products.length > 0" class="space-y-4">
        <div v-for="(stat, index) in supermarketStats" :key="index">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-bold text-slate-600">{{ stat.name }}</span>
            <span class="text-slate-400">{{ stat.count }}次</span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000"
              :class="getColor(index)"
              :style="{ width: (stat.count / maxCount) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-slate-400 text-sm">
        暂无购物数据，快去记一笔吧！
      </div>
    </div>

    <!-- 每日运势卡片 -->
    <div class="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div class="relative z-10">
        <h3 class="text-slate-800 font-bold mb-4 flex items-center gap-2">
          <span class="text-xl">🔮</span> 摇签占卜
        </h3>

        <!-- 抽签中状态 -->
        <div v-if="!todayFortune" class="text-center py-4">
          <div class="text-6xl mb-4 animate-spin-slow">
            🎋
          </div>
          <p class="text-slate-400 text-sm mb-4">签文生成中...</p>
        </div>

        <!-- 已抽签状态 -->
        <div v-else class="animate-flip-in-x">
          <div class="text-center mb-3">
            <button 
              @click="handleShakeDraw"
              :disabled="isDrawing"
              class="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold hover:bg-purple-100 active:scale-95 transition-all disabled:opacity-50"
            >
              📳 再摇一次
            </button>
          </div>
          <div class="flex items-start gap-4">
            <div class="bg-slate-50 p-3 rounded-2xl text-4xl shadow-inner border border-slate-100 flex-shrink-0">
              {{ todayFortune.icon }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <h4 :class="['font-black text-xl mb-1', todayFortune.color]">{{ todayFortune.type }}</h4>
                  <p class="text-slate-800 font-bold mb-1">{{ todayFortune.title }}</p>
                </div>
                <div class="text-xs font-mono text-slate-300 bg-slate-50 px-2 py-1 rounded">
                  {{ new Date().toLocaleDateString() }}
                </div>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ todayFortune.desc }}</p>
              
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-xs">
                  <span class="bg-emerald-100 text-emerald-600 px-1.5 rounded font-bold">宜</span>
                  <span class="text-slate-600">{{ todayFortune.todo }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="bg-rose-100 text-rose-600 px-1.5 rounded font-bold">忌</span>
                  <span class="text-slate-600">{{ todayFortune.notTodo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="card p-6">
      <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🏆</span> 成就徽章
      </h3>
      <div class="grid grid-cols-3 gap-4">
        <div 
          v-for="badge in badges" 
          :key="badge.id"
          class="flex flex-col items-center text-center gap-2 p-3 rounded-xl transition-all"
          :class="badge.unlocked ? 'bg-slate-50' : 'opacity-40 grayscale'"
        >
          <div class="text-4xl filter drop-shadow-sm">{{ badge.icon }}</div>
          <div>
            <div class="text-xs font-bold text-slate-700">{{ badge.name }}</div>
            <div class="text-[10px] text-slate-400 leading-tight mt-0.5">{{ badge.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部标语 -->
    <div class="text-center pt-8 opacity-30">
        <div class="text-4xl mb-2 font-black tracking-widest text-slate-300">NINJA</div>
        <p class="text-[10px] text-slate-400">PRICE NINJA · 价格忍者</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import { storeToRefs } from 'pinia'
import { getRandomFortune } from '../utils/fortunes'
import { useShake } from '../composables/useShake'  // Fix: Import useShake

const productStore = useProductStore()
const { products } = storeToRefs(productStore) // Keep products for supermarketStats

const userStats = computed(() => productStore.userStats)
const ninjaRank = computed(() => productStore.ninjaRank)

// 计算升级进度
const progressToNextLevel = computed(() => {
  if (!ninjaRank.value.nextTarget) return 100
  // 简单处理：当前进度相比下一级目标的百分比
  // 更严谨的逻辑应该是 (current - prevCapped) / (next - prevCapped)
  // 但为了简化展示，直接用 current / next
  return Math.min(100, (userStats.value.totalSaved / ninjaRank.value.nextTarget) * 100)
})

// 计算超市统计
const supermarketStats = computed(() => {
  const stats = {}
  products.value.forEach(p => {
    const name = p.supermarket || '未知'
    stats[name] = (stats[name] || 0) + 1
  })
  return Object.entries(stats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // 只取前5
})

const maxCount = computed(() => {
  if (supermarketStats.value.length === 0) return 1
  return Math.max(...supermarketStats.value.map(s => s.count))
})

// 每日运势 (改为可重复摇签)
const todayFortune = ref(null)
const isDrawing = ref(false) // 防止连续触发

const drawFortune = () => {
  if (isDrawing.value) return // 防抖
  
  isDrawing.value = true
  
  // 翻转动画：先隐藏当前签
  todayFortune.value = null
  
  setTimeout(() => {
    const fortune = getRandomFortune()
    todayFortune.value = fortune
    
    // 震动反馈
    if (navigator.vibrate) navigator.vibrate([50, 30, 50])
    
    isDrawing.value = false
  }, 600) // 动画时长
}

// 集成摇一摇 (每次摇动都抽新签)
const onDeviceShake = () => {
  drawFortune()
}
const { enableShake } = useShake(onDeviceShake)

// 按钮点击处理 (同时请求权限)
const handleShakeDraw = async () => {
  await enableShake()
  drawFortune()
}

// 初始化时自动抽一次签
onMounted(() => {
  drawFortune()
})



// 成就系统
const badges = computed(() => [
  { 
    id: 1, 
    name: '初出茅庐', 
    icon: '🐣', 
    desc: '第一次省钱', 
    unlocked: userStats.value.totalSaved > 0 
  },
  { 
    id: 2, 
    name: '省钱达人', 
    icon: '💰', 
    desc: '累计省100元', 
    unlocked: userStats.value.totalSaved >= 100 
  },
  { 
    id: 3, 
    name: '精打细算', 
    icon: '🧮', 
    desc: '记录50次商品', 
    unlocked: userStats.value.productsRecorded >= 50 
  },
  { 
    id: 4, 
    name: '火眼金睛', 
    icon: '👀', 
    desc: '避雷10次', 
    unlocked: userStats.value.productsAvoided >= 10 
  },
  { 
    id: 5, 
    name: '忍术大师', 
    icon: '🥷', 
    desc: '达到上忍段位', 
    unlocked: userStats.value.level >= 4 
  },
  { 
    id: 6, 
    name: '富可敌国', 
    icon: '🏰', 
    desc: '累计省1000元', 
    unlocked: userStats.value.totalSaved >= 1000 
  }
])

const getColor = (index) => {
  const colors = ['bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 'bg-blue-400']
  return colors[index % colors.length]
}

// 模拟图表数据 (This was part of the instruction, but seems to replace dynamic supermarketStats. Keeping both for now as per strict instruction adherence)
const topSupermarkets = [
  { name: '山姆', percent: 80, color: 'bg-emerald-500' },
  { name: '盒马', percent: 60, color: 'bg-blue-500' },
  { name: 'Aldi', percent: 45, color: 'bg-indigo-500' },
  { name: '沃尔玛', percent: 30, color: 'bg-orange-500' },
  { name: 'Costco', percent: 20, color: 'bg-rose-500' },
]
</script>
