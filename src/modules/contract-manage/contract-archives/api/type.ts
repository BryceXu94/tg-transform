/**
 * 查询列表（分页）
 * yapi地址：https://yapi.ibaibu.com/project/2202/interface/api/166913
 */
export interface IContractArchivesPageReq {
  /**
   * 甲方
   */
  firstParty?: string;
  /**
   * 乙方
   */
  secondParty?: string;
  /**
   * 平台订单号
   */
  platformOrderCode?: string;
  /**
   * 需求编号
   */
  demandCode?: string;
  /**
   * 合同状态
   * 2040 :待客户签署
   * 2050 :待工厂签署
   * 30 :已签署
   * WAIT_CUSTOMER_SIGN :待客户签署
   * WAIT_SUPPLIER_SIGN :待工厂签署
   * CONTRACT_FINISH :已签署
   */
  contractState?: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 合同状态 2040-待签署合同、2050-工厂签署中、已完成-30
 */
export const enum ContractStateEnum {
  /**
   * 待客户签署
   */
  WAIT_CUSTOMER_SIGN = 'WAIT_CUSTOMER_SIGN',
  /**
   * 待工厂签署
   */
  WAIT_SUPPLIER_SIGN = 'WAIT_SUPPLIER_SIGN',
  /**
   * 已签署
   */
  CONTRACT_FINISH = 'CONTRACT_FINISH'
}

export interface IContractArchivesPageResListItem {
  /**
   * 合同档案主键Id
   */
  contractArchivesId?: string;
  /**
   * 合同编号
   */
  contractCode?: string;
  /**
   * 甲方
   */
  firstParty?: string;
  /**
   * 甲方编码
   */
  firstPartyCode?: string;
  /**
   * 乙方
   */
  secondParty?: string;
  /**
   * 乙方编码
   */
  secondPartyCode?: string;
  /**
   * 平台订单号
   */
  platformOrderCode?: string;
  /**
   * 需求id
   */
  demandId?: string;
  /**
   * 需求编号
   */
  demandCode?: string;
  /**
   * 合同状态 2040-待签署合同、2050-工厂签署中、已完成-30
   */
  contractState?: ContractStateEnum;
  /**
   * 合同url
   */
  contractUrlList?: string[];
  /**
   * 合同名称
   */
  contractName?: string;
}

export interface IContractArchivesPageRes {
  page?: number;
  total?: number;
  list?: IContractArchivesPageResListItem[];
}
