FROM node:8-jessie

ENV SOPS_VERSION=3.0.4

RUN curl -L -o /tmp/sops_${SOPS_VERSION}_amd64.deb https://github.com/mozilla/sops/releases/download/${SOPS_VERSION}/sops_${SOPS_VERSION}_amd64.deb && \
    dpkg -i /tmp/sops_${SOPS_VERSION}_amd64.deb && \
    rm /tmp/sops_${SOPS_VERSION}_amd64.deb

RUN npm install -g yarn

WORKDIR /srv
ADD ./ /srv/

RUN yarn install && yarn build

CMD yarn start
