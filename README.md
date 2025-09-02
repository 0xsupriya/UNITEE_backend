# 🚀 UNITEE Backend

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

</div>

**UNITEE** is a robust backend system powering a collaborative platform designed specifically for developers and freelancers. It facilitates seamless networking, team formation, and project collaboration by connecting passionate individuals with shared goals and complementary skills.

Whether you're seeking teammates for hackathons, freelance collaborators, or co-founders for your startup, UNITEE provides the infrastructure to make meaningful professional connections.

---

## 🌟 Key Features

### 🔐 **Secure Authentication**

- JWT-based authentication system
- Password encryption with bcrypt
- Secure user session management

### 👤 **Comprehensive User Profiles**

- Detailed developer and freelancer profiles
- Skills and technology stack showcase
- Experience and education tracking
- Project portfolio integration

### 🔍 **Smart Discovery Engine**

- Advanced user filtering by role, skills, and interests
- Intelligent matching algorithms
- Location-based search capabilities

### 🤝 **Collaboration Hub**

- Create and browse collaboration opportunities
- Filter collaborations by type and tech stack
- Application management system
- Real-time collaboration matching

### 🌐 **Networking Features**

- Send and manage connection requests
- Build professional networks
- Track collaboration history

---

## 🏗️ Architecture

This project follows a modular NestJS architecture with the following key components:

- **Auth Module**: Handles user authentication and authorization
- **User Profile Module**: Manages user profile data and operations
- **Collaboration Module**: Facilitates collaboration post creation and applications
- **Explore Module**: Powers user discovery and connection features
- **Database Layer**: TypeORM entities and database management

---

## 🛠️ Technology Stack

### **Backend Framework**

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

### **Database & ORM**

- [PostgreSQL](https://www.postgresql.org/) - Powerful relational database
- [TypeORM](https://typeorm.io/) - Modern TypeScript ORM

### **Authentication & Security**

- [JSON Web Tokens (JWT)](https://jwt.io/) - Stateless authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [Passport.js](http://www.passportjs.org/) - Authentication middleware

### **Validation & Configuration**

- [Zod](https://zod.dev/) - TypeScript schema validation
- [class-validator](https://www.npmjs.com/package/class-validator) - Decorator-based validation
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) - Configuration management

### **Development Tools**

- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **PostgreSQL** (v13 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/0xsupriya/UNITEE_backend.git
   cd UNITEE_backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb unitee_db

   # Run migrations (if applicable)
   pnpm run migration:run
   ```

5. **Start the development server**
   ```bash
   pnpm run start:dev
   ```

The API will be available at `http://localhost:4000`

---

## 📋 Available Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm run start`       | Start the application                     |
| `pnpm run start:dev`   | Start in development mode with hot reload |
| `pnpm run start:debug` | Start in debug mode                       |
| `pnpm run start:prod`  | Start in production mode                  |
| `pnpm run build`       | Build the application                     |
| `pnpm run format`      | Format code with Prettier                 |
| `pnpm run lint`        | Run ESLint                                |
| `pnpm run test`        | Run unit tests                            |
| `pnpm run test:watch`  | Run tests in watch mode                   |
| `pnpm run test:cov`    | Run tests with coverage                   |
| `pnpm run test:e2e`    | Run end-to-end tests                      |

---

## 🔗 API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

### User Profile

- `GET /user-profile` - Get user profiles
- `POST /user-profile` - Create user profile
- `PATCH /user-profile` - Update user profile

### Collaboration

- `GET /collab` - Get collaboration posts
- `POST /collab` - Create collaboration post
- `POST /collab/apply` - Apply to collaboration

### Explore

- `GET /explore` - Discover users
- `POST /explore/connect` - Send connection request

---

## 🗂️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── user-profile/        # User profile management
├── collab/              # Collaboration features
├── explore/             # User discovery
└── main.ts              # Application entry point

libs/
├── common/              # Shared utilities
│   └── config/         # Configuration modules
└── db/                  # Database layer
    └── entities/        # TypeORM entities
```

---

## 🌍 Environment Variables

Create a `.env` file with the following variables:

```env
# Application
PORT=4000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=unitee_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow the existing code style
- Run `pnpm run lint` and `pnpm run format` before committing
- Write tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the UNLICENSED license.

---

## 👥 Authors

- **0xsupriya** - _Initial work_ - [GitHub](https://github.com/0xsupriya)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) for the amazing framework
- [TypeORM](https://typeorm.io/) for database ORM
- All contributors who help make this project better

---

<div align="center">
  <p>Made with ❤️ for the developer community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
