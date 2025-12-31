import { onMounted, onUnmounted, ref } from 'vue'

export function useShake(onShake, threshold = 60) {
  let lastX = 0
  let lastY = 0
  let lastZ = 0
  let lastTime = 0
  const isSupported = ref(false)

  const handleMotion = (event) => {
    const current = event.accelerationIncludingGravity
    if (!current) return

    const currentTime = Date.now()
    if ((currentTime - lastTime) > 100) {
      const diffTime = currentTime - lastTime
      lastTime = currentTime

      const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000

      if (speed > threshold) {
        onShake()
      }

      lastX = current.x
      lastY = current.y
      lastZ = current.z
    }
  }

  const enableShake = async () => {
    // iOS 13+ 需要请求权限
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission()
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotion, false)
          return { success: true }
        } else {
          return { success: false, error: '用户拒绝被监听摇一摇' }
        }
      } catch (e) {
        console.error(e)
        // 关键：返回错误信息
        return { success: false, error: '只能在 HTTPS (安全连接) 下申请摇一摇权限', raw: e }
      }
    }
    // 非 iOS 13+
    if (window.DeviceMotionEvent) {
       window.removeEventListener('devicemotion', handleMotion)
       window.addEventListener('devicemotion', handleMotion, false)
       return { success: true }
    }
    return { success: false, error: '设备不支持传感器' }
  }

  onMounted(() => {
    if (window.DeviceMotionEvent) {
      isSupported.value = true
      // 尝试直接监听（Android 或 旧版 iOS）
      window.addEventListener('devicemotion', handleMotion, false)
    }
  })

  onUnmounted(() => {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', handleMotion)
    }
  })
  
  return { enableShake, isSupported }
}
