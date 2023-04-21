function capitalizeFirstLetter(str: string): string {
    if(!str){
        return "no name";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
    export default capitalizeFirstLetter ;