import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../../config/cognitoconfig/userpool';
export const authenticate=(Email,Password)=>{
    return new Promise((resolve,reject)=>{
        const user=new CognitoUser({
            Username:Email,
            Pool:userpool
        });

        const authDetails= new AuthenticationDetails({
            Username:Email,
            Password
        });

        user.authenticateUser(authDetails,{
            onSuccess:(result)=>{
                console.log("login successful");
                resolve(result);
            },
            onFailure:(err)=>{
                console.log("login failed",err);
                reject(err);
            }
        });
    });
};

export const logout = () => {
    const user = userpool.getCurrentUser();
    localStorage.removeItem('auth')
    user.signOut();
    window.location.href = '/';
};


export const verifySecurityQuestionCheck = async (data) => {
    try {
        const response = await fetch(
          "https://rcysppl364.execute-api.us-east-1.amazonaws.com/stage1/getSecurityAnswer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
  
        const res = await response.json();
        
        console.log(res);
        return res

    } catch (error) {
        console.error(error);
        alert("security question do not match");
    }
}


export const verifyCeaserCipher = async (data) => {
    try {
        const response = await fetch(
          "https://rcysppl364.execute-api.us-east-1.amazonaws.com/stage1/getShiftKey",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
  
        const res = await response.json();
        
        console.log(res);
        return res

    } catch (error) {
        console.error(error);
        alert("No Shift Key available");
    }
}