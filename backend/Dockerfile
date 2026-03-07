FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 
ENV FLASK_APP="app:create_app()"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]