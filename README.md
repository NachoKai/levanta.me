# Levanta.me

## Overview

Levanta.me is a React-based application that uses the `@vladmandic/face-api` library to detect faces through a webcam feed. It tracks the user's work, rest, and idle times and notifies the user when specific thresholds are exceeded.

## Features

- **Face Detection**: Uses `face-api.js` to detect faces in real-time from the webcam.
- **Timer Management**: Tracks work, rest, and idle times based on face detection.
- **Notifications**: Alerts the user when the work or rest time exceeds the configured limits or when the face is not detected for a certain period (idle time).

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Styled-Components**: CSS-in-JS library for styling React components.
- **face-api.js**: JavaScript API for face detection and recognition.
- **Navigator MediaDevices API**: Provides access to media input devices like the camera.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/NachoKai/levanta.me.git
   cd levanta.me
   ```

2. Install the dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

### Running the App

1. Start the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn run dev
   ```

2. Open your browser and navigate to `http://localhost:5173/`.

### Build for Production

To create a production build:

```
npm run build
```

or

```
yarn build
```

### Project Structure

- `src/components`: Contains React components.
- `src/hooks`: Custom hooks for reusable logic.
- `src/consts`: Constants used in the application.
- `src/utils`: Utility functions.

### Usage

1. **Start Working**: Click the "Start Working" button to begin the work timer.
2. **Start Resting**: Click the "Start Resting" button to begin the rest timer.
3. **Reset All**: Click the "Reset All" button to reset all timers.
4. **Notifications**: Alerts will appear when the configured work, rest, or idle times are exceeded.

### Configuration

The notification times are configured in the .env file

```
VITE_BOT_TOKEN=
VITE_CHAT_ID=
VITE_MIN_CONFIDENCE=
```

### Contribution

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License.
