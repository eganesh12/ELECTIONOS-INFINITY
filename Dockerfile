# Stage 1: Build the application
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Embed env vars directly for Vite build
ENV VITE_GEMINI_API_KEY=AIzaSyCICIkMPYRlpQIFy_0anti-WWnOKg68lGg
ENV VITE_FIREBASE_API_KEY=AIzaSyDL1Ju0uZZOH8rTOdATDxqmZbzRBi0l3E4
ENV VITE_FIREBASE_AUTH_DOMAIN=electionos-infinity.firebaseapp.com
ENV VITE_FIREBASE_PROJECT_ID=electionos-infinity
ENV VITE_FIREBASE_STORAGE_BUCKET=electionos-infinity.firebasestorage.app
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=952523561186
ENV VITE_FIREBASE_APP_ID=1:952523561186:web:6b8b64008f6c83faf566bb

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
