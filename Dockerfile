FROM hypriot/rpi-node

#RUN apt-get update \
# && apt-get install -y \

RUN mkdir /agent
WORKDIR /agent
COPY ./node_modules ./node_modules
COPY ./agent.js .

CMD [ "node", "agent.js" ]
