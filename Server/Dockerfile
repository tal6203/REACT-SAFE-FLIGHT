# Use the Maven image to build the application
FROM maven:3.8.2-openjdk-17 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files to the container
COPY ./Server/pom.xml .
COPY ./Server/src ./src

# Download dependencies and build the project
RUN mvn dependency:go-offline
RUN mvn clean package -DskipTests

# Use the OpenJDK image to run the application
FROM openjdk:17
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
