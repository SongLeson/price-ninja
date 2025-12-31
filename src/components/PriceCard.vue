<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-700">{{ label }}</h3>
      <button
        v-if="price || amount"
        @click="clearInputs"
        class="text-gray-400 hover:text-gray-600 p-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <!-- 价格输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-2">
          价格 (元)
        </label>
        <input
          type="number"
          inputmode="decimal"
          v-model.number="price"
          placeholder="0.00"
          class="input-field"
          step="0.01"
        />
      </div>

      <!-- 单位数值输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-2">
          重量/容量
        </label>
        <div class="flex gap-2">
          <input
            type="number"
            inputmode="decimal"
            v-model.number="amount"
            placeholder="0"
            class="input-field flex-1"
            step="0.1"
          />
          <select
            v-model="unit"
            class="input-field w-24"
          >
            <option value="g">克</option>
            <option value="ml">毫升</option>
            <option value="kg">千克</option>
            <option value="L">升</option>
            <option value="个">个</option>
          </select>
        </div>
      </div>

      <!-- 单价显示 -->
      <div
        v-if="unitPrice"
        :class="[
          'p-4 rounded-xl transition-all duration-300',
          isCheaper ? 'bg-primary-50 border-2 border-primary-500' : 'bg-gray-50 border-2 border-gray-200'
        ]"
      >
        <div class="text-sm text-gray-600 mb-1">单价</div>
        <div :class="[
          'text-3xl font-bold',
          isCheaper ? 'text-primary-600' : 'text-gray-700'
        ]">
          ¥{{ unitPrice.toFixed(2) }}
          <span class="text-base font-normal text-gray-500">/{{ normalizedUnit }}</span>
        </div>
        <div v-if="isCheaper && savingsPercent" class="mt-2 text-sm font-semibold text-primary-600">
          💰 节省 {{ savingsPercent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  isCheaper: {
    type: Boolean,
    default: false
  },
  savingsPercent: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update'])

const price = ref(null)
const amount = ref(null)
const unit = ref('g')

// 标准化单位 (转换为基础单位)
const normalizedUnit = computed(() => {
  const unitMap = {
    'g': '100g',
    'kg': '100g',
    'ml': '100ml',
    'L': '100ml',
    '个': '个'
  }
  return unitMap[unit.value] || unit.value
})

// 计算单价 (统一按100g/100ml计算)
const unitPrice = computed(() => {
  if (!price.value || !amount.value || amount.value <= 0) return null
  
  let normalizedAmount = amount.value
  
  // 转换为基础单位
  if (unit.value === 'kg') {
    normalizedAmount = amount.value * 1000 // kg -> g
  } else if (unit.value === 'L') {
    normalizedAmount = amount.value * 1000 // L -> ml
  }
  
  // 计算每100单位的价格
  if (unit.value === '个') {
    return price.value / amount.value
  } else {
    return (price.value / normalizedAmount) * 100
  }
})

// 清空输入
const clearInputs = () => {
  price.value = null
  amount.value = null
}

// 监听变化并通知父组件
watch([price, amount, unit, unitPrice], () => {
  emit('update', {
    price: price.value,
    amount: amount.value,
    unit: unit.value,
    unitPrice: unitPrice.value
  })
})
</script>
