# SAFE-FLIGHT

SAFE-FLIGHT is an application designed to ensure the safety and efficiency of flight operations. It consists of both client and server components, each responsible for specific aspects of the application.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The repository is divided into two main components:

1. **Client**: This contains the frontend code for the application.
2. **Server**: This contains the backend code for the application.

### Client

The client side is built using modern web technologies. The main folders and files include:

- **public**: Static assets.
- **src**: React components and application logic.
- **package.json**: Dependency management.

### Server

The server side is implemented using Java, and it includes the following:

- **.mvn**: Maven wrapper files.
- **src**: Java source code and resources.
- **pom.xml**: Maven configuration file.

## Features

- **Real-time flight tracking**: Monitor flights in real-time.
- **Safety notifications**: Receive alerts and notifications for any safety concerns.
- **User-friendly interface**: Easy-to-use web interface for tracking and management.

## Installation

### Prerequisites

- Node.js and npm (for the client)
- Java 8 or higher and Maven (for the server)
- Docker (optional, for containerized deployment)

### Client

1. Navigate to the `Client` directory:
    ```bash
    cd Client
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the client application:
    ```bash
    npm start
    ```

### Server

1. Navigate to the `Server` directory:
    ```bash
    cd Server
    ```
2. Build the server application using Maven:
    ```bash
    mvn clean install
    ```
3. Run the server application:
    ```bash
    java -jar target/your-server-application.jar
    ```

## Usage

1. Start the server application as described above.
2. Start the client application.
3. Open your web browser and navigate to `http://localhost:3000` to access the SAFE-FLIGHT application.

## Technologies Used

### Client

- React
- JavaScript
- HTML/CSS

### Server

- Java
- Spring Boot
- Maven

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Additional Resources

For more information and assets related to the project:
https://github.com/tal6203/REACT-SAFE-FLIGHT/assets/112417918/bf858da0-d7fe-4cb6-851e-c007377d222b
