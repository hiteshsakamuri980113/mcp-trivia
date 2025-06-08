# MCP Trivia Application 🧠✨

A modern, interactive trivia application built with React, TypeScript, and FastAPI, leveraging the Model Context Protocol (MCP) and Google's ADK for dynamic question generation.

## 🌟 Features

### Core Functionality

- **Dynamic Question Generation**: Uses Google's ADK to create unique trivia questions
- **Customizable Topics**: Choose from 10 predefined topics or enter custom topics
- **Difficulty Levels**: Easy, Medium, and Hard difficulty options
- **Flexible Question Count**: 5, 10, 15, or 20 questions per session
- **Real-time Scoring**: Instant feedback with detailed score breakdown
- **Answer Review**: Review all questions and correct answers after completion

### User Experience

- **Beautiful UI**: Modern glass-morphism design with smooth animations
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Interactive Navigation**: Skip questions, go back, or exit anytime
- **Progress Tracking**: Visual progress bar and question counters
- **Gradient Dividers**: Subtle visual separators between questions

### Technical Features

- **MCP Integration**: Uses Model Context Protocol for AI communication
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Robust error handling with user-friendly messages
- **CORS Support**: Configurable cross-origin resource sharing
- **Environment Configuration**: Secure API key management

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── WelcomeSection.tsx
│   │   ├── TopicSelector.tsx
│   │   ├── DifficultySelector.tsx
│   │   ├── QuestionCountSelector.tsx
│   │   ├── QuestionsDisplay.tsx
│   │   ├── IndividualQuestionDisplay.tsx
│   │   ├── FinalReport.tsx
│   │   └── ErrorDisplay.tsx
│   ├── services/             # API communication
│   │   └── api.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   └── assets/              # Static assets
├── public/                  # Public assets
└── package.json            # Dependencies and scripts
```

### Backend (FastAPI + Python)

```
backend/
├── app/
│   ├── mcp_client/          # MCP client implementation
│   │   └── client.py
│   ├── mcp_server/          # MCP server setup
│   │   └── server.py
│   └── utils/               # Utility functions
│       └── json_parser.py
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
└── .env                    # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Google AI API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mcp-trivia
   ```

2. **Backend Setup**

   ```bash
   cd backend

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Setup environment variables
   cp .env.example .env
   # Edit .env and add your Google AI API key
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend

   # Install dependencies
   npm install
   ```

### Configuration

1. **Environment Variables** (backend/.env)

   ```env
   GOOGLE_GENAI_USE_VERTEXAI=FALSE
   GOOGLE_API_KEY=your_google_api_key_here
   CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
   ```

2. **Get Google AI API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Replace `your_google_api_key_here` in `.env`

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - The backend API will be running on `http://localhost:8000`

## 🎮 How to Use

### Step-by-Step Game Flow

1. **Welcome Screen**: Start your trivia journey
2. **Topic Selection**: Choose from predefined topics or enter a custom topic
3. **Difficulty Selection**: Pick Easy, Medium, or Hard
4. **Question Count**: Select 5, 10, 15, or 20 questions
5. **Answer Questions**:
   - Read each question carefully
   - Select your answer from multiple choices
   - Skip questions if needed
   - Navigate back and forth
6. **View Results**: See your score, review answers, and start a new quiz

### Navigation Options

- **Skip**: Move to next question without answering
- **Previous/Next**: Navigate between questions
- **Exit**: Return to setup at any time
- **Review Answers**: See all questions with correct answers after completion

## 🛠️ API Endpoints

### Backend Routes

- `GET /` - Health check endpoint
- `POST /generate-questions` - Generate trivia questions
  ```json
  {
    "topic": "Science",
    "difficulty": "medium",
    "count": 10
  }
  ```

### Response Format

```json
{
  "questions": [
    {
      "question": "What is the chemical symbol for gold?",
      "options": ["Au", "Ag", "Fe", "Cu"],
      "correctAnswer": 0,
      "explanation": "Au comes from the Latin word 'aurum' meaning gold."
    }
  ]
}
```

## 🎨 Design System

### Color Palette

- **Primary**: Purple to Blue gradients
- **Glass Effects**: Semi-transparent backgrounds
- **Text**: White with varying opacity levels
- **Accents**: Green (correct), Red (incorrect), Yellow (skipped)

### Typography

- **Headers**: Custom gradient text effects
- **Body**: Clean, readable fonts
- **Interactive Elements**: Hover and focus states

### Animations

- **Fade-in Effects**: Staggered component animations
- **Hover Transitions**: Smooth scale and opacity changes
- **Loading States**: Skeleton loading animations

## 🔧 Technical Details

### MCP Integration

The application uses the Model Context Protocol to communicate with Google's ADK:

- **Client**: Handles API requests and MCP orchestration
- **Server**: Manages responses and data flow
- **Parser**: Robust JSON parsing for responses

### Error Handling

- **Network Errors**: User-friendly connection error messages
- **API Errors**: Graceful handling of AI service issues
- **Validation**: Input validation on both frontend and backend
- **Fallbacks**: Default behaviors when services are unavailable

### Performance Optimizations

- **React Optimizations**: Memoized components and callbacks
- **Bundle Splitting**: Efficient code splitting with Vite
- **Image Optimization**: Optimized assets and lazy loading
- **API Caching**: Strategic request caching

## 🧪 Testing

### Development Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
python -m pytest
```

### Manual Testing Checklist

- [ ] All topic selections work
- [ ] Custom topic input functions
- [ ] Difficulty levels generate appropriate questions
- [ ] Question counts are respected
- [ ] Scoring calculation is accurate
- [ ] Mobile responsiveness
- [ ] Error states display properly

## 📱 Mobile Support

The application is fully responsive and optimized for:

- **Mobile Phones**: Portrait and landscape orientations
- **Tablets**: Optimized touch interactions
- **Desktop**: Full feature set with hover effects

### Mobile-Specific Features

- Touch-friendly button sizes
- Swipe navigation support
- Responsive grid layouts
- Mobile-optimized typography

## 🔒 Security

### Environment Variables

- API keys stored in `.env` files
- `.gitignore` configured to exclude sensitive data
- Example files provided for easy setup

### CORS Configuration

- Configurable allowed origins
- Development and production environment support

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment

```bash
cd backend
pip install -r requirements.txt
# Configure environment variables for production
# Deploy using your preferred service (Heroku, AWS, etc.)
```

### Environment Variables for Production

```env
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your_production_api_key
CORS_ORIGINS=["https://your-frontend-domain.com"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain responsive design principles
- Add appropriate error handling
- Update documentation for new features
- Test on multiple devices and browsers

### Common Issues

**API Key Not Working**

- Verify your Google AI API key is correct
- Check if the API key has proper permissions
- Ensure the key is properly set in the `.env` file

**CORS Errors**

- Verify CORS_ORIGINS includes your frontend URL
- Restart the backend server after changing CORS settings

**Questions Not Generating**

- Check your internet connection
- Verify the backend server is running
- Check browser console for error messages

**Mobile Layout Issues**

- Clear browser cache
- Test on different mobile browsers
- Check for JavaScript errors in mobile developer tools

---

**Built with ❤️ using React, TypeScript, FastAPI, Google ADK and FastMCP**
