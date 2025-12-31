<template>
  <div class="space-y-6 animate-slide-up pb-40">
    <!-- 筛选标签 -->
    <div class="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2 -mx-4 px-4 overflow-x-auto flex gap-3 no-scrollbar">
      <button
        @click="filterTag = null"
        :class="[
          'px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm',
          filterTag === null 
            ? 'bg-slate-800 text-white shadow-slate-300 transform scale-105' 
            : 'bg-white text-slate-500 border border-slate-100'
        ]"
      >
        全部 ({{ productStore.products.length }})
      </button>
      <button
        @click="filterTag = '回购'"
        :class="[
          'px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm',
          filterTag === '回购' 
            ? 'bg-emerald-500 text-white shadow-emerald-200 transform scale-105' 
            : 'bg-white text-emerald-600 border border-emerald-100'
        ]"
      >
        ❤️ 必回购
      </button>
      <button
        @click="filterTag = '避雷'"
        :class="[
          'px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm',
          filterTag === '避雷' 
            ? 'bg-rose-500 text-white shadow-rose-200 transform scale-105' 
            : 'bg-white text-rose-600 border border-rose-100'
        ]"
      >
        ⚡ 避雷
      </button>
    </div>

    <!-- 商品列表 -->
    <div v-if="filteredProducts.length > 0" class="grid gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :class="[
          'card relative overflow-hidden transition-all duration-300',
          getCardStyle(product.rating)
        ]"
      >
        <!-- 卡片内容 -->
        <div class="p-5 relative z-10">
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold px-2 py-0.5 rounded bg-white/50 text-slate-500">{{ product.supermarket }}</span>
                <span class="text-xs text-slate-400">{{ formatDate(product.date) }}</span>
              </div>
              <h3 class="font-bold text-lg text-slate-800 leading-tight">{{ product.name }}</h3>
            </div>
            
            <div class="flex flex-col items-end gap-1">
              <div class="text-xl font-bold text-slate-800">¥{{ product.price }}</div>
              <div class="flex text-amber-400 text-sm">
                <span v-for="i in 5" :key="i">{{ i <= product.rating ? '★' : '☆' }}</span>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in product.tags"
              :key="tag"
              :class="[
                'px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase',
                getTagStyle(tag)
              ]"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 用户评论 -->
          <p v-if="product.comment" class="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl mb-4 italic border-l-2 border-slate-200">
            "{{ product.comment }}"
          </p>

          <!-- AI 评价区域 -->
          <div v-if="aiComments[product.id]" class="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-2xl p-4 animate-slide-up">
            <div class="flex gap-3">
              <div class="text-2xl mt-0.5">🤖</div>
              <div class="flex-1">
                <div class="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">AI 毒舌点评</div>
                <p class="text-sm text-slate-700 font-medium leading-relaxed">{{ aiComments[product.id].comment }}</p>
                <div class="mt-2 pt-2 border-t border-violet-100/50">
                   <p class="text-xs text-violet-600 font-bold">{{ aiComments[product.id].suggestion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 评价按钮 -->
          <button
            v-if="!aiComments[product.id]"
            @click="generateAICommentForProduct(product)"
            class="w-full mt-2 py-2.5 text-xs font-bold text-violet-500 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            让 AI 评评理
          </button>
          
          <!-- 删除按钮 (绝对定位在右上角，但在内容之下，避免误触) -->
          <button
             @click="confirmDelete(product.id)"
             class="absolute top-0 right-0 p-4 text-slate-300 hover:text-rose-400 transition-colors"
          >
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 opacity-60">
      <div class="text-6xl mb-4 grayscale opacity-30">📝</div>
      <p class="text-slate-400 font-medium">还没有记录哦</p>
      <p class="text-slate-300 text-xs mt-2">点击右下角按钮添加第一条笔记</p>
    </div>

    <!-- 悬浮添加按钮 (FAB) -->
    <button
      @click="showAddForm = true"
      class="fixed bottom-32 right-5 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl shadow-slate-400 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40 border border-slate-700"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- 添加商品表单 Modal (使用 Teleport 挂载到 body) -->
    <Teleport to="body">
      <div
        v-if="showAddForm"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end z-[60] transition-opacity"
        @click.self="showAddForm = false"
      >
        <div class="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 space-y-6 animate-slide-up max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 class="text-xl font-extrabold text-slate-800">记一笔</h3>
            <button @click="showAddForm = false" class="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <input
              v-model="newProduct.name"
              placeholder="商品名称"
              class="input-minimal bg-slate-50"
            />
            
            <div class="flex gap-4">
              <input
                v-model="newProduct.supermarket"
                placeholder="超市 (如 山姆)"
                class="input-minimal bg-slate-50 flex-1"
              />
              <input
                v-model.number="newProduct.price"
                type="number"
                placeholder="价格"
                class="input-minimal bg-slate-50 w-32"
                step="0.01"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">评分</label>
              <div class="flex justify-between px-4">
                <button
                  v-for="i in 5"
                  :key="i"
                  @click="newProduct.rating = i"
                  class="text-3xl transition-transform hover:scale-125 focus:outline-none"
                  :class="i <= newProduct.rating ? 'grayscale-0 scale-110' : 'grayscale opacity-30'"
                >
                  {{ i <= newProduct.rating ? '⭐' : '⭐' }}
                </button>
              </div>
              <div class="text-center mt-2 text-xs font-medium text-emerald-500" v-if="newProduct.rating >= 4">推荐购买!</div>
              <div class="text-center mt-2 text-xs font-medium text-rose-500" v-if="newProduct.rating <= 2">避雷!</div>
            </div>

            <div>
               <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">快捷标签</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                    newProduct.tags.includes(tag)
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  ]"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div>
              <textarea
                v-model="newProduct.comment"
                placeholder="写点什么..."
                class="input-minimal bg-slate-50 resize-none h-24 text-base"
              ></textarea>
            </div>

            <button
              @click="handleAddProduct"
              class="btn-gradient w-full py-4 text-lg shadow-xl shadow-emerald-200/50"
              :disabled="!isFormValid"
              :class="{ 'opacity-50 cursor-not-allowed grayscale': !isFormValid }"
            >
              保存笔记
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/products'
import { generateAIComment, generateAISuggestion } from '../utils/aiComments'

const productStore = useProductStore()

const showAddForm = ref(false)
const filterTag = ref(null)
const aiComments = ref({}) // 存储每个商品的 AI 评价

const availableTags = ['回购', '避雷', '太甜', '量大', '不新鲜', '性价比高', '脆蓝莓', '软蓝莓']

const newProduct = ref({
  name: '',
  supermarket: '',
  price: null,
  rating: 3,
  tags: [],
  comment: ''
})

// 表单验证
const isFormValid = computed(() => {
  return newProduct.value.name && 
         newProduct.value.supermarket && 
         newProduct.value.price && 
         newProduct.value.rating
})

// 筛选后的商品列表
const filteredProducts = computed(() => {
  if (!filterTag.value) {
    return productStore.products
  }
  return productStore.getProductsByTag(filterTag.value)
})

// 添加商品
const handleAddProduct = () => {
  if (!isFormValid.value) return
  
  productStore.addProduct({
    name: newProduct.value.name,
    supermarket: newProduct.value.supermarket,
    price: newProduct.value.price,
    rating: newProduct.value.rating,
    tags: newProduct.value.tags,
    comment: newProduct.value.comment
  })
  
  // 重置表单
  newProduct.value = {
    name: '',
    supermarket: '',
    price: null,
    rating: 3,
    tags: [],
    comment: ''
  }
  
  showAddForm.value = false
}

// 删除商品
const confirmDelete = (id) => {
  if (confirm('确定要删除这个商品吗?')) {
    productStore.deleteProduct(id)
  }
}

// 切换标签
const toggleTag = (tag) => {
  const index = newProduct.value.tags.indexOf(tag)
  if (index > -1) {
    newProduct.value.tags.splice(index, 1)
  } else {
    newProduct.value.tags.push(tag)
  }
}

// 获取卡片高亮样式 (根据评分)
const getCardStyle = (rating) => {
  if (rating <= 2) {
    // 避雷 - 红色调
    return 'border-l-4 border-l-rose-400 bg-white shadow-sm' 
  } else if (rating >= 4) {
    // 推荐 - 绿色调
    return 'border-l-4 border-l-emerald-400 bg-white shadow-md shadow-emerald-50' 
  }
  return 'border-l-4 border-l-slate-200 bg-white' // 中性
}

// 获取标签样式
const getTagStyle = (tag) => {
  const styles = {
    '回购': 'bg-emerald-100 text-emerald-700',
    '避雷': 'bg-rose-100 text-rose-700',
    '太甜': 'bg-amber-100 text-amber-700',
    '量大': 'bg-sky-100 text-sky-700',
    '不新鲜': 'bg-slate-200 text-slate-600 line-through',
    '性价比高': 'bg-teal-100 text-teal-700',
    '脆蓝莓': 'bg-indigo-100 text-indigo-700',
    '软蓝莓': 'bg-purple-100 text-purple-700'
  }
  return styles[tag] || 'bg-slate-100 text-slate-500'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', { year: '2-digit', month: 'numeric', day: 'numeric' })
}

// 生成 AI 评价
const generateAICommentForProduct = (product) => {
  // 模拟 AI 思考延迟
  const thinkingDelay = 500 + Math.random() * 1000 
  
  // 先显示"思考中"状态
  aiComments.value[product.id] = {
    comment: '🤔 AI 正在检索全球避雷数据库...',
    suggestion: ''
  }
  
  // 延迟后显示真实评价
  setTimeout(() => {
    aiComments.value[product.id] = {
      comment: generateAIComment(product),
      suggestion: generateAISuggestion(product)
    }
  }, thinkingDelay)
}
</script>

<style scoped>
/* 隐藏滚动条 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
