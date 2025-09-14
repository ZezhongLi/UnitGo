# UnitGo - Universal Unit Converter

A modern, comprehensive unit conversion application built with Next.js, React, and TypeScript. UnitGo provides quick, reliable, and offline conversions between everyday and technical units with a beautiful, intuitive interface.

![UnitGo](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔧 Core Functionality
- **15+ Unit Categories**: Length, weight, temperature, volume, area, speed, time, data size, energy, power, pressure, force, density, angle, and fuel economy
- **Real-time Conversion**: Instant conversions as you type
- **Batch Converter**: Convert one value to multiple units simultaneously
- **Height Converter**: Special converter for feet + inches to centimeters
- **Precision Control**: Adjustable decimal precision (1-15 digits)
- **Data Size Modes**: Support for both SI (1000-based) and binary (1024-based) calculations

### 🎯 User Experience
- **Recent Conversions**: Track and revisit your conversion history
- **Quick Access Panel**: Fast shortcuts to common conversions
- **Unit Search**: Find units quickly with intelligent search
- **Conversion Shortcuts**: Pre-configured common conversion pairs
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🎨 Interface
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark/Light Mode**: Automatic theme switching support
- **Intuitive Categories**: Organized into "Everyday" and "Technical" units
- **Visual Feedback**: Clear conversion displays and status indicators
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) or npm or yarn package manager

To check if you have Node.js installed:
```bash
node --version
```

To install pnpm globally:
```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UnitGo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   Or with npm:
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   
   Or with npm:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Build for Production

To create an optimized production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

### Development Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
UnitGo/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── batch-converter.tsx
│   ├── category-selector.tsx
│   ├── conversion-shortcuts.tsx
│   ├── height-converter.tsx
│   ├── quick-access.tsx
│   ├── recents-panel.tsx
│   ├── settings-panel.tsx
│   ├── theme-provider.tsx
│   ├── unit-converter.tsx
│   └── unit-search.tsx
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                   # Utility libraries
│   ├── conversion-engine.ts  # Core conversion logic
│   ├── storage.ts           # Local storage management
│   └── utils.ts            # Utility functions
├── public/               # Static assets
├── styles/              # Additional stylesheets
└── Configuration files...
```

## 🔧 Key Technologies

### Frontend Framework
- **Next.js 14.2.16** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **TypeScript 5** - Static type checking

### Styling & UI
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library

### State Management & Storage
- **React Hooks** - Built-in state management
- **Local Storage** - Persistent user preferences and history

### Development Tools
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixing

## 💡 Usage Guide

### Basic Conversion
1. Select a category from the "Everyday Units" or "Technical Units" sections
2. Enter a value in the "From" field
3. Choose your source unit from the dropdown
4. Select your target unit in the "To" dropdown
5. The result appears instantly!

### Advanced Features
- **Swap Units**: Click the swap button (↕️) to reverse the conversion
- **Batch Conversion**: Use the batch converter to see one value in multiple units
- **Height Conversion**: Special tool for converting feet + inches to centimeters
- **Settings**: Adjust precision and data size calculation mode

### Keyboard Shortcuts
- **Tab**: Navigate between form fields
- **Enter**: Confirm selections in dropdowns
- **Escape**: Close open dropdowns

## 🛠️ Customization

### Adding New Units
To add new units, modify the `conversion-engine.ts` file:

1. Add your unit definition in the appropriate category initialization method
2. Provide conversion functions to/from the base unit
3. The unit will automatically appear in the UI

### Styling Customization
- Modify `app/globals.css` to change color themes
- Update Tailwind configuration for design system changes
- Customize component styles in individual component files

## 🔍 Troubleshooting

### Common Issues

**Development server won't start**
- Ensure Node.js version 18+ is installed
- Delete `node_modules` and `package-lock.json`, then reinstall dependencies
- Check if port 3000 is already in use

**Build fails**
- Run `pnpm lint` to check for code issues
- Ensure all TypeScript errors are resolved
- Clear Next.js cache: `rm -rf .next`

**Styling issues**
- Verify Tailwind CSS is properly configured
- Check that all CSS imports are correct
- Ensure PostCSS configuration is valid

### Getting Help
- Check the browser console for error messages
- Verify all dependencies are correctly installed
- Ensure you're using a supported Node.js version

## 📈 Performance Features

- **Client-side Rendering**: Fast, responsive user interface
- **Optimized Bundle**: Code splitting and tree shaking
- **Local Storage**: Offline capability for user preferences
- **Efficient Algorithms**: Optimized conversion calculations
- **Image Optimization**: Next.js automatic image optimization

## 🔮 Future Enhancements

- Currency conversion with live exchange rates
- Unit conversion API for developers
- Mobile app versions
- More specialized unit categories
- Import/export conversion history
- Collaborative conversion sharing

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Built with ❤️ using modern web technologies**

For questions or support, please contact the development team.
