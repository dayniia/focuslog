# FocusLog

FocusLog is a frictionless, private learning tracker designed to help you stay consistent with your skill-building journey. Built with a focus on simplicity and calm, it allows you to log progress, track milestones, and visualize your learning streaks without the noise of traditional productivity apps.

##  Features

- **🎯 Skill Tracking**: Organize your learning into categories (DSA, Web, CS, etc.) and track progress with dynamic progress bars.
- **📅 Activity Log**: A chronological timeline of your daily learning efforts.
- **📈 Consistency Dashboard**: Visualize your progress with interactive charts and keep track of your daily streaks.
- **☁️ Local-First**: Your data is yours. Everything is stored locally in your browser (LocalStorage) for privacy and offline access.
- **🎨 Premium UI**: A clean, calm, and lofi-inspired design featuring smooth transitions and a premium aesthetic.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Modular & Performant)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router](https://reactrouter.com/)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dayniia/focuslog.git
   ```

2. Navigate to the project directory:
   ```bash
   cd focuslog
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/      # Shared UI components (Card, Button, ProgressBar)
├── features/        # Main application features
│   ├── activity-log/ # Timeline of learning events
│   ├── dashboard/    # Main overview & streak tracking
│   └── learning-list/# skill management & progress updates
├── store/           # Zustand state management
├── types.ts         # Global TypeScript definitions
└── index.css        # Global styles & design system
```

## 🔒 Privacy

FocusLog values your privacy. No data is sent to any server. Your learning journey is stored entirely within your browser's local storage.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for lifelong learners.
