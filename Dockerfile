FROM alpine:edge

#
# Copy release to container and set command
#

ENV NODE_ENV production

# Copy build
RUN echo "https://dl-3.alpinelinux.org/alpine/edge/community/" >> /etc/apk/repositories && apk add --no-cache nodejs-npm yarn
RUN mkdir /vue43
WORKDIR /vue43
COPY package.json ./
RUN yarn install --production=false
COPY . /vue43
RUN yarn build
RUN addgroup -S element43 && adduser -S -g element43 element43

USER element43:element43

CMD ["/usr/bin/yarn", "start"]
