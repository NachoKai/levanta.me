# Levanta.me - Productivity Tracker

A modern productivity timer with automatic face detection, Telegram notifications, and browser notifications. Track your work and rest time effortlessly.

## Features

- **Automatic Face Detection**: Timer starts when you're at your desk and pauses when you leave
- **Work/Rest Modes**: Switch between work and rest modes with customizable durations
- **Smart Notifications**:
  - Browser notifications for timer events
  - Telegram bot integration for remote notifications
  - Work reminders at custom intervals
  - Water break reminders
- **Accurate Timer Tracking**: Precise second-by-second tracking of work and rest time
- **Persistent Storage**: Your settings and timer data are saved locally
- **Modern UI**: Clean, minimalist design with dark mode support
- **Real-time Status**: See your current status at a glance

## Quick Start

1. **Clone and install**:
   ```bash
   npm install
   ```

2. **Download face detection models** (if using camera feature):
   ```bash
   node scripts/download-models.mjs
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: Navigate to `http://localhost:3000`

## Setup

### Face Detection (Optional)

If you want to use the camera-based face detection feature:

```bash
node scripts/download-models.mjs
```

Or manually download from: https://github.com/vladmandic/face-api/tree/master/model

### Telegram Notifications (Optional)

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID from `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Enter both in the app settings

## Usage

### Basic Controls

- **Work**: Start tracking work time
- **Rest**: Start tracking rest time
- **Pause/Resume**: Pause or resume the current timer
- **Reset**: Reset all timers to zero

### Settings

- **Work/Rest Duration**: Get notified when work/rest time is complete - you manually switch when ready (0 = disabled)
- **Timer Reminder**: Get periodic reminders during work sessions (0 = disabled)
- **Water Reminder**: Stay hydrated with periodic reminders (0 = disabled)
- **Use Camera**: Enable automatic face detection tracking

### How It Works

1. **Manual Mode** (Camera OFF): Click Work/Rest to start tracking
2. **Automatic Mode** (Camera ON): Timer starts when your face is detected and pauses when you leave

### Keyboard Shortcuts

- `W` - Switch to Work mode
- `R` - Switch to Rest mode
- `P` or `Space` - Pause/Resume timer
- `Shift + R` - Reset all timers

## Technology Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **face-api.js** - Face detection
- **shadcn/ui** - UI components

## Browser Permissions

The app may request:
- **Camera**: For face detection (only if enabled)
- **Notifications**: For browser notifications

## Deployment

Deploy to Vercel with one click:

```bash
npm run build
```

Or use the Vercel CLI:

```bash
vercel
```

## Privacy

- All data is stored locally in your browser
- Camera feed is processed locally and never uploaded
- Telegram notifications only sent if you configure them

## Troubleshooting

### Face detection not working
- Make sure you've downloaded the models: `node scripts/download-models.mjs`
- Check browser console for errors
- Ensure camera permissions are granted

### Notifications not showing
- Check browser notification permissions
- For Telegram: Verify bot token and chat ID are correct

### Timer not counting
- Check browser console for errors
- Make sure JavaScript is enabled
- Try refreshing the page

## License

MIT
