import { SiteVars } from "./constants"
import { IAccount, IAuthResponse } from "./interfaces"

export class ApiServices {

    private _authUrl = `${SiteVars.mainApiUrl}Account/Login`

    async AuthLogin(authRequest: IAccount): Promise<IAuthResponse> {
        const bodyRequest = {
            email: authRequest.login, password: authRequest.password
        }
        try {
            const response = await fetch(this._authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyRequest)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resData = await response.json();
            const result: IAuthResponse = {
                loginSuccess: true,
                loginResultMessage: 'Successfully logged in',
                tokens: {
                    accessToken: resData.accessToken || '',
                    refreshToken: resData.refreshToken || ''
                }
            };
            return result;

        } catch (error) {
            console.error('Error:', error);
            const badResult: IAuthResponse = {
                loginSuccess: false,
                loginResultMessage: `Failed to log in: ${error}`,
                tokens: {
                    accessToken: '',
                    refreshToken: ''
                }
            };
            return Promise.reject(badResult);
        }

    }

}