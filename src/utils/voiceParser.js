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
  
  // 1. 预处理：将中文数字转阿拉伯数字 (可选，简单场景暂不处理，假设转换引擎已输出数字)
  // 将"块"、"元"统一
  let cleanText = text.replace(/块钱?/g, '元')
  
  const result = {
    price: null,
    amount: null,
    unit: null
  }

  // 2. 提取价格
  // 匹配模式：数字 + (元|$)
  // 或者 纯数字 (如果找不到单位，或者根据上下文推断)
  // 匹配 "15.5元", "15块5"
  
  // 处理 "15块5" 这种口语 -> "15.5元"
  cleanText = cleanText.replace(/(\d+)元(\d+)/, '$1.$2元')
  
  const priceRegex = /(\d+(\.\d+)?)(\s*元)/
  const priceMatch = cleanText.match(priceRegex)
  if (priceMatch) {
    result.price = parseFloat(priceMatch[1])
    // 从文本中移除已匹配的价格，避免混淆分量
    cleanText = cleanText.replace(priceMatch[0], '') 
  }

  // 3. 提取分量和单位
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
      result.unit = 'kg' // 也可以直接转 g
    } else {
      result.unit = unitMap[unitRaw] || '个'
    }
    
    result.amount = parseFloat(amount.toFixed(2))
  } else {
    // 如果没有匹配到标准单位，且剩下还有数字，可能就是“个数”
    // 例如 "10元 3个" -> 说了 3个
    // 或者 "10元 3" -> 3可能是分量? 难以判断，暂且认为是分量如果不带单位
    const simpleNumberRegex = /(\d+(\.\d+)?)/
    const simpleMatch = cleanText.match(simpleNumberRegex)
    if (simpleMatch && !result.amount) { // 只有在还没找到分量时才匹配
       // 这是一个兜底，假设剩下的数字是分量
       // result.amount = parseFloat(simpleMatch[1])
       // result.unit = '个' // 默认为个
       // 兜底策略风险较大，暂不启用，防止把价格误判
    }
  }
  
  // 4. 价格兜底策略 (如果之前没匹配到 '元')
  // 如果文本里有一个数字没被用作分量，那它可能是价格
  if (!result.price) {
     const remainingRegex = /(\d+(\.\d+)?)/
     const remainingMatch = cleanText.match(remainingRegex)
     if (remainingMatch) {
       result.price = parseFloat(remainingMatch[1])
     }
  }

  return result
}
