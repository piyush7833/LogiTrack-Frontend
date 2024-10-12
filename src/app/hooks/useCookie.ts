import { useEffect, useState } from "react";
const useCookie = () => {
    const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
    const getCookie = (tokenName: string) => {
    
        const name = tokenName + "=";
        const decodedCookie =isClient && decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie ? decodedCookie.split(";") : [];
      
        for (let i = 0; i < cookieArray.length; i++) {
          const cookie = cookieArray[i].trim();
          if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
          }
        }
        return "";
      };
      

    return { getCookie}
      
}

export default useCookie