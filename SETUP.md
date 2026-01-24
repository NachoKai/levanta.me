# Levanta.me Setup Guide

## Face Detection Models Setup

To enable face detection, you need to download the face-api.js models:

### Option 1: Automatic Download (Recommended)

Run this command in your terminal:

```bash
npx degit vladmandic/face-api/model public/models
```

### Option 2: Manual Download

1. Download the models from: https://github.com/vladmandic/face-api/tree/master/model
2. Place them in the `public/models` directory
3. You need these specific model files:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1` and `shard2`

## Telegram Notifications Setup

1. Create a bot with [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Get your chat ID:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for the `chat.id` value in the response
5. Enter both values in the app settings

## Browser Notifications

The app will request notification permissions when you first use it. Make sure to allow notifications in your browser settings.

## Usage Tips

- **Work/Rest Duration**: Set these to automatically switch modes (0 = disabled)
- **Timer Reminder**: Get periodic reminders during work sessions (0 = disabled)
- **Water Reminder**: Stay hydrated with periodic water reminders (0 = disabled)
- **Camera Detection**: When enabled, the timer starts when your face is detected and pauses when you leave

## Keyboard Shortcuts

- `W` - Switch to Work mode
- `R` - Switch to Rest mode
- `P` or `Space` - Pause timer
- `Shift + R` - Reset all timers

Note: Keyboard shortcuts won't work when typing in input fields.
