# Chocolatin Metrics Frontend

A modern React-based web application for visualizing and managing industrial process variables and metrics. This frontend provides an intuitive interface for monitoring, analyzing, and exploring data from various modules and time periods.

## 🚀 Features

- **Multi-view Data Display**: View variables in different formats and organizations
- **Tabbed Interface**: Organized navigation between different data views
- **Real-time Data Fetching**: Powered by React Query for efficient data management
- **Responsive Design**: Built with Tailwind CSS for modern, responsive UI
- **Chart Visualization**: Interactive charts for data analysis
- **Module-based Filtering**: Filter variables by specific modules
- **Date Range Filtering**: Query variables within specific time periods
- **Modern UI Components**: Built with Radix UI primitives and custom components

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chocolatin-metrics-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🏗️ Project Structure

```
src/
├── components/
│   ├── main/                    # Main application components
│   │   ├── variables-table.jsx      # All variables table view
│   │   ├── variables-charts.jsx     # Chart visualization
│   │   ├── module-variables-table.jsx # Module-filtered variables
│   │   └── date-variables-table.jsx  # Date-filtered variables
│   └── ui/                      # Reusable UI components
│       ├── button.jsx
│       ├── card.jsx
│       ├── chart.jsx
│       ├── table.jsx
│       └── tabs.jsx
├── hooks/
│   └── variables-hook.jsx       # Custom hooks for data fetching
├── lib/
│   └── utils.js                 # Utility functions
├── App.jsx                      # Main application component
└── main.jsx                     # Application entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📊 Data Views

### All Variables
Displays a comprehensive table of all available variables with their properties:
- Address
- Comment
- Data Type
- Module
- Symbol
- Timestamp

### Charts
Interactive chart visualizations for data analysis and trends.

### Variables by Module
Filter and view variables organized by specific modules.

### Variables by Date
Query and display variables within specified date ranges.

## 🔧 API Integration

The application connects to a backend API running on `http://localhost:8000` with the following endpoints:

- `GET /variables` - Fetch all variables
- `GET /variables/module/{module}` - Fetch variables by module
- `GET /variables/date-range?start_date={date}&end_date={date}` - Fetch variables by date range

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Linting**: ESLint

## 🎨 UI Components

The application uses a custom UI component library built on top of Radix UI primitives:

- **Button**: Customizable button component with variants
- **Card**: Container component for content organization
- **Table**: Data table with sorting and styling
- **Tabs**: Tabbed interface for navigation
- **Chart**: Chart components for data visualization

## 🔄 Data Management

The application uses React Query for efficient data management:

- **Caching**: Data is cached to minimize API calls
- **Background Updates**: Automatic data refresh
- **Error Handling**: Graceful error states
- **Loading States**: Loading indicators for better UX

## 🚀 Deployment

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.