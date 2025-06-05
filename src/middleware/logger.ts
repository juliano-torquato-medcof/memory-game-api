import { Request, Response, NextFunction } from 'express'

interface PayloadInfo {
  type: string
  size: number
  structure?: string[]
  value: any
}

const getPayloadInfo = (data: any): PayloadInfo => {
  try {
    if (!data) return {
      type: 'empty',
      size: 0,
      value: null
    }
    
    if (typeof data === 'string') {
      const parsed = JSON.parse(data)
      return {
        type: 'JSON',
        size: Buffer.from(data).length,
        structure: Object.keys(parsed),
        value: parsed
      }
    }
    
    return {
      type: typeof data,
      size: Buffer.from(JSON.stringify(data)).length,
      structure: Object.keys(data),
      value: data
    }
  } catch (error) {
    return {
      type: typeof data,
      size: Buffer.from(String(data)).length,
      value: data
    }
  }
}

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  
  console.log('\n🔍 Debug Info - Request:', requestId)
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.log('📡 Basic Info:')
  console.log('   Method:', req.method)
  console.log('   Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl)
  console.log('   Route:', req.route?.path || 'Not matched yet')
  console.log('   Path Params:', req.params)
  
  if (Object.keys(req.query).length) {
    console.log('🔍 Query Params:')
    Object.entries(req.query).forEach(([key, value]) => {
      console.log(`   ${key}:`, value)
    })
  }

  if (Object.keys(req.body || {}).length) {
    console.log('📦 Request Body:')
    const bodyInfo = getPayloadInfo(req.body)
    console.log('   Type:', bodyInfo.type)
    console.log('   Size:', bodyInfo.size, 'bytes')
    console.log('   Content:', bodyInfo.value)
  }

  const originalSend = res.send
  res.send = function (payload) {
    res.send = originalSend
    res.send(payload)
    
    const responseTime = Date.now() - start
    
    console.log('\n📤 Response Info:', requestId)
    console.log('⚡ Performance:')
    console.log('   Response Time:', responseTime + 'ms')
    console.log('   Memory Usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB')
    
    console.log('📊 Status Info:')
    console.log('   Code:', res.statusCode)
    console.log('   Message:', res.statusMessage)
    
    const payloadInfo = getPayloadInfo(payload)
    console.log('📦 Response Payload:')
    console.log('   Type:', payloadInfo.type)
    console.log('   Size:', payloadInfo.size, 'bytes')
    if (payloadInfo.structure) {
      console.log('   Structure:', payloadInfo.structure)
    }
    console.log('   Content:', payloadInfo.value)

    if (res.statusCode >= 400) {
      console.log('❌ Error Details:')
      console.log('   Stack:', new Error().stack?.split('\n').slice(2).join('\n   '))
    }
    
    console.log('\n' + '='.repeat(80) + '\n')
    
    return res
  }

  next()
} 