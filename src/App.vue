<template>
  <div class="min-h-screen pb-32 bg-slate-50 relative overflow-hidden">
    
    <!-- 顶部背景装饰 -->
    <div class="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50 to-transparent -z-10 pointer-events-none"></div>

    <!-- 沉浸式 Header -->
    <header class="pt-12 pb-4 px-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Price Ninja
          </h1>
          <p class="text-sm text-slate-400 font-medium tracking-wide">SMART SHOPPING ASSISTANT</p>
        </div>
        <!-- 未来可以放用户头像或设置 -->
        <div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500">
          🛍️
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="w-full px-4 relative z-10">
      <transition 
        enter-active-class="transition ease-out duration-300" 
        enter-from-class="opacity-0 translate-y-4" 
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200" 
        leave-from-class="opacity-100 translate-y-0" 
        leave-to-class="opacity-0 translate-y-4"
        mode="out-in"
      >
        <component :is="currentView" />
      </transition>
    </main>

    <!-- 悬浮底部导航 -->
    <div class="fixed bottom-6 left-4 right-4 z-50">
      <nav class="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-2xl max-w-md mx-auto h-16 flex items-center justify-around px-2">
        <button
          @click="currentView = Home"
          :class="['nav-item', currentView === Home ? 'active' : 'inactive']"
        >
          <div :class="['p-2 rounded-xl transition-all', currentView === Home ? 'bg-emerald-50' : 'bg-transparent']">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-[10px] mt-0.5" v-if="currentView === Home">比价</span>
        </button>
        
        <div class="w-px h-8 bg-slate-100"></div>

        <button
          @click="currentView = Notebook"
          :class="['nav-item', currentView === Notebook ? 'active' : 'inactive']"
        >
          <div :class="['p-2 rounded-xl transition-all', currentView === Notebook ? 'bg-emerald-50' : 'bg-transparent']">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-[10px] mt-0.5" v-if="currentView === Notebook">笔记</span>
        </button>

        <div class="w-px h-8 bg-slate-100"></div>

        <button
          @click="currentView = Profile"
          :class="['nav-item', currentView === Profile ? 'active' : 'inactive']"
        >
          <div :class="['p-2 rounded-xl transition-all', currentView === Profile ? 'bg-emerald-50' : 'bg-transparent']">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-[10px] mt-0.5" v-if="currentView === Profile">修行</span>
        </button>
      </nav>
    </div>
    <!-- 新手引导 -->
    <OnboardingTour />
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue' // Import shallowRef
import Home from './views/Home.vue'
import Notebook from './views/Notebook.vue'
import Profile from './views/Profile.vue'
import OnboardingTour from './components/OnboardingTour.vue'

// 使用 shallowRef 避免 Vue 尝试将组件对象变成响应式，消除性能警告
const currentView = shallowRef(Home)
</script>
