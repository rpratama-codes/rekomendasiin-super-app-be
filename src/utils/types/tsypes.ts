export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Omit<T, K> &
	{
		[P in K]: Required<Pick<T, P>> & Partial<Pick<T, Exclude<K, P>>>;
	}[K];
