FROM node:22.21-alpine3.21 as builder
RUN corepack enable
WORKDIR /app
COPY . .
ENV DATABASE_URL="mock"
# Since it bundle by vite, 
# It doesn't need to generate prisma client.
RUN pnpm install && \ 
	pnpm build && \
	cd dist && \
	pnpm pkg set scripts.prepare=" " && \
	pnpm install --production --shamefully-hoist

FROM node:22.21-alpine3.21 as runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist/ /app
USER node
ENTRYPOINT [ "node" ]
CMD [ "/app/index.js" ]