# Secure Share

Secure Share is a robust platform designed to simplify and enhance the way users manage and share files. With a focus on security and ease of use, the application provides features like multi-factor authentication, role-based access control, and file encryption to ensure safe and efficient file sharing. Its modern, responsive design ensures accessibility across devices while maintaining a seamless user experience.

## Main Features

- **Authentication**  
  A secure login system with Multi-Factor Authentication (MFA) using authenticator apps for enhanced security.

- **Access Control**  
  Role-based permission settings to control who can access files and drives, ensuring privacy and compliance.

- **File Management**

  - Upload, download, share, and protect files with encryption at rest and secure decryption during downloads.
  - Share files with public links that expire after a set time.
  - Share files with specific users with either "download-only" or "view-only" permissions.

- **Simple Design**  
  A user-friendly interface with a clean, responsive layout for a smooth and intuitive user experience.

## Technology Stack

### Frontend

- Vite
- React.js
- Tailwind CSS

### Backend

- Django
- SQLite 3

### Development Tools

- Docker & Docker Compose
- Python 12
- Node.js 18+

## Prerequisites

To run the project, you’ll need the following installed on your system:

- **Docker**: Ensure Docker and Docker Compose are set up.
- **Node.js**: Version 18+ (if not using Docker).
- **Python**: Version 12 (if not using Docker).

## Setup and Usage

### Using Docker (Recommended)

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/rajtoshranjan/secure-share.git
   cd secure-share
   ```

2. Run the application using Docker Compose:

   ```bash
   docker compose up --build
   ```

3. The application will be available at `http://localhost:3000` (or the configured port).

### Environment Configuration

- The default environment variables are defined in `.env.template`. For enhanced security:
  1. Copy `.env.template` to `.env.development`:
     ```bash
     cp .env.template .env.development
     ```
  2. Update sensitive information like API keys, secrets, and database credentials in `.env.development`.
  3. Modify the `docker-compose.yml` file to point the `env_file` to `.env.development`:
     ```yaml
     services:
       server:
         env_file:
           - .env.development
     ```

### Running Without Docker

#### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

#### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:

   ```bash
   python manage.py runserver
   ```

4. The backend will run on `http://localhost:8000` by default, and the frontend will be available on `http://localhost:5173`.

## License

This project is licensed under the [MIT License](LICENSE).
