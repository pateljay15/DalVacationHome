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
          "https://rcysppl364.execute-api.us-east-1.amazonaws.com/stage1/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
  
        const data = await response.json();
        
        console.log(data);
        return data

    } catch (error) {
        console.error(data);
        alert("security question do not match");
    }
}