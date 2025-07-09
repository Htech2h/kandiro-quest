# 🎮 Kandiro Quest

**A beautiful, interactive web-based Mancala game with stunning animations and sound effects!**

![Kandiro Quest Game](https://img.shields.io/badge/Game-Kandiro%20Quest-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## 🌟 Features

- **🎯 Classic Mancala Gameplay** - Traditional Kandiro rules with exact 2-3 seed capture mechanics
- **🤖 Smart AI Opponent** - Challenge yourself against an intelligent bot
- **🎨 Beautiful Animations** - Smooth seed movement and capture celebrations
- **🔊 Dynamic Sound Effects** - Audio feedback for moves, drops, and captures
- **📱 Mobile-Friendly** - Responsive design that works on all devices
- **⚡ Real-time Gameplay** - Instant feedback and smooth interactions
- **🎮 Multiple Seed Options** - Play with 4, 5, or 6 seeds per pit

## 🚀 Play Now

**[🎮 Play Kandiro Quest Online →](https://htech2h.github.io/kandiro-quest/)**

## 📖 How to Play

### 🎯 Objective
Collect the most seeds in your **Kandiro** (large scoring pit) to win!

### 🎲 Game Setup
```
Player B (Bot):  ← [4][4][4][4][4][4] ←
                [B]                [A]  
Player A (You): → [4][4][4][4][4][4] →
```

### 🎮 Basic Rules

1. **🟢 Your Turn**: Click any of your pits (bottom row) that contains seeds
2. **🔄 Sowing**: Seeds are distributed counterclockwise, one per pit
3. **🏆 Scoring**: Seeds that land in your Kandiro stay there
4. **🎯 Capturing**: Capture opponent's seeds when your last seed lands in their pit with exactly **2 or 3 seeds**

### 🎯 Capture Rules

**When can you capture?**
- ✅ Your last seed lands on the **opponent's side**
- ✅ That pit has exactly **2 or 3 seeds** (including your seed)
- ✅ **Chain captures**: Continue capturing consecutive pits with 2-3 seeds

**Capture Direction:**
- **You (Player A)**: Capture from right → left
- **Bot (Player B)**: Capture from left → right

### 🏁 Winning

The game ends when one player has no seeds left in their pits. Remaining seeds go to their owner's Kandiro. **Highest score wins!**

## 🎮 Game Controls

| Action | Control |
|--------|---------|
| **Make Move** | Click your pit |
| **New Game** | Click "New Game" button |
| **Change Seeds** | Select 4-6 seeds dropdown |
| **Audio** | Auto-enabled on first click |

## 🎨 Visual Guide

### 🎯 Game Board Layout
```
                    Player B (Bot)
    ← [B0][B1][B2][B3][B4][B5] ←
  [B]                         [A]
Kandiro B                 Kandiro A
    → [A0][A1][A2][A3][A4][A5] →
                    Player A (You)
```

### 🎨 Visual Elements

- **🔴 Red highlights**: Your turn and captures
- **🔵 Blue highlights**: Bot's turn and captures  
- **🟡 Yellow center**: Current player indicator
- **🟢 Green**: Victory celebration
- **🔺 Arrows**: Movement direction indicators

### 🎵 Sound Effects

- **🎵 Movement**: Subtle tone when picking up seeds
- **💧 Drop**: Quick sound for each seed placed
- **🎉 Capture**: Celebration sound for successful captures

## 💻 Technical Features

- **Pure JavaScript** - No external dependencies except Tailwind CSS
- **Responsive Design** - Adapts to mobile, tablet, and desktop
- **Web Audio API** - Dynamic sound generation
- **CSS Animations** - Smooth transitions and effects
- **Modern Browser Support** - Works in all modern browsers

## 🔧 Development

### Local Setup
```bash
git clone https://github.com/htech2h/kandiro-quest.git
cd kandiro-quest
```

Open `index.html` in your browser to play!

### File Structure
```
kandiro-quest/
├── index.html          # Main game page
├── kandiro-ui.js       # Game logic and UI
├── kandiro.js          # Original core algorithm
└── README.md           # This file
```

## 🎯 Strategy Tips

1. **🎯 Plan Ahead**: Count seeds to land in your Kandiro
2. **🔄 Chain Moves**: Look for moves that give you another turn
3. **🛡️ Defend**: Don't leave pits with 1-2 seeds vulnerable
4. **⚡ Capture Setup**: Create opportunities for 2-3 seed captures
5. **🏁 Endgame**: Control the pace when you're ahead

## 🚀 Future Features

- **👥 Multiplayer Mode** - Play against friends online
- **🧠 Advanced AI** - Multiple difficulty levels
- **🏆 Leaderboard** - Track your best scores
- **🎨 Themes** - Customizable visual styles
- **📊 Statistics** - Game analytics and progress tracking

## 🤝 Contributing

Found a bug or have a feature idea? We'd love your input!

1. **🐛 Report Issues**: Open an issue on GitHub
2. **💡 Suggest Features**: Share your ideas in discussions
3. **🔧 Submit PRs**: Help improve the game

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- **Original Algorithm**: Built upon classic Mancala/Kandiro rules
- **Enhanced UI**: Collaborative development with AI assistance
- **Visual Design**: Modern web standards and responsive design

---

**🎮 Ready to play? [Start your Kandiro Quest now!](https://htech2h.github.io/kandiro-quest/)**

*Made with ❤️ for board game enthusiasts everywhere*
