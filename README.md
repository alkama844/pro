# NAFIJPRO - Futuristic Portfolio Website 👑

A modern, futuristic portfolio website built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Futuristic Design**: Cutting-edge UI with animations and effects
- **Responsive**: Works perfectly on all devices
- **Contact Form**: Integrated with Web3Forms for reliable email delivery
- **Theme Support**: Dark/Light mode toggle
- **Performance Optimized**: Fast loading and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Email**: Web3Forms integration
- **Icons**: Lucide React
- **Deployment**: Render

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nafijpro-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend (Vite) on port 5173
- Backend (Express) on port 3001

## 🌐 Deployment on Render

### Method 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect the `render.yaml` file
4. Your app will be deployed with the correct configuration

### Method 2: Manual Setup

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:

**Build Settings:**
- Build Command: `npm run render:build`
- Start Command: `npm run render:start`

**Environment Variables:**
- `NODE_ENV`: `production`
- `WEB3FORMS_ACCESS_KEY`: `badf4ca6-e440-43be-abbf-e0e6c4b7663b`

**Advanced Settings:**
- Health Check Path: `/api/health`

## 📧 Email Configuration

The contact form uses Web3Forms for reliable email delivery:

- **Primary**: Web3Forms API (always works)
- **Backup**: Console logging for manual follow-up
- **Recipients**: 
  - nafijthepro@gmail.com
  - nafijprobd@gmail.com
  - nafijrahaman19721@gmail.com

## 🔧 Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run render:build` - Build for Render deployment
- `npm run render:start` - Start for Render deployment

## 🌟 Key Features

### Contact Form
- Real-time validation
- Multiple delivery methods
- Error handling with fallbacks
- Success/error notifications

### Responsive Design
- Mobile-first approach
- Smooth animations
- Optimized for all screen sizes

### Performance
- Lazy loading
- Optimized images
- Minimal bundle size

## 🎨 Customization

### Colors
The website uses a futuristic color scheme defined in `tailwind.config.js`:
- Primary: Cyan (#00D9FF)
- Secondary: Purple (#B026FF)
- Accent: Green (#39FF14)

### Fonts
- Headers: Orbitron (futuristic)
- Body: Space Grotesk (modern)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**NAFIJ RAHAMAN**
- Email: nafijthepro@gmail.com
- Website: [Your Render URL]

---

Made with ❤️ for the future 🚀