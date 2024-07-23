// import { CognitoUserPool } from 'amazon-cognito-identity-js';
// const poolData = {
//   UserPoolId: process.env.REACT_APP_USER_POOL_ID,
//   ClientId: process.env.REACT_APP_CLIENT_ID,
// };
// export default new CognitoUserPool(poolData);
import { CognitoUserPool } from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: "us-east-1_uJlPoCR1S",
  ClientId: "52ch0v7o8d38a35uouhuso9bj8",
};
export default new CognitoUserPool(poolData);