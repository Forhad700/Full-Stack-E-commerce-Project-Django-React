import Cookies from 'js-cookie';



//export const domain = "http://127.0.0.1:8000";
export const domain = "";
export const usertoken = window.localStorage.getItem("token")
export const header = {
    Authorization: `token ${usertoken}`
}


const csrftoken = Cookies.get('csrftoken')

export const header2 = {
    'X-CSRFToken': csrftoken,
}


// export const domain = "";

/*
    window.localStorage.setItem('myCat', 'Tom');
    window.localStorage.removeItem('myCat');
    window.localStorage.clear();
    window.localStorage.getItem("token");
*/



// export const header2 = {
//     Authorization: `token ${token}`,
//     'X-CSRFToken': csrftoken,
// }