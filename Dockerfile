FROM node:22.21-alpine3.21 as builder
RUN corepack enable
WORKDIR /app
COPY . .
# No need pnpm install --production
# we are not copying the node_modules
# we already bundling the only needed dependency.
RUN pnpm install && \ 
	pnpm exec prisma generate  && \
	pnpm build

FROM node:22.21-alpine3.21 as runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist/ /app
USER node
ENTRYPOINT [ "node" ]
CMD [ "/app/index.js" ]