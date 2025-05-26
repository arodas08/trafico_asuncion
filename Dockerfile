# Imagen base
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
COPY server.js .
COPY index.html .
COPY main.js .

# Instalar dependencias
RUN npm install

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "server.js"]
