import { error } from "console"
import { SiteVars } from "./constants"
import { IAccount, IAuthResponse, IBaseItem, IBlog, IBlogReponse, IMoveFiles, IOperationResult, ITokens } from "./interfaces"
import axios from "axios"

export class ApiBlogServices {

    private _catUrl = `${SiteVars.mainApiUrl}Categories`
    private _blogUrl = `${SiteVars.mainApiUrl}Blogs`

    getBlogItems = async (tokens: ITokens, page?: number, perPage?: number): Promise<IBlogReponse> => {
        return new Promise<IBlogReponse>((resolve, reject) => {
            const url = `${this._blogUrl}?page=${page}`

            fetch(url, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    'Authorization': `Bearer ${tokens.accessToken}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    resolve(result)
                }).catch(err => {
                    console.error(err)
                    reject([])
                })
        })
    }

    getBlogItem = async (id:number):Promise<IBlog> => {
        return new Promise<IBlog>( (resolve, reject) => {
            console.log('??0', id)
            fetch(`${this._blogUrl}/${id}`)
                .then(res => res.json())
                .then(result => {
                    resolve(result)
                }).catch(err => {
                console.error(err)
                reject('not found')
            })
        })
    }

    deleteBlogItem = async (id:number):Promise<IOperationResult> => {
        return new Promise<IOperationResult>( (resolve, reject) => {
            console.log('??0', id)
            axios.delete(`${this._blogUrl}/11${id}`)
            .then( res => {
                const result: IOperationResult  = {
                    isSuccess: true,
                    message: 'The item is removed'
                }
                resolve(result)
            }).catch( err => {
                console.log(err)
                const result: IOperationResult  = {
                    isSuccess: true,
                    message: `The item is not removed ${err.title}`
                }
                reject( result)
            })
        })
    }

    GetCategories = async (): Promise<IBaseItem[]> => {
        const response = await fetch(this._catUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resData = await response.json();
        return new Promise<IBaseItem[]>( (resolve, reject) => {
            resolve(resData)
        })
    }


    SavePost = async (blog: IBlog): Promise<string> => {
        const formData = JSON.stringify(blog)
        return new Promise<string> ( async (resolve, reject) => {
            try {
                let response = null

                if(blog.id === 0)  {
                    response = await axios.post(`${this._blogUrl}/`, formData, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    });
                    resolve(response.data.id);
                } else {
                    response = await axios.put(`${this._blogUrl}/${blog.id}`, formData, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    });
                    resolve(String(blog.id));
                }

            } catch (error) {
                console.error("Error uploading file", error);
                reject('null')
            }
        })
    }


    UploadFile = async (e: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', e);
        return new Promise<string> ( async (resolve, reject) => {
            try {
                const response = await axios.post(`${this._blogUrl}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response)
                resolve(response.data.fileName);
            } catch (error) {
                console.error("Error uploading file", error);
                reject('null')
            }
        })
    };

    MoveFiles = async (postId: number, files: string[]): Promise<string> => {
        if (files === null || files.length === 0) return "No files to move";

        const movedFiles: IMoveFiles = {
            postId: postId,
            files: files
        }
        const formData = JSON.stringify(movedFiles)
        console.log('formData', formData)
        return new Promise<string> ( async (resolve, reject) => {
            try {
                const response = await axios.post(`${this._blogUrl}/moveImages`, movedFiles, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                console.log('move files response', response)
                resolve(response.data.fileName);
            } catch (error) {
                console.error("Error uploading file", error);
                reject('null')
            }
        })
    };


    RemoveFile = async (file: string, postId?: number): Promise<string> => {
        if (file === null || file.length < 3) return "No files to move";

        postId = (postId) ? postId : 0

        const formData = JSON.stringify( {
            postId: postId,
            file: file,
        })
        console.log('formData', formData)
        return new Promise<string> ( async (resolve, reject) => {
            try {
                const response = await axios.post(`${this._blogUrl}/deleteImage`, formData, {

                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response)
                resolve(response.data.fileName);
            } catch (error) {
                console.error("Error uploading file", error);
                reject('null')
            }
        })
    };



}