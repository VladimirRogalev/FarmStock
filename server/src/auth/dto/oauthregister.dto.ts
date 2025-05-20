export class OAuthRegisterDto {
	email: string;
	firstName: string;
	lastName: string;
	oauthProvider: 'GOOGLE';
	password: null;
	roles: string[];
}