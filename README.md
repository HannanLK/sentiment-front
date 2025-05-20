# Sentiment Analysis Frontend

A modern React-based frontend for text and social media sentiment analysis, built with Vite and styled using Tailwind CSS.

## Features

- Text Sentiment Analysis
  - Real-time sentiment scoring
  - Emotion detection visualization
  - Key phrase extraction
  - Text style enhancement
- Social Media Analysis
  - Platform-specific sentiment tracking
  - Engagement analytics
  - Trend visualization
  - Cross-platform comparison
- Modern UI/UX
  - Dark/Light mode support
  - Responsive design
  - Interactive visualizations
  - Real-time feedback

## Prerequisites

- Node.js 16+
- npm or yarn
- Modern web browser

## Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd sentiment-front
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

1. Create a production build:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
sentiment-front/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   └── charts/        # Visualization components
│   ├── pages/             # Page components
│   ├── lib/               # Utility functions
│   ├── assets/            # Static assets
│   └── App.jsx           # Main application component
├── public/                # Public assets
├── index.html            # Entry HTML file
└── package.json          # Project dependencies
```

## Key Components

### Text Analysis
- Text input with real-time validation
- Sentiment score visualization
- Emotion distribution charts
- Key phrase extraction
- Text style enhancement options

### Social Media Analysis
- Platform selection
- Trend visualization
- Engagement metrics
- Cross-platform comparison

## Styling

The project uses:
- Tailwind CSS for utility-first styling
- Shadcn/ui for component library
- Custom theme support with dark/light mode

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Write meaningful component documentation

### Performance
- Implement lazy loading for routes
- Optimize bundle size
- Use proper caching strategies
- Implement proper error boundaries

## Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
