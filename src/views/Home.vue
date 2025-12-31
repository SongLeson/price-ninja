<template>
  <div class="space-y-8 animate-slide-up">
    <!-- 标题不再需要，已移至 Header -->

    <!-- 比价卡片 - 左右布局 (手机上下布局) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 商品 A (左) -->
      <div
        :class="[
          'relative transition-all duration-500 transform',
          isWinner(productA, productB) ? 'scale-105 z-10' : 'scale-100 z-0'
        ]"
      >
        <div :class="[
          isWinner(productA, productB) ? 'card-strong' : 'card',
          'p-6 relative overflow-hidden'
        ]">
          <!-- 胜者光效背景 -->
          <div v-if="isWinner(productA, productB)" class="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent pointer-events-none"></div>

          <div class="relative flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span class="w-2 h-6 bg-emerald-400 rounded-full"></span>
              商品 A
            </h3>
            <!-- Winner 标签 -->
            <div
              v-if="isWinner(productA, productB)"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-200 animate-pulse-soft flex items-center gap-1"
            >
              <span>🏆</span> 推荐
            </div>
            <!-- 重置按钮 (仅当有输入且未获胜时显示在右上角，或作为次要操作) -->
            <button 
              v-if="hasInput(productA) && !isWinner(productA, productB)"
              @click="resetProduct(productA)"
              class="text-slate-300 hover:text-slate-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="space-y-5 relative">
            <!-- 价格输入 -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                价格 (元)
              </label>
              <input
                type="number"
                inputmode="decimal"
                v-model.number="productA.price"
                placeholder="0.00"
                class="input-minimal"
                step="0.01"
              />
            </div>

            <!-- 分量输入 -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                分量
              </label>
              <div class="flex gap-3">
                <input
                  type="number"
                  inputmode="decimal"
                  v-model.number="productA.amount"
                  placeholder="0"
                  class="input-minimal flex-1"
                  step="0.1"
                />
                <select
                  v-model="productA.unit"
                  class="w-24 bg-slate-50 rounded-2xl border-none font-bold text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none p-0 text-center"
                >
                  <option value="g">克</option>
                  <option value="kg">千克</option>
                  <option value="lb">磅</option>
                  <option value="ml">毫升</option>
                  <option value="L">升</option>
                  <option value="个">个</option>
                </select>
              </div>
            </div>

            <!-- 单价显示 -->
            <div
              v-if="productA.unitPrice"
              class="pt-4 border-t border-slate-50"
            >
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-400">单价</span>
                <div class="text-right">
                  <span class="text-2xl font-bold text-slate-800">
                    ¥{{ productA.unitPrice.toFixed(2) }}
                  </span>
                  <span class="text-xs text-slate-400 ml-1">/{{ getNormalizedUnit(productA.unit) }}</span>
                </div>
              </div>
            </div>

            <!-- 优惠力度 (仅展示在胜者卡片内) -->
            <div
              v-if="isWinner(productA, productB)"
              class="mt-4 bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100"
            >
              <div class="text-xs font-bold text-emerald-600 uppercase mb-1">超值优惠</div>
              <div class="text-3xl font-extrabold text-emerald-600 tracking-tight">便宜 {{ savingsPercent }}%</div>
              <div class="text-xs text-emerald-500 mt-1 font-medium">省 ¥{{ savingsAmount.toFixed(2) }} 元</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间 VS (可选，增加趣味性) -->
      <div class="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 font-black shadow-inner">VS</div>
      </div>

      <!-- 商品 B (右) -->
      <div
        :class="[
          'relative transition-all duration-500 transform',
          isWinner(productB, productA) ? 'scale-105 z-10' : 'scale-100 z-0'
        ]"
      >
        <div :class="[
          isWinner(productB, productA) ? 'card-strong' : 'card',
          'p-6 relative overflow-hidden'
        ]">
           <!-- 胜者光效背景 -->
           <div v-if="isWinner(productB, productA)" class="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent pointer-events-none"></div>

          <div class="relative flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
              <span class="w-2 h-6 bg-blue-400 rounded-full"></span>
              商品 B
            </h3>
            <!-- Winner 标签 -->
            <div
              v-if="isWinner(productB, productA)"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-200 animate-pulse-soft flex items-center gap-1"
            >
              <span>🏆</span> 推荐
            </div>
             <!-- 重置按钮 -->
             <button 
              v-if="hasInput(productB) && !isWinner(productB, productA)"
              @click="resetProduct(productB)"
              class="text-slate-300 hover:text-slate-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="space-y-5 relative">
            <!-- 价格输入 -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                价格 (元)
              </label>
              <input
                type="number"
                inputmode="decimal"
                v-model.number="productB.price"
                placeholder="0.00"
                class="input-minimal"
                step="0.01"
              />
            </div>

            <!-- 分量输入 -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                分量
              </label>
              <div class="flex gap-3">
                <input
                  type="number"
                  inputmode="decimal"
                  v-model.number="productB.amount"
                  placeholder="0"
                  class="input-minimal flex-1"
                  step="0.1"
                />
                <select
                  v-model="productB.unit"
                  class="w-24 bg-slate-50 rounded-2xl border-none font-bold text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none p-0 text-center"
                >
                  <option value="g">克</option>
                  <option value="kg">千克</option>
                  <option value="lb">磅</option>
                  <option value="ml">毫升</option>
                  <option value="L">升</option>
                  <option value="个">个</option>
                </select>
              </div>
            </div>

             <!-- 单价显示 -->
             <div
              v-if="productB.unitPrice"
              class="pt-4 border-t border-slate-50"
            >
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-400">单价</span>
                <div class="text-right">
                  <span class="text-2xl font-bold text-slate-800">
                    ¥{{ productB.unitPrice.toFixed(2) }}
                  </span>
                  <span class="text-xs text-slate-400 ml-1">/{{ getNormalizedUnit(productB.unit) }}</span>
                </div>
              </div>
            </div>

            <!-- 优惠力度 (仅展示在胜者卡片内) -->
            <div
              v-if="isWinner(productB, productA)"
              class="mt-4 bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100"
            >
              <div class="text-xs font-bold text-emerald-600 uppercase mb-1">超值优惠</div>
              <div class="text-3xl font-extrabold text-emerald-600 tracking-tight">便宜 {{ savingsPercent }}%</div>
              <div class="text-xs text-emerald-500 mt-1 font-medium">省 ¥{{ savingsAmount.toFixed(2) }} 元</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 单位不匹配警告 -->
    <div v-if="hasAnyInput && !canCompare" class="card bg-orange-50 border border-orange-200 p-4 animate-slide-up">
      <div class="flex items-start gap-3">
        <div class="text-2xl">⚠️</div>
        <div>
          <div class="font-bold text-orange-800 mb-1">单位类型不匹配</div>
          <p class="text-sm text-orange-700">
            请确保比较的是同类单位（如重量 vs 重量）。
          </p>
        </div>
      </div>
    </div>

    <!-- 结算弹窗 (金币雨效果) -->
    <div v-if="showReward" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"></div>
      <div class="relative z-10 text-center animate-bounce-in">
        <div class="text-8xl mb-4 animate-spin-slow">💰</div>
        <div class="text-4xl font-extrabold text-yellow-400 drop-shadow-lg stroke-text">
          +{{ lastSavedAmount }}元
        </div>
        <div class="text-white font-bold mt-2 text-xl">已存入你的金库!</div>
      </div>
      <!-- 简单的 CSS 粒子 (实际项目中可用 canvas 优化) -->
      <div class="absolute inset-0 overflow-hidden">
        <div v-for="n in 20" :key="n" class="coin-particle" :style="getCoinStyle(n)">💰</div>
      </div>
    </div>

    <!-- 全局操作栏 (重置 & 结算) -->
    <div v-if="hasAnyInput" class="flex justify-center gap-4 pt-4 animate-slide-up pb-32">
      <button
        @click="resetAll"
        class="flex items-center gap-2 text-slate-400 hover:text-slate-600 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        <span class="font-bold text-sm">重置</span>
      </button>

      <!-- 结算按钮: 只有在有优惠且未结算时显示 -->
      <button
        v-if="savingsAmount > 0"
        @click="handleSaveMoney"
        class="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all active:scale-95 transform hover:-translate-y-1"
      >
        <span class="text-xl">💰</span>
        <span class="font-bold text-lg">我买了! 省{{ savingsAmount.toFixed(1) }}元</span>
      </button>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!hasAnyInput" class="text-center py-12 opacity-60">
      <div class="text-5xl mb-4 grayscale opacity-50">🛒</div>
      <p class="text-slate-400 font-medium">输入价格与分量，自动计算单价</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

const productA = ref({
  price: null,
  amount: null,
  unit: 'g',
  unitPrice: null
})

const productB = ref({
  price: null,
  amount: null,
  unit: 'g',
  unitPrice: null
})

// 奖励动画状态
const showReward = ref(false)
const lastSavedAmount = ref(0)

// 辅助函数：判断是否获胜
const isWinner = (me, opponent) => {
  return me.unitPrice && opponent.unitPrice && me.unitPrice < opponent.unitPrice && canCompare.value
}

// 辅助函数：是否有输入
const hasInput = (p) => p.price || p.amount

// 辅助函数：重置单个
const resetProduct = (p) => {
  p.price = null
  p.amount = null
  p.unitPrice = null
}

// 单位类型分类
const getUnitType = (unit) => {
  const weightUnits = ['g', 'kg', 'lb']
  const volumeUnits = ['ml', 'L']
  
  if (weightUnits.includes(unit)) return 'weight'
  if (volumeUnits.includes(unit)) return 'volume'
  return 'count'
}

// 标准化单位显示
const getNormalizedUnit = (unit) => {
  const unitMap = {
    'g': '100g',
    'kg': '100g',
    'lb': '100g',
    'ml': '100ml',
    'L': '100ml',
    '个': '个'
  }
  return unitMap[unit] || unit
}

// 将所有单位转换为基础单位 (克 或 毫升)
const convertToBaseUnit = (amount, unit) => {
  const conversionRates = {
    'g': 1, 'kg': 1000, 'lb': 453.592,
    'ml': 1, 'L': 1000,
    '个': 1
  }
  return amount * (conversionRates[unit] || 1)
}

// 计算单价 (统一为每100基础单位的价格)
const calculateUnitPrice = (product) => {
  if (!product.price || !product.amount || product.amount <= 0) return null
  
  const unitType = getUnitType(product.unit)
  
  if (unitType === 'count') {
    return product.price / product.amount
  }
  
  const baseAmount = convertToBaseUnit(product.amount, product.unit)
  return (product.price / baseAmount) * 100
}

// 检查两个商品单位是否可比较
const canCompare = computed(() => {
  if (!productA.value.unit || !productB.value.unit) return true
  const typeA = getUnitType(productA.value.unit)
  const typeB = getUnitType(productB.value.unit)
  return typeA === typeB
})

// 实时计算
watch([() => productA.value.price, () => productA.value.amount, () => productA.value.unit], () => {
  productA.value.unitPrice = calculateUnitPrice(productA.value)
}, { immediate: true })

watch([() => productB.value.price, () => productB.value.amount, () => productB.value.unit], () => {
  productB.value.unitPrice = calculateUnitPrice(productB.value)
}, { immediate: true })

// 计算节省百分比
const savingsPercent = computed(() => {
  if (!productA.value.unitPrice || !productB.value.unitPrice) return 0
  const higher = Math.max(productA.value.unitPrice, productB.value.unitPrice)
  const lower = Math.min(productA.value.unitPrice, productB.value.unitPrice)
  return Math.round(((higher - lower) / higher) * 100)
})

// 计算节省金额
const savingsAmount = computed(() => {
  if (!productA.value.unitPrice || !productB.value.unitPrice) return 0
  const expensiveProduct = productA.value.unitPrice > productB.value.unitPrice ? productA.value : productB.value
  const cheapProduct = productA.value.unitPrice < productB.value.unitPrice ? productA.value : productB.value
  if (!expensiveProduct.price || !cheapProduct.price) return 0
  return Math.abs(expensiveProduct.price - cheapProduct.price)
})

// 检查是否有任何输入
const hasAnyInput = computed(() => {
  return productA.value.price || productA.value.amount || 
         productB.value.price || productB.value.amount
})

// 重置所有输入
const resetAll = () => {
  resetProduct(productA.value)
  resetProduct(productB.value)
}

// 结算省钱金额
const handleSaveMoney = () => {
  const amount = Number(savingsAmount.value.toFixed(2))
  if (amount <= 0) return
  
  // 调用 Store 记录
  productStore.recordSavings(amount)
  
  // 触发动画
  lastSavedAmount.value = amount
  showReward.value = true
  
  // 3秒后关闭动画并重置
  setTimeout(() => {
    showReward.value = false
    resetAll()
  }, 2500)
}

// 生成金币粒子样式
const getCoinStyle = (n) => {
  const left = Math.random() * 100 + '%'
  const animationDuration = 1 + Math.random() * 2 + 's'
  const animationDelay = Math.random() * 0.5 + 's'
  return {
    left,
    animationDuration,
    animationDelay,
    position: 'absolute',
    top: '-50px',
    fontSize: Math.random() * 20 + 20 + 'px',
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.animate-spin-slow { animation: spin 3s linear infinite; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes bounceIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }

.coin-particle {
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  to { transform: translateY(110vh) rotate(360deg); }
}

.stroke-text {
  -webkit-text-stroke: 1px #b45309; /* text-amber-700 */
}
</style>
