# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /home/app
COPY pom.xml .
# Download dependencies first (cached layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /usr/local/lib
COPY --from=build /home/app/target/hrms-backend-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
