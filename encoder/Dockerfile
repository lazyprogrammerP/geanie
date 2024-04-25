# Stage 1: Build stage
FROM python:3.9-slim as builder

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Production stage
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy installed dependencies from the previous stage
COPY --from=builder /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/

# Copy the FastAPI application code
COPY . .

ARG PORT
ENV PORT=$PORT

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Expose port for FastAPI
EXPOSE $PORT

# Command to run the FastAPI application
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0"]
