
console.log('process.env', process.env)

export interface IConstant {
    mainApiUrl: string,
}
const siteObjectsDev:IConstant = {
    mainApiUrl: "https://localhost:7168/api/"
    //mainApiUrl: "/demodata/"
}

const siteObjectsProd:IConstant = {
    mainApiUrl: "https://beliaeff.ru/api/"
}

export const SiteVars: IConstant = (process.env.REACT_APP_ENV === "dev") ? siteObjectsDev : siteObjectsProd

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '1px solid #CCC',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  };
