import { PrismaClient } from "@prisma/client";
import { BaseClass, type BaseClassParams } from "./base.class.js";

export interface ServiceBaseParams extends BaseClassParams {}

export class ServiceBase extends BaseClass {
	protected prisma: PrismaClient;

	constructor({ logger }: ServiceBaseParams) {
		super({ logger });
		this.prisma = new PrismaClient();
	}
}