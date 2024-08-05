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
- yarn (>= 1.x)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/NachoKai/levanta.me.git
   cd levanta.me
   ```

2. Install the dependencies:

   ```
   yarn install
   ```

### Running the App

1. Start the development server:

   ```
   yarn run dev
   ```

2. Open your browser and navigate to `http://localhost:5173/`.

### Usage

1. **Configuration**: Set the work, rest, and idle time limits. Set telegram Bot Token and Chat ID.
2. **Start Working**: Click the "Work" button to begin the work timer.
3. **Start Resting**: Click the "Resting" button to begin the rest timer.
4. **Reset**: Click the reset button to reset all timers.
5. **Notifications**: Alerts will appear when the configured work, rest, or idle times are exceeded.

### Contribution

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License.
