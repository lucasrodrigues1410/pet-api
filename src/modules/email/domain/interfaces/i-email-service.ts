export interface ISendMailOptions {
	to: string;
	subject: string;
	html: string;
}
export interface IEmailService {
	sendMail(options: ISendMailOptions): Promise<void>;
}