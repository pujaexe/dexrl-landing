# Dexrl Landing Page

Dexrl — Global crypto settlement, made simple. Built with **Next.js**, **Styled Components**, and **Tailwind CSS**.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: 
  - Tailwind CSS for utility-first CSS
  - Styled Components for dynamic/complex styling
- **Language**: TypeScript
- **Linting**: ESLint

## 📁 Project Structure

```
dexrl-landing/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section
│   ├── Features.tsx         # Features showcase
│   ├── CTA.tsx              # Call-to-action section
│   └── Footer.tsx           # Footer
├── lib/                     # Utilities and helpers
│   └── registry.tsx         # Styled Components SSR registry
├── public/                  # Static assets
├── styles/                  # CSS modules (if needed)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

## 🎨 Components

### Header
Sticky navigation header with logo and links.

### Hero
Full-height hero section with gradient background and CTA button.

### Features
Grid layout showcasing 6 key features with icons and descriptions.

### CTA (Call-to-Action)
Section encouraging users to sign up or schedule a demo.

### Footer
Multi-column footer with links and social media.

## 🛠 Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

4. **Run linting**:
   ```bash
   npm run lint
   ```

## 🎯 Key Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Styled Components for dynamic styling
- ✅ Tailwind CSS for utility classes
- ✅ Server-side rendering with Next.js
- ✅ Type-safe TypeScript components
- ✅ Smooth animations and transitions
- ✅ Modern gradient backgrounds
- ✅ Accessible semantic HTML

## 🔧 Configuration

### Tailwind CSS
Customized colors and fonts in `tailwind.config.ts`:
- Primary: `#0c1822` (dark blue)
- Secondary: `#3a7589` (teal)
- Accent: `#cfe2e8` (light blue)

### Styled Components
Configured in `next.config.ts` for proper SSR support.

## 📝 Customization

### Changing Colors
Update the color values in:
- `tailwind.config.ts` (for Tailwind utilities)
- Individual component files (for Styled Components)

### Modifying Content
Edit component files in `/components` to customize:
- Text content
- Images and icons
- Button labels
- Links

### Adding New Sections
1. Create a new component file in `/components`
2. Use Styled Components for styling
3. Import and add to `app/page.tsx`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t dexrl-landing .
docker run -p 3000:3000 dexrl-landing
```

### Other Platforms
Works with any Node.js hosting platform (AWS, Heroku, DigitalOcean, etc.)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Styled Components](https://styled-components.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📄 License

Private project for Dexrl.

---

**Built with ❤️ using Next.js**
