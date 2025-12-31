<template>
  <div class="space-y-8 animate-slide-up pb-32">
    <!-- 商品卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
      
      <!-- 商品 A (左) -->
      <div 
        :class="[
          'relative p-6 transition-all duration-500',
          isWinner(productA, productB) ? 'card-strong scale-105 z-20 ring-2 ring-emerald-400' : 'card'
        ]"
      >
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">商品 A</h2>
            <!-- 语音按钮 A -->
            <button 
              @click="startListening('A')"
              :class="[
                'p-2 rounded-full transition-all active:scale-95',
                listeningTarget === 'A' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-emerald-500'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </button>
          </div>
          <button 
            v-if="hasInput(productA)" 
            @click="resetProduct(productA)"
            class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">价格 (元)</label>
            <input 
              v-model.number="productA.price" 
              type="number" 
              placeholder="0.00" 
              class="input-minimal"
            >
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">分量</label>
            <div class="flex gap-3">
              <input 
                v-model.number="productA.amount" 
                type="number" 
                placeholder="0" 
                class="input-minimal flex-1"
              >
              <select 
                v-model="productA.unit" 
                class="bg-slate-50 rounded-2xl px-3 font-bold text-slate-600 border-none focus:ring-2 focus:ring-emerald-400 outline-none w-20 text-center appearance-none"
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
        </div>

        <!-- 结果展示 A -->
        <div v-if="productA.unitPrice" class="mt-6 pt-4 border-t border-slate-50">
          <div class="flex justify-between items-baseline">
            <span class="text-xs text-slate-400">单价</span>
            <span class="text-2xl font-black text-slate-800">
              <small class="text-sm font-normal text-slate-400">¥</small>
              {{ productA.unitPrice.toFixed(2) }}
              <span class="text-xs font-medium text-slate-400">/ {{ getNormalizedUnit(productA.unit) }}</span>
            </span>
          </div>
        </div>

        <!-- 胜者标签 -->
        <div v-if="isWinner(productA, productB)" class="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200 text-xs font-bold flex items-center gap-1 animate-pulse">
           <span>🏆 推荐</span>
        </div>
        
        <!-- 节省标签 -->
        <div v-if="isWinner(productA, productB) && savingsPercent > 0" class="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
           <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm opacity-90">
             便宜 {{ savingsPercent }}%
           </span>
        </div>
      </div>

      <!-- 商品 B (右) -->
      <div 
        :class="[
          'relative p-6 transition-all duration-500',
          isWinner(productB, productA) ? 'card-strong scale-105 z-20 ring-2 ring-emerald-400' : 'card'
        ]"
      >
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">商品 B</h2>
            <!-- 语音按钮 B -->
            <button 
              @click="startListening('B')"
              :class="[
                'p-2 rounded-full transition-all active:scale-95',
                listeningTarget === 'B' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-emerald-500'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </button>
          </div>
          <button 
            v-if="hasInput(productB)" 
            @click="resetProduct(productB)" 
            class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">价格 (元)</label>
            <input 
              v-model.number="productB.price" 
              type="number" 
              placeholder="0.00" 
              class="input-minimal"
            >
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">分量</label>
            <div class="flex gap-3">
              <input 
                v-model.number="productB.amount" 
                type="number" 
                placeholder="0" 
                class="input-minimal flex-1"
              >
              <select 
                v-model="productB.unit" 
                class="bg-slate-50 rounded-2xl px-3 font-bold text-slate-600 border-none focus:ring-2 focus:ring-emerald-400 outline-none w-20 text-center appearance-none"
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
        </div>

        <!-- 结果展示 B -->
        <div v-if="productB.unitPrice" class="mt-6 pt-4 border-t border-slate-50">
           <div class="flex justify-between items-baseline">
            <span class="text-xs text-slate-400">单价</span>
            <span class="text-2xl font-black text-slate-800">
              <small class="text-sm font-normal text-slate-400">¥</small>
              {{ productB.unitPrice.toFixed(2) }}
              <span class="text-xs font-medium text-slate-400">/ {{ getNormalizedUnit(productB.unit) }}</span>
            </span>
          </div>
        </div>

        <!-- 胜者标签 -->
        <div v-if="isWinner(productB, productA)" class="absolute -top-3 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200 text-xs font-bold flex items-center gap-1 animate-pulse">
           <span>🏆 推荐</span>
        </div>
        
        <!-- 节省标签 -->
        <div v-if="isWinner(productB, productA) && savingsPercent > 0" class="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
           <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm opacity-90">
             便宜 {{ savingsPercent }}%
           </span>
        </div>
      </div>
    </div>
    
    <!-- 全局提示框 (Toast) -->
    <div v-if="toastMsg" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/90 text-white px-6 py-3 rounded-full shadow-xl backdrop-blur-md text-sm font-bold animate-slide-up">
      {{ toastMsg }}
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
      <!-- 模拟摇一摇 (兜底方案) -->
      <button
        @click="handleShake"
        class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-100 shadow-sm transition-all active:scale-95 active:rotate-12"
        title="点我模拟摇一摇"
      >
        <span class="text-lg">📳</span>
      </button>

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
      <div class="text-xs text-slate-300 mt-2 flex items-center justify-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
        试试点击麦克风说 "20块500克"
      </div>
      <div class="mt-8 text-[10px] text-slate-200 font-mono">v1.3.1 (Ultra Low Sensitivity)</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import { parseVoiceResult } from '../utils/voiceParser'
import { useShake } from '../composables/useShake'

const productStore = useProductStore()

// 设备摇一摇回调
const onDeviceShake = () => {
  if (hasAnyInput.value) {
    if (navigator.vibrate) navigator.vibrate(200)
    resetAll()
    showToast('📳 已摇一摇清空!')
  }
}

// 初始化 Shake 监听，并获取权限请求方法
const { enableShake } = useShake(onDeviceShake)

// 手动点击摇一摇按钮
const handleShake = async () => {
  // 1. 尝试请求权限 (iOS 需要用户交互触发)
  const result = await enableShake()
  
  if (!result.success && result.error) {
    // 如果失败，不仅显示 Toast，还显示具体原因
    showToast(`⚠️ ${result.error}`)
    // 稍微延迟一下再执行清空，让用户看到错误
    setTimeout(() => {
       if (hasAnyInput.value) {
          if (navigator.vibrate) navigator.vibrate(200)
          resetAll()
          showToast('已强制清空')
       }
    }, 1500)
    return
  }
  
  // 2. 成功或无需权限，执行清空
  if (hasAnyInput.value) {
    if (navigator.vibrate) navigator.vibrate(200)
    resetAll()
    showToast('✨ 已清空')
  }
}

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

// 语音识别相关
const listeningTarget = ref(null) // 'A' or 'B'
const toastMsg = ref('')
let recognition = null

// 初始化语音识别
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'zh-CN'
    
    recognition.onstart = () => {
      showToast(listeningTarget.value === 'A' ? '请说出商品A的信息...' : '请说出商品B的信息...')
    }
    
    recognition.onend = () => {
      listeningTarget.value = null
    }
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      showToast(`识别到: "${transcript}"`)
      handleVoiceResult(transcript)
    }
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      listeningTarget.value = null
      showToast('语音识别失败，请重试')
    }
  } else {
    showToast('抱歉，您的浏览器不支持语音识别')
  }
}

// 开始监听
const startListening = (target) => {
  if (listeningTarget.value) return // 正在录音中
  
  if (!recognition) initSpeechRecognition()
  
  if (recognition) {
    listeningTarget.value = target
    try {
      recognition.start()
    } catch (e) {
      console.error(e)
    }
  }
}

// 处理语音结果
const handleVoiceResult = (text) => {
  const result = parseVoiceResult(text)
  const target = listeningTarget.value === 'A' ? productA.value : productB.value
  
  if (result.price) target.price = result.price
  if (result.amount) target.amount = result.amount
  if (result.unit) target.unit = result.unit
  
  if (!result.price && !result.amount) {
    showToast('没听清，请说 "20块500克"')
  }
}

// 显示 Toast
const showToast = (msg, duration = 3000) => {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, duration)
}

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
