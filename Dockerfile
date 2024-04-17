FROM node:lts-alpine3.19 AS prod

LABEL maintainer="ysoultane@gmail.com"

RUN apk --update add tzdata \
&& cp /usr/share/zoneinfo/Europe/Paris /etc/localtime \
&& echo "Europe/Paris" > /etc/timezone \
&& apk del tzdata

COPY . /app

WORKDIR /app

RUN npm install --silent

CMD ["npm", "run", "start:prod"]