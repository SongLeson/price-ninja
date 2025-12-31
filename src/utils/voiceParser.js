/**
 * 语音文本解析器
 * 从自然语言中提取价格、分量和单位
 * 例如: "20块钱500克" -> { price: 20, amount: 500, unit: 'g' }
 */

// 单位映射表
const unitMap = {
  '克': 'g', 'g': 'g',
  '千克': 'kg', '公斤': 'kg', 'kg': 'kg',
  '斤': '500g', // 特殊处理
  '磅': 'lb', 'lb': 'lb',
  '毫升': 'ml', 'ml': 'ml',
  '升': 'L', 'l': 'L',
  '个': '个', '瓶': '个', '包': '个', '只': '个', '件': '个'
}

export const parseVoiceResult = (text) => {
  if (!text) return null
  
  // 1. 预处理
  // 将"块"、"元"统一
  let cleanText = text.replace(/块钱?/g, '元')
  
  const result = {
    price: null,
    amount: null,
    unit: null
  }

  // 2. 优先提取分量和单位 (避免 "20元500克" 中的 500 被误认为价格的小数或后续数字)
  // 匹配 "500克", "3斤", "2.5千克"
  const amountRegex = /(\d+(\.\d+)?)\s*(克|千克|公斤|斤|磅|毫升|升|个|瓶|包|只|件|g|kg|lb|ml|l)/i
  const amountMatch = cleanText.match(amountRegex)
  
  if (amountMatch) {
    let amount = parseFloat(amountMatch[1])
    let unitRaw = amountMatch[3].toLowerCase()
    
    // 特殊处理"斤"
    if (unitRaw === '斤') {
      amount = amount * 500
      result.unit = 'g'
    } else if (unitRaw === '公斤') {
      result.unit = 'kg'
    } else {
      result.unit = unitMap[unitRaw] || '个'
    }
    
    result.amount = parseFloat(amount.toFixed(2))
    
    // 关键：从文本中移除已匹配的分量，防止干扰价格提取
    cleanText = cleanText.replace(amountMatch[0], ' ') 
  }

  // 3. 提取价格
  // 处理 "15元5" 这种口语 -> "15.5元"
  // 必须限制第二部分只匹配 1-2 位数字，且后面不能紧跟数字 (避免匹配 "50元" 后的 "655" 如果分量没提取走)
  cleanText = cleanText.replace(/(\d+)元(\d{1,2})(?!\d)/, '$1.$2元')
  
  const priceRegex = /(\d+(\.\d+)?)(\s*元)/
  const priceMatch = cleanText.match(priceRegex)
  
  if (priceMatch) {
    result.price = parseFloat(priceMatch[1])
  } else {
    // 兜底：如果之前没匹配到 '元'，且文本里还剩下数字，那它可能是价格
    // (前提是 分量已经被移除了)
    const remainingRegex = /(\d+(\.\d+)?)/
    const remainingMatch = cleanText.match(remainingRegex)
    if (remainingMatch) {
      result.price = parseFloat(remainingMatch[1])
    }
  }

  return result
}
