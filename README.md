# eVTOL Fleet Management System

A professional full-stack web application for eVTOL (Electric Vertical Take-Off and Landing) fleet overview and battery asset management. Built with modern technologies including React, TypeScript, Tailwind CSS, Node.js, and Express.

![eVTOL Fleet Management](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Tailwind-blue)

## 🚀 Features

### Fleet Dashboard
- **Mission Control Overview**: Real-time fleet availability, active flights, and critical alerts
- **eVTOL Cards**: Interactive drone cards displaying State of Health (SoH), State of Charge (SoC), and status
- **Smart Filtering**: Filter drones by status (All, Active Flights, Critical Alerts)
- **Glassmorphism UI**: Modern glass-effect design with smooth animations

### Asset Workspace
Each drone has a detailed workspace with 6 tabs:

1. **Overview Tab**: System health, voltage, thermal state, and cycle count
2. **HPPC Intelligence**: Hybrid Pulse Power Characterization analysis
3. **Thermal Analysis**: Battery temperature monitoring and safety metrics
4. **Degradation & Life**: AI-driven State of Health analysis and RUL forecasting
5. **Digital Twin**: Real-time module-level battery visualization
6. **Maintenance Logs**: AI-driven actionable recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe server code
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Hot-reload for server
- **Concurrently** - Run multiple commands simultaneously

## 📁 Project Structure

```
evtol/
├── server/                  # Backend Express server
│   ├── index.ts            # Main server file
│   └── nodemon.json        # Nodemon configuration
├── src/                     # Frontend React application
│   ├── components/         # React components
│   │   ├── layout/        # Header and layout components
│   │   ├── dashboard/     # Fleet dashboard components
│   │   └── asset/         # Asset workspace and tabs
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and mock data
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/aka_avinash/Downloads/Code/qoder/evtol
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Frontend (Vite): [http://localhost:3000](http://localhost:3000)
- Backend (Express): [http://localhost:5000](http://localhost:5000)

#### Run Separately

**Frontend only**:
```bash
npm run client:dev
```

**Backend only**:
```bash
npm run server:dev
```

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run frontend and backend in development mode |
| `npm run client:dev` | Run frontend only (Vite dev server) |
| `npm run server:dev` | Run backend only (Nodemon with TypeScript) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern frosted glass effect with backdrop blur
- **Smooth Animations**: Fade-in effects and hover transitions
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Material Symbols**: Google Material icons for consistent iconography
- **Custom Color Palette**: 
  - Primary: `#1FA971` (Green)
  - Electric Blue: `#2BB0E6`
  - Warning: `#F4B740`
  - Critical: `#E24A4A`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Tailwind Configuration

Custom theme extensions are defined in [`tailwind.config.js`](tailwind.config.js):
- Custom colors for the eVTOL theme
- Glass effect shadows
- Custom font family (Montserrat)
- Backdrop blur utilities

### TypeScript Configuration

The project uses strict TypeScript configurations:
- **Frontend**: [`tsconfig.json`](tsconfig.json)
- **Backend**: [`tsconfig.node.json`](tsconfig.node.json)

## 🌐 API Endpoints

### Backend REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check endpoint |
| `/api/fleet` | GET | Get fleet KPI data |
| `/api/drones` | GET | Get all drones |
| `/api/drones/:id` | GET | Get specific drone details |

Example response for `/api/fleet`:
```json
{
  "fleetAvailability": 90,
  "activeFlights": 4,
  "charging": 5,
  "criticalAlerts": 1
}
```

## 🎯 Key Components

### Frontend Components

- **`<Header />`**: Top navigation bar with logo and user profile
- **`<FleetDashboard />`**: Main dashboard with KPIs and drone cards
- **`<DroneCard />`**: Individual drone status card
- **`<AssetWorkspace />`**: Detailed drone view with tabs
- **Tab Components**: OverviewTab, HPPCTab, ThermalTab, etc.

### Routing

```tsx
/ → FleetDashboard
/asset/:assetId → AssetWorkspace
```

## 🔒 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## 📦 Dependencies

### Main Dependencies
- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `express` - Backend framework
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Dev Dependencies
- `typescript` - Type checking
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `eslint` - Linting
- `prettier` - Code formatting
- `nodemon` - Development server
- `concurrently` - Run multiple commands

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

### Backend Deployment (Heroku/Railway/Render)

1. Ensure your backend is configured for production
2. Set environment variables on your hosting platform
3. Deploy the server code

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author
Madara


## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Module Not Found

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Ensure all dependencies are installed:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

---

**🎉 Happy Coding! Build amazing eVTOL fleet management systems!**
