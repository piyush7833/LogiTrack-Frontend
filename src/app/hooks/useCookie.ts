const useCookie = () => {
  
  const getCookie = (tokenName: string) => {
    
    const name = tokenName + "=";
    console.log(document)
    if(document!==undefined){

      const  decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(";");
    
      for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
    }
    return "";
  };
      

    return { getCookie}
      
}

export default useCookie