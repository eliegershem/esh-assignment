# Stage 1: Build the application
FROM python:3.13-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app.py .

# Stage 2: Create the final image using Alpine
FROM python:3.13-alpine

# Set the working directory
WORKDIR /app

# Install necessary packages for running Flask
RUN apk add --no-cache libstdc++  # Install any additional packages if needed

# Create a non-root user
RUN adduser -D flaskuser

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /app/app.py .

# Change ownership of the application files
RUN chown -R flaskuser:flaskuser /app

# Switch to the non-root user
USER flaskuser

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]