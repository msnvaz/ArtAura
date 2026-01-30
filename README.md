# ArtAura 🎨

ArtAura is a comprehensive art community platform that connects artists, art enthusiasts, and buyers in a vibrant ecosystem. The platform enables artists to showcase their work, participate in challenges, accept commissions, and sell their art through an integrated marketplace.

## ✨ Features

### For Artists
- **Portfolio Management**: Create and manage your art portfolio with detailed profiles
- **Art Challenges**: Participate in creative challenges with scoring based on likes, comments, and shares
- **Commission System**: Accept and manage custom art commission requests
- **Marketplace**: List and sell original artworks and prints
- **Achievement System**: Earn badges and achievements for milestones
- **Real-time Notifications**: Stay updated with interactions, orders, and challenge updates

### For Art Enthusiasts
- **Discover Art**: Browse and discover artwork from talented artists
- **Social Interactions**: Like, comment, and share favorite artworks
- **Follow Artists**: Keep track of your favorite artists' latest work
- **Purchase Art**: Buy original pieces and prints directly from artists
- **Commission Artwork**: Request custom artwork from artists

### For Moderators/Admins
- **Challenge Management**: Create and manage art challenges with custom scoring criteria
- **User Verification**: Verify and manage artist accounts
- **Content Moderation**: Monitor and manage community content
- **Analytics Dashboard**: Track platform metrics and user engagement
- **Delivery Management**: Oversee order fulfillment and delivery status

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS, DaisyUI, Bootstrap
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **Real-time**: STOMP/SockJS for WebSocket connections
- **UI Components**: Lucide React icons, React Feather
- **Notifications**: React Hot Toast, React Toastify
- **Payment**: Stripe integration
- **PDF Generation**: jsPDF with autoTable

### Backend
- **Framework**: Spring Boot 3.2.4
- **Language**: Java 17
- **ORM**: Spring Data JPA
- **Database**: MySQL
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven
- **Email**: Spring Mail with Gmail SMTP

### Development Tools
- **Frontend Dev**: Vite with Hot Module Replacement (HMR)
- **Linting**: ESLint with React plugins
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Java**: JDK 17 or higher
- **Maven**: 3.8 or higher
- **MySQL**: 8.0 or higher
- **Git**: Latest version

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/msnvaz/ArtAura.git
cd ArtAura
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE artaura_db;
```

2. Run the database migration scripts (if available):
```bash
mysql -u root -p artaura_db < database_scripts/update_challenges_add_scoring.sql
```

### 3. Backend Setup

1. Navigate to the server directory:
```bash
cd server/artaura
```

2. Configure application properties:
   - Create `src/main/resources/application.properties`
   - Add your database and email configuration:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/artaura_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_jwt_secret_key_make_it_long_and_random
jwt.expiration=604800000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

3. Build and run the server:
```bash
# Using Maven wrapper
./mvnw clean install
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

The backend server will start on `http://localhost:8081`

### 4. Frontend Setup

1. Navigate to the client directory:
```bash
cd ../../client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update the `.env` file in the root directory:
```env
CLIENT_PORT=5173
SERVER_PORT=8081
API_PORT=8081
API_URL=http://localhost:8081

DB_PORT=3306
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=artaura_db

JWT_SECRET=your_jwt_secret_key_make_it_long_and_random
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp
```

4. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎮 Usage

1. **Access the Application**: Open your browser and navigate to `http://localhost:5173`

2. **Create an Account**: 
   - Sign up as an artist or art enthusiast
   - Verify your email (if email service is configured)

3. **For Artists**:
   - Complete your artist profile
   - Upload your artwork portfolio
   - Enable commissions if you want to accept custom work
   - Participate in challenges
   - List items for sale in the marketplace

4. **For Buyers**:
   - Browse the marketplace
   - Follow your favorite artists
   - Purchase artwork
   - Request custom commissions

## 📁 Project Structure

```
ArtAura/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   │   └── uploads/            # Uploaded images
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── artist/        # Artist-specific components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── cart/          # Shopping cart components
│   │   │   ├── community/     # Community features
│   │   │   ├── moderator/     # Moderator tools
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── Artist/        # Artist pages
│   │   │   ├── Moderator/     # Moderator pages
│   │   │   ├── Profile/       # Profile pages
│   │   │   └── shop/          # Shop pages
│   │   ├── services/          # API service functions
│   │   └── App.jsx            # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── artaura/               # Spring Boot backend
│   │   ├── src/
│   │   │   └── main/
│   │   │       └── java/
│   │   │           └── com/artaura/artaura/
│   │   │               ├── config/          # Configuration classes
│   │   │               ├── controller/      # REST controllers
│   │   │               ├── dao/            # Data access objects
│   │   │               ├── dto/            # Data transfer objects
│   │   │               ├── entity/         # JPA entities
│   │   │               ├── exception/      # Exception handlers
│   │   │               ├── repository/     # JPA repositories
│   │   │               ├── security/       # Security config
│   │   │               ├── service/        # Business logic
│   │   │               └── util/           # Utility classes
│   │   └── pom.xml
│   └── app.js                # Express.js app (legacy/additional)
│
├── database_scripts/          # SQL migration scripts
├── uploads/                   # User uploaded files
└── .env                      # Environment variables
```

## 🔐 Authentication

ArtAura uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Create an account with email and password
2. **Login**: Receive a JWT token upon successful authentication
3. **Authorization**: Include the token in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 🎯 API Endpoints

The backend exposes RESTful APIs under the `/api` prefix:

- **Authentication**: `/api/auth/*`
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - Login user

- **Users**: `/api/users/*`
  - GET `/api/users/profile` - Get user profile
  - PUT `/api/users/profile` - Update profile

- **Artworks**: `/api/arts/*`
  - GET `/api/arts` - List all artworks
  - POST `/api/arts` - Upload new artwork
  - GET `/api/arts/{id}` - Get artwork details

- **Challenges**: `/api/challenges/*`
  - GET `/api/challenges` - List challenges
  - POST `/api/challenges` - Create challenge (moderator)
  - POST `/api/challenges/{id}/participate` - Join challenge

- **Orders**: `/api/orders/*`
  - GET `/api/orders` - User orders
  - POST `/api/orders` - Create order

For complete API documentation, refer to the controller files in the backend.

## 🧪 Development

### Running Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server/artaura
./mvnw test
```

### Linting

```bash
# Frontend linting
cd client
npm run lint
```

### Building for Production

```bash
# Frontend build
cd client
npm run build

# Backend build
cd server/artaura
./mvnw clean package
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Code Style Guidelines

- Follow existing code formatting and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Team

ArtAura is developed and maintained by the team at [msnvaz](https://github.com/msnvaz).

## 📧 Support

For support, please open an issue on the [GitHub repository](https://github.com/msnvaz/ArtAura/issues).

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React and Vite teams for amazing developer experience
- All contributors who have helped improve ArtAura

---

**Made with ❤️ by the ArtAura Team**
