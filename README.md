# Radio Reka Amharic - Next.js 15

A Next.js 15 application for Israeli Radio Reka Amharic station streaming and show archives.

## Features

- Live radio streaming
- Show archives with date selection
- Hebrew/Amharic interface
- Responsive design
- Google Analytics integration

## Getting Started

### Prerequisites

Make sure you have Node.js 18+ installed on your system.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

Start the production server:

```bash
npm start
```

## Project Structure

```
/app
  layout.tsx          # Root layout with metadata and Google Analytics
  page.tsx           # Main page component
  globals.css        # Global styles
/public              # Static files
  favicon.ico
  /img               # Icons and images
```

## Technologies Used

- Next.js 15
- React 18
- TypeScript
- CSS3

## Radio Features

- **Live Stream**: Direct connection to KAN_REKA.mp3 stream
- **Show Archives**: Integration with Omny.fm for show playback
- **Time-based Navigation**: Automatic selection of current show time
- **Date Selection**: Browse shows by date
- **Hebrew Interface**: Right-to-left layout support

## Shows Schedule

- **בוקר (Morning)**: 6:15 - 14:00
- **צהריים (Noon)**: 14:00 - 20:00  
- **ערב (Evening)**: 20:00 - 23:59oject setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
