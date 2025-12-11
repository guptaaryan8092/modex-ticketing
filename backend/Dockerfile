FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Wait strategy or simple start. 
# CMD ["npm", "run", "dev"] for dev, or "npm", "start" for prod.
# Using start for container.
CMD ["npm", "start"]
