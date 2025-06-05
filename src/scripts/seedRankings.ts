import { connectMongoose } from '../config/mongoose'
import { RankingModel } from '../models/ranking.model'
import { EMOJIS, PLAYER_PREFIXES, PLAYER_SUFFIXES } from '../constants/game'

const generatePlayerName = () => {
  const prefix = PLAYER_PREFIXES[Math.floor(Math.random() * PLAYER_PREFIXES.length)]
  const suffix = PLAYER_SUFFIXES[Math.floor(Math.random() * PLAYER_SUFFIXES.length)]
  return `${prefix}${suffix}`
}

const generateRandomTime = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const generateRandomEmoji = () => {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
}

const generateRanking = () => {
  const time = generateRandomTime(40, 180)
  return {
    name: generatePlayerName(),
    score: time,
    firstFound: generateRandomEmoji(),
    lastFound: generateRandomEmoji(),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  }
}

const seedRankings = async () => {
  try {
    await connectMongoose()
    
    await RankingModel.deleteMany({})
    console.log('🧹 Cleared existing rankings')

    const rankings = Array.from({ length: 30 }, generateRanking)
    await RankingModel.insertMany(rankings)
    
    console.log('✨ Successfully seeded rankings:')
    rankings.forEach(ranking => {
      console.log(`👤 ${ranking.name}: ${ranking.score}s (${ranking.firstFound} → ${ranking.lastFound})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding rankings:', error)
    process.exit(1)
  }
}

seedRankings() 