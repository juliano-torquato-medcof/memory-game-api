import { connectMongoose } from '../config/mongoose'
import { RankingModel } from '../models/ranking.model'
import { StatsModel } from '../models/stats.model'
import { EMOJIS } from '../constants/game'

type CardCount = { [key: string]: number }

const calculateCardStats = (rankings: { firstFound: string; lastFound: string }[]) => {
  const firstFoundCount: CardCount = {}
  const lastFoundCount: CardCount = {}
  
  // Initialize counts for all emojis
  EMOJIS.forEach(emoji => {
    firstFoundCount[emoji] = 0
    lastFoundCount[emoji] = 0
  })
  
  // Count occurrences
  rankings.forEach(ranking => {
    firstFoundCount[ranking.firstFound]++
    lastFoundCount[ranking.lastFound]++
  })

  // Convert to array of stats objects
  return EMOJIS.map(emoji => ({
    value: emoji,
    firstCount: firstFoundCount[emoji],
    lastCount: lastFoundCount[emoji]
  }))
}

const seedStats = async () => {
  try {
    await connectMongoose()
    
    const rankings = await RankingModel.find().lean()
    if (!rankings.length) {
      console.error('❌ No rankings found. Please run the rankings seed first.')
      process.exit(1)
    }

    await StatsModel.deleteMany({})
    console.log('🧹 Cleared existing stats')

    const stats = calculateCardStats(rankings)
    await StatsModel.insertMany(stats)
    
    console.log('✨ Successfully seeded stats:')
    
    // Group stats by frequency
    const sortByCount = (a: any, b: any, type: 'firstCount' | 'lastCount') => b[type] - a[type]
    const sortedByFirst = [...stats].sort((a, b) => sortByCount(a, b, 'firstCount'))
    const sortedByLast = [...stats].sort((a, b) => sortByCount(a, b, 'lastCount'))
    
    console.log('\n📊 Most First Found:')
    sortedByFirst.slice(0, 3).forEach(stat => 
      console.log(`${stat.value}: ${stat.firstCount} times`)
    )
    
    console.log('\n📊 Least First Found:')
    sortedByFirst.slice(-3).reverse().forEach(stat => 
      console.log(`${stat.value}: ${stat.firstCount} times`)
    )
    
    console.log('\n📊 Most Last Found:')
    sortedByLast.slice(0, 3).forEach(stat => 
      console.log(`${stat.value}: ${stat.lastCount} times`)
    )
    
    console.log('\n📊 Least Last Found:')
    sortedByLast.slice(-3).reverse().forEach(stat => 
      console.log(`${stat.value}: ${stat.lastCount} times`)
    )
    
    console.log('\n📊 Totals:')
    console.log(`Total Cards: ${stats.length}`)
    console.log(`Total Games: ${rankings.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding stats:', error)
    process.exit(1)
  }
}

seedStats() 