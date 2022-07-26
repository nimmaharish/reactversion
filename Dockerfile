FROM node:12.21.0
WORKDIR /app
ADD start.sh .
RUN chmod +x start.sh
CMD ./start.sh
