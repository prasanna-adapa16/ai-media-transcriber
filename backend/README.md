# AI Media Transcriber - Backend

Spring Boot REST API backend for the **AI Media Transcriber** application.

---

## 🛠️ Tech Stack
- **Java**: 17
- **Framework**: Spring Boot 3.2.5
- **Build Tool**: Maven
- **Database**: MySQL (`ai_media_transcriber`)
- **Persistence**: Spring Data JPA / Hibernate
- **REST Endpoints**: Spring Web & Validation

---

## 🗄️ MySQL Database Setup

1. Make sure your MySQL server is running (e.g. via MySQL Workbench, Homebrew `brew services start mysql`, or Docker).
2. Log in to your MySQL terminal or GUI:
   ```bash
   mysql -u root -p
   ```
3. Create the database for the project:
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_media_transcriber;
   ```

---

## ⚙️ Environment Variables Configuration

The backend connects to MySQL using environment variables with default fallbacks:

| Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL host address |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `ai_media_transcriber` | Database name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | *(empty string)* | Your MySQL password |

To run the application with your MySQL credentials, pass them in your terminal:
```bash
export DB_USERNAME=root
export DB_PASSWORD=your_actual_password
```

---

## 🚀 Running the Backend

From the `ai_media/backend` directory, run:

```bash
# Using Maven wrapper or local Maven
mvn spring-boot:run
```

Or specify environment variables inline:
```bash
DB_PASSWORD=your_actual_password mvn spring-boot:run
```

The server will start on port **8080**:
`http://localhost:8080`

---

## 🧪 Testing the Health Endpoint

Once the application is running, test the health check endpoint:

### Using curl:
```bash
curl http://localhost:8080/api/health
```

### Expected Response:
```json
{
  "status": "UP",
  "service": "AI Media Transcriber Backend"
}
```

Or open in your browser:
[http://localhost:8080/api/health](http://localhost:8080/api/health)
