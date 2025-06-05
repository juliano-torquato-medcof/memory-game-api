# Memory Game Backend

A high-performance backend service for the Memory Game application, built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

- **Player Rankings**: Track and compare player performances
- **Game Statistics**: Detailed analytics about card findings and game patterns
- **Time-based Analytics**: Daily and weekly statistical breakdowns
- **RESTful API**: Well-documented endpoints with OpenAPI/Swagger
- **Rate Limiting**: Protect the API from abuse
- **Input Validation**: Strict schema validation using Zod
- **Error Handling**: Standardized error responses
- **CORS Support**: Configurable cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Docker (optional, for containerization)
- One of the following package managers:
  - npm (comes with Node.js)
  - yarn
  - pnpm
  - bun

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/memory-game-backend.git
   cd memory-game-backend
   ```

2. Install dependencies using your preferred package manager:
   ```bash
   # Using npm (default)
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install

   # Using bun
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   API_URL=http://localhost
   MONGO_URL=mongodb://localhost:27017/memory-game
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun run dev
```

### Production Mode
```bash
# Using npm
npm run build
npm start

# Using yarn
yarn build
yarn start

# Using pnpm
pnpm run build
pnpm start

# Using bun
bun run build
bun start
```

### Using Docker
```bash
# Start the application and MongoDB
docker compose up -d
```

This will:
1. Start MongoDB on port 27017
2. Run the database seeder to populate initial data:
   - Create 30 random players with rankings
   - Generate statistics about card findings
3. Start the API server on port 3000

The Docker setup automatically:
- Detects your preferred package manager based on lock files
- Uses the appropriate package manager for installation and running commands
- Seeds the database during initial setup
- Ensures services start in the correct order with health checks

## 📊 Seeding Data

The project includes scripts to populate the database with sample data:

### Available Scripts
```bash
# Using npm
npm run seed            # Run both seeds in sequence
npm run seed:stats      # Seed statistics based on rankings
npm run seed:rankings   # Seed only rankings data (30 random players)

# Using yarn
yarn seed
yarn seed:stats
yarn seed:rankings

# Using pnpm
pnpm run seed
pnpm run seed:stats
pnpm run seed:rankings

# Using bun
bun run seed
bun run seed:stats
bun run seed:rankings
```

### Sample Data Generated
- **Rankings**: 30 random players with:
  - Unique player names (e.g., SpeedMaster, MemoryNinja)
  - Completion times between 40-180 seconds
  - Random emoji cards (🍕, 🍔, 🍣, 🍩, 🍦, 🍇) for first/last found

- **Statistics**:
  - Most/least commonly found first cards
  - Most/least commonly found last cards
  - Total games played
  - Card frequency analysis

## 📚 API Documentation

Once the server is running, access the API documentation at:
```
http://localhost:3000/api-docs
```

### Main Endpoints

#### Rankings
- `GET /rankings`: Get paginated list of player rankings
- `POST /rankings`: Submit new player ranking

#### Statistics
- `GET /stats`: Get comprehensive game statistics
- `GET /stats/cards/first`: Most commonly found first cards
- `GET /stats/cards/first/least`: Least commonly found first cards
- `GET /stats/cards/last`: Most commonly found last cards
- `GET /stats/cards/last/least`: Least commonly found last cards
- `GET /stats/time/daily`: Daily statistics
- `GET /stats/time/weekly`: Weekly statistics

## 🧪 Testing

Run the test suite:
```bash
bun test
```

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP
- Returns 429 Too Many Requests when exceeded

## 🛡️ CORS Configuration

CORS is configured to allow:
- Origins: Configurable via CORS_ORIGIN env var
- Methods: GET, POST
- Headers: Content-Type, Authorization

## 🏗️ Project Structure

```
src/
├── adapters/        # Interface adapters
├── config/          # Configuration files
├── constants/       # Shared constants and game config
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Data models
├── routes/          # Route definitions
├── scripts/         # Utility scripts (seeding, etc.)
├── services/        # Business logic
├── swagger/         # API documentation
├── views/           # Response transformers
└── index.ts         # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the robust database
- All contributors who have helped shape this project
