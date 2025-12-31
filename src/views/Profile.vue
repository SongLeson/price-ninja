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
import { computed } from 'vue'
import { useProductStore } from '../stores/products'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { userStats, ninjaRank, products } = storeToRefs(productStore)

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

// 成就系统
const badges = computed(() => [
  { 
    id: 1, 
    name: '初出茅庐', 
    icon: '🌱', 
    desc: '记录第1个商品', 
    unlocked: userStats.value.productsRecorded >= 1 
  },
  { 
    id: 2, 
    name: '省钱达人', 
    icon: '💰', 
    desc: '累计省下100元', 
    unlocked: userStats.value.totalSaved >= 100 
  },
  { 
    id: 3, 
    name: '排雷专家', 
    icon: '💣', 
    desc: '避开3个坑', 
    unlocked: userStats.value.productsAvoided >= 3 
  },
  { 
    id: 4, 
    name: '火眼金睛', 
    icon: '👁️', 
    desc: '累计记录20个商品', 
    unlocked: userStats.value.productsRecorded >= 20 
  },
  { 
    id: 5, 
    name: '精打细算', 
    icon: '🧮', 
    desc: '累计省下500元', 
    unlocked: userStats.value.totalSaved >= 500 
  },
  { 
    id: 6, 
    name: '超市霸主', 
    icon: '👑', 
    desc: '达到火影段位', 
    unlocked: userStats.value.totalSaved >= 1000 
  }
])

const getColor = (index) => {
  const colors = ['bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 'bg-blue-400']
  return colors[index % colors.length]
}
</script>
