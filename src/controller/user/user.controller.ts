import type { Request, Response } from 'express';
import type { UserService } from '../../services/user/user.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class UsersController extends ControllerBase {
	constructor(private readonly userService: UserService) {
		super();
	}

	public async getProfile(_req: Request, res: Response) {
		if (!res.locals.user?.sub) {
			throw this.errorSignal(404, 'User not found!');
		}

		const user = await this.userService.getUser({
			id: res.locals.user.sub,
		});

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				user,
			},
		});
	}
}
