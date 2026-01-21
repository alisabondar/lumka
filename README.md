# Lumka - Evolve Your Fox

A strategic card game where you evolve your fox through 6 rounds of challenges, building traits and managing stability to become an immortal fox.

## 🎮 About the Game

**Lumka** is a minigame all about growth and evolution. Your goal is to guide your fox through increasingly difficult challenges by strategically selecting and applying trait cards. Each round presents unique challenges that test your fox's evolution, requiring you to balance different trait categories, maintain stability, and accumulate score points.

### How to Play

1. **Start**: Enter your name and begin with a hand of 6 cards from a 52-card deck
2. **Build Your Fox**:
   - **Double-click** cards to apply them as traits to your fox
   - **Click** cards to select them for discarding
   - **Draw** new cards from the deck (costs stability)
   - **Discard** selected cards to refill your hand (costs stability)
3. **Face Challenges**: Each round presents 3 random challenges from a pool of 10. Select one to attempt
4. **Win Rounds**: Meet the challenge requirements (trait counts, score thresholds, stability levels, etc.) to advance
5. **Survive**: Manage your stability carefully - it decreases with each action
6. **Win**: Complete all 6 rounds to achieve immortality!

### Game Mechanics

- **Trait Categories**:
  - 🩶 **FLOURISH** (Positive): +2 score, +1 stability
  - ⚙️ **ADAPT** (Neutral): +1 score
  - ⛓️ **BURDEN** (Negative): +1 score, -2 stability
  - ✨ **CATALYST** (Wild): Special effects

- **Stability System**: Starts at 10, decreases by 0.5 per action (drawing/discarding)
- **Challenge System**: 100 unique challenges across 10 difficulty tiers (Novice → Mythic)
- **Progressive Difficulty**: Challenges become harder as you advance through rounds

## 🛠️ Technical Features

### Core Technologies
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Material-UI (MUI)** for UI components
- **Supabase** for scoreboard persistence

### Architecture & Code Quality
- **Type-Safe**: Full TypeScript implementation
- **Modular Design**: Separated game logic, UI components, and utilities
- **State Management**: Immutable game state with functional updates
- **CSS Modules**: Scoped styling with CSS custom properties
- **Accessibility**: ARIA labels, keyboard navigation, focus management, and color contrast compliance

### UI/UX Features
- **Animated Backgrounds**: Gradient animations and seasonal overlays
- **Lottie Animations**: Interactive animations using DotLottie
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Walkthrough System**: Interactive tutorial for new players
- **Challenge Modal**: Detailed challenge information and selection
- **Scoreboard**: Persistent leaderboard with player rankings
- **Responsive Design**: *(Planned - see roadmap)*

### Game Logic
- **52-Card Deck**: Procedurally generated with 4 trait categories
- **100 Unique Challenges**: Algorithmically generated with progressive difficulty
- **10 Difficulty Tiers**: From Novice to Mythic
- **6 Rounds**: Each with 10 challenges to choose from
- **Challenge Patterns**: 20 different challenge types (trait counts, score thresholds, category diversity, etc.)

### Data Persistence
- **Supabase Integration**: Scoreboard saves player name, level reached, difficulty, and timestamp
- **Ranking System**: Calculates player rank based on level achieved

## 🚀 Features Yet to Come

### High Priority
- **Responsive Design**: Mobile, tablet, and desktop layouts with adaptive UI
- **Versus Mode**: Multiplayer competitive gameplay
- **Touch Gestures**: Swipe to discard, pinch to zoom cards
- **Offline Mode**: Local storage fallback for scoreboard

### Gameplay Enhancements
- **Card Animations**: Smooth transitions when applying/discarding cards
- **Sound Effects**: Audio feedback for actions and round completion
- **Achievement System**: Unlock achievements for milestones
- **Card Collection**: View all cards and their effects
- **Statistics Dashboard**: Track your evolution history and stats

### Technical Improvements
- **Performance Optimization**: Code splitting, lazy loading, and bundle optimization
- **PWA Support**: Install as a progressive web app
- **Analytics**: Game analytics for balancing and improvements
- **Internationalization**: Multi-language support
- **Unit Tests**: Comprehensive test coverage for game logic
- **E2E Tests**: Playwright/Cypress tests for critical paths

### Content Expansion
- **More Trait Cards**: Expand the deck with new trait combinations
- **Seasonal Events**: Special challenges and rewards during holidays
- **Story Mode**: Narrative-driven gameplay with branching paths
- **Custom Challenges**: Player-created challenge sharing

## 🎯 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is private and proprietary.

---

**Evolve. Adapt. Flourish. Become immortal.** 🦊✨
