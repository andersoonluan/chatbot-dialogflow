FROM ubuntu

EXPOSE 8000
	
RUN apt-get update 

COPY ./package.json /usr/public/app/package.json
WORKDIR /usr/public/app/
RUN npm install

COPY ./ /usr/public/app
CMD [ "npm", "start" ]
