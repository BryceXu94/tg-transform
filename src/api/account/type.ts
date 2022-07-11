// 用户信息
// 租户信息列表
export interface ICompanyInfoItem {
  /*
  * 租户Id
  * */
  companyId: string;
  /*
  * 租户编码
  * */
  companyCode: string;
  /*
  * 租户名称
  * */
  companyName: string;
  /*
   * 用户名称
   * */
  username: string;
  /*
   * 用户邮箱
   * */
  email: string;
  /*
   * 是否是租户管理员
   * */
  isCompanyManager: boolean;
}
// SSO登陆请求放回结果
export interface IUserInfoRes {
  /*
  * 租户信息列表
  * */
  companyInfoList: ICompanyInfoItem[];
  // /*
  // * 当前租户
  // * */
  // currentCompany?: ICompanyInfoItem;
  /*
  * 用户ID
  * */
  userId: string;
  /*
  * 用户名称
  * */
  username: string;
}

/*
* 根据code换取Token
* */
export interface IExchangeTokenRes {
  publicKey: string;
  /*
  * token
  * */
  ssoToken: string;
}

export interface IUpdateUserPasswordReq{
  oldPassword: string;
  newPassword: string;
  userId: string;
}
