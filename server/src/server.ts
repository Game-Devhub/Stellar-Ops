import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { GameState } from './game-logic/GameState';
import { PlayerInputPayload } from './types/game';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const gameState = new GameState();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Stellar Ops Server is running' });
});

// AI Coach Mock Endpoint
app.post('/api/ai-coach/analyze', (req: Request, res: Response) => {
  const { matchData } = req.body;
  if (!matchData) {
    return res.status(400).json({ error: 'Match data is required' });
  }

  const simulatedFeedback = {
    accuracy: 45,
    positioningScore: 72,
    feedback: "Your accuracy with assault rifles has dropped by 5% compared to your weekly average. Focus on burst firing at medium range. Your tactical positioning in Sector B was excellent.",
    improvementRegimen: "Spend 10 minutes in the firing range aiming at strafing targets before your next Ranked Arena match."
  };

  res.json({ analysis: simulatedFeedback });
});

// Tournament Payout Webhook (Mock)
app.post('/api/tournaments/payout', (req: Request, res: Response) => {
  const { winnerAddress, amount } = req.body;
  console.log(`Instructing Soroban contract to pay ${amount} to ${winnerAddress}`);
  res.json({ status: 'success', message: 'Payout transaction submitted to Stellar network' });
});

// Socket.io Game Loop
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  gameState.addPlayer(socket.id);

  socket.on('playerInput', (input: PlayerInputPayload) => {
    gameState.handlePlayerInput(socket.id, input);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    gameState.removePlayer(socket.id);
  });
});

// Tick game state at 60fps
setInterval(() => {
  io.emit('gameStateUpdate', gameState.getState());
}, 1000 / 60);

server.listen(PORT, () => {
  console.log(`🚀 Stellar Ops Server running on http://localhost:${PORT}`);
});
