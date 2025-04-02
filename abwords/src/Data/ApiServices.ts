
import { IBaseResponse, IFormRegister } from "../Components/WordMemory/data"
import { SiteVars } from "./constants"
import { IAccount, IAuthResponse } from "./interfaces"

export class ApiServices {

    private _authUrl = `${SiteVars.mainApiUrl}Account/Login`

    async AuthLogin(authRequest: IAccount): Promise<IAuthResponse> {
        console.log('bodyRequest')
        const bodyRequest = {
            email: authRequest.login, password: authRequest.password, rememberMe:  authRequest.rememberMe,
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


    RegisterUser = async (reginfo: IFormRegister): Promise<IBaseResponse> => {
        try {
            const response = await fetch(`${SiteVars.mainApiUrl}Account/RegisterUser`, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify(reginfo),
            });
            const data = await response.json();

            if (!response.ok) {
                return {
                    isError: true,
                    errorText: data.detail || "An unknown error occurred.",
                };
            }    
            return { isError: false };
        } catch (error) {
            console.log(error)
            return { isError: true, 
                errorText: error instanceof Error ? error.message : "An unexpected error occurred",
            };
        }
    };


    GetUserInfo = async (token: string): Promise<IBaseResponse> => {

        const config = {
            headers: {'Authorization': `Bearer ${token}`
            }}
        try {
            
            const response = await fetch(`${SiteVars.mainApiUrl}Account/getinfo`, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    'Authorization': `Bearer ${token}`
                },
                
                //body: JSON.stringify(reginfo),
            });
            const data = await response.json();

            if (!response.ok) {
                return {
                    isError: true,
                    errorText: data.detail || "An unknown error occurred.",
                };
            }    
            return { isError: false, theResponse: data };
        } catch (error) {
            console.log(error)
            return { isError: true, 
                errorText: error instanceof Error ? error.message : "An unexpected error occurred",
            };
        }
    };
    



}