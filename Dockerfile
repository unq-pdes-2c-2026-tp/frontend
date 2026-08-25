# ----------
# BASE / DEV
# ----------
FROM node:24.19.0-alpine AS dev

# Seteamos el workdir dentro del contenedor
WORKDIR /app

# Copiamos los archivos de paquetes
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el codigo fuente
COPY . .

# Le damos ownership al usuario node
RUN chown -R node:node /app

# Cambiar al usuario no root previsto por node
USER node

# Puerto del vite dev server
EXPOSE 5173

# Correr vite en modo dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# -------
# BUILDER
# -------

FROM dev AS builder

USER root
RUN npm run build

# --------------
# PROD (Revisar)
# --------------
FROM nginx:1.31.4 AS prod

# Copiamos el build desde la etapa anterior a la carpeta estática de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]