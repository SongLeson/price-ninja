import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
  // 状态
  const products = ref([])
  const userStats = ref({
    totalSaved: 0,      // 累计省钱金额 (元)
    productsAvoided: 0, // 累计避雷次数 (评分<=2)
    productsRecorded: 0, // 累计记录商品数
    exp: 0,             // 经验值
    level: 1            // 等级
  })

  // 从 localStorage 加载数据
  const loadFromStorage = () => {
    try {
      const savedProducts = localStorage.getItem('price-ninja-products')
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts)
        if (Array.isArray(parsed)) {
          products.value = parsed
        }
      }
      
      const savedStats = localStorage.getItem('price-ninja-stats')
      if (savedStats) {
        const parsed = JSON.parse(savedStats)
        if (parsed && typeof parsed === 'object') {
          // 合并默认值，防止缺少字段
          userStats.value = { ...userStats.value, ...parsed }
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      // 如果出错，保持默认值
    }
  }

  // 监听数据变化,自动保存
  watch([products, userStats], () => {
    try {
      localStorage.setItem('price-ninja-products', JSON.stringify(products.value))
      localStorage.setItem('price-ninja-stats', JSON.stringify(userStats.value))
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }, { deep: true })

  // 忍者段位系统
  const ninjaRank = computed(() => {
    const saved = userStats.value.totalSaved
    if (saved >= 1000) return { title: '火影', icon: '🔥', color: 'text-orange-500', bg: 'bg-orange-100', nextTarget: null }
    if (saved >= 500) return { title: '上忍', icon: '⚔️', color: 'text-rose-500', bg: 'bg-rose-100', nextTarget: 1000 }
    if (saved >= 200) return { title: '中忍', icon: '🌪️', color: 'text-purple-500', bg: 'bg-purple-100', nextTarget: 500 }
    if (saved >= 50) return { title: '下忍', icon: '🍃', color: 'text-emerald-500', bg: 'bg-emerald-100', nextTarget: 200 }
    return { title: '忍术学员', icon: '🥚', color: 'text-slate-500', bg: 'bg-slate-100', nextTarget: 50 }
  })

  // Action: 记录一次省钱操作
  const recordSavings = (amount) => {
    if (amount <= 0) return
    userStats.value.totalSaved += amount
    userStats.value.exp += Math.ceil(amount) // 简单逻辑: 1元 = 1经验
  }

  // 添加商品
  const addProduct = (product) => {
    const newProduct = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...product
    }
    products.value.unshift(newProduct)
    
    // 更新统计
    userStats.value.productsRecorded++
    if (product.rating <= 2) {
      userStats.value.productsAvoided++
      userStats.value.exp += 50 // 避雷一次 +50经验
    } else {
      userStats.value.exp += 20 // 普通记录 +20经验
    }
    
    return newProduct
  }

  // 更新商品
  const updateProduct = (id, updates) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...updates
      }
      return products.value[index]
    }
    return null
  }

  // 删除商品
  const deleteProduct = (id) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      return true
    }
    return false
  }

  // 根据评分获取商品
  const getProductsByRating = (minRating, maxRating) => {
    return products.value.filter(p => p.rating >= minRating && p.rating <= maxRating)
  }

  // 根据标签获取商品
  const getProductsByTag = (tag) => {
    return products.value.filter(p => p.tags && p.tags.includes(tag))
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    products,
    userStats,
    ninjaRank,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByRating,
    getProductsByTag,
    recordSavings
  }
})
