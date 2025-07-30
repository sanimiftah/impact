# Impact Platform API

## 🚀 API-First Architecture

This is the backend API for the Impact Platform, built with a mobile-first, API-first approach for maximum scalability and future expansion.

## 📋 Features

- **RESTful API Design** - Clean, intuitive endpoints
- **JWT Authentication** - Secure token-based auth
- **AI-Powered Matching** - Intelligent volunteer-project matching
- **Real-time Capabilities** - WebSocket support for live features
- **Comprehensive Logging** - Request/response tracking
- **Rate Limiting** - API abuse protection
- **Input Validation** - Data integrity enforcement
- **Error Handling** - Consistent error responses
- **API Documentation** - Swagger/OpenAPI docs
- **Mobile Ready** - Optimized for mobile app consumption

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - Request throttling
- **Express Validator** - Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   cd api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **API will be available at:**
   - API Base: `http://localhost:3001`
   - Health Check: `http://localhost:3001/health`
   - API Documentation: `http://localhost:3001/api`

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

### 👥 Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/stats` - Get user statistics

### 🎯 Projects
- `GET /api/v1/projects` - List projects (with filtering)
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/stats` - Get project statistics

### 🤖 AI Matching
- `GET /api/v1/matching/recommendations` - Get AI recommendations
- `GET /api/v1/matching/compatibility/:projectId` - Check compatibility
- `POST /api/v1/matching/feedback` - Provide AI feedback
- `GET /api/v1/matching/stats` - Get AI statistics

### 🏢 Teams
- `GET /api/v1/teams` - List teams
- `POST /api/v1/teams` - Create team
- `GET /api/v1/teams/:id` - Get team details
- `PUT /api/v1/teams/:id/join` - Join team

### 📊 Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard data
- `GET /api/v1/analytics/impact` - Get impact metrics
- `GET /api/v1/analytics/trends` - Get platform trends

### 🌍 SDG Tracking
- `GET /api/v1/sdg/goals` - List SDG goals
- `GET /api/v1/sdg/progress` - Get SDG progress
- `POST /api/v1/sdg/contribute` - Record SDG contribution

### 🤝 Social Features
- `GET /api/v1/social/connections` - Get user connections
- `POST /api/v1/social/connect` - Send connection request
- `GET /api/v1/social/feed` - Get social feed

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```javascript
fetch('/api/v1/users/profile', {
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
  }
})
```

## 📱 Mobile App Integration

### React Native Example
```javascript
// API Service
class ImpactAPI {
  constructor(baseURL = 'http://localhost:3001/api/v1') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.token) {
      this.token = data.token;
    }
    return data;
  }

  async getRecommendations() {
    return this.apiCall('/matching/recommendations');
  }

  async apiCall(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return response.json();
  }
}
```

### Flutter Example
```dart
class ImpactApiService {
  static const String baseUrl = 'http://localhost:3001/api/v1';
  String? token;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      token = data['token'];
      return data;
    }
    throw Exception('Login failed');
  }

  Future<List<dynamic>> getRecommendations() async {
    final response = await http.get(
      Uri.parse('$baseUrl/matching/recommendations'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['recommendations'];
    }
    throw Exception('Failed to load recommendations');
  }
}
```

## 📊 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-01-28T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Human readable error message",
  "timestamp": "2025-01-28T10:30:00Z",
  "path": "/api/v1/endpoint",
  "requestId": "uuid-string"
}
```

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `JWT_SECRET` - Secret for JWT signing
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)

## 📚 API Documentation

- Interactive API docs: `http://localhost:3001/api/docs`
- Health check: `http://localhost:3001/health`
- API overview: `http://localhost:3001/api`

## 🚢 Deployment

### Docker
```bash
npm run docker:build
npm run docker:run
```

### Production Checklist
- [ ] Set secure `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Impact Platform**
*Connecting volunteers with meaningful opportunities through API-first architecture*
