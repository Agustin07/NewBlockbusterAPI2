FROM node:12-alphine

# set a directory for the app
WORKDIR /app

COPY ./package*.json ./

RUN npm install 

# copy all the files to the container
COPY . .


# define the port number the container should expose
EXPOSE 3000

# run the command
CMD ["npm", "run", "start:dev"]