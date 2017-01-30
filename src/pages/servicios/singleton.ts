import { Injectable } from '@angular/core';

@Injectable()
export class SingletonService {
	public loginState: boolean = false;
}