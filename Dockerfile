FROM node:22.21-alpine3.21 as builder
RUN corepack enable
WORKDIR /app
COPY . .
ENV DATABASE_URL="mock"
RUN pnpm install && \ 
	pnpm exec prisma generate  && \
	pnpm build && \
	cd dist && \
	pnpm pkg set scripts.prepare=" " && \
	pnpm install --production --shamefully-hoist && \
	pnpm dlx prisma@6.19.0 generate

FROM node:22.21-alpine3.21 as runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist/ /app
USER node
ENTRYPOINT [ "node" ]
CMD [ "/app/index.js" ]