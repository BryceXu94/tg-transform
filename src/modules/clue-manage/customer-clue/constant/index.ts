import { GLOBAL_COLOR_TYPE_ENUM } from '@/constant/global';

/**
 * 审核结果 1-审核通过 审核驳回：2-不符合画像 3-资料填写太少 4-其他原因
 */
export enum AUDIT_RESULT_ENUM {
  /**
   * 未审核
   */
  NOT_AUDIT = '0',
  /**
   * 审核通过
   */
  AUDIT_PASSED = '1',
  /**
   * 审核驳回-不符合画像
   */
  AUDIT_FAILED_A = '2',
  /**
   * 审核驳回-资料填写太少
   */
  AUDIT_FAILED_B = '3',
  /**
   * 审核驳回-其他原因
   */
  AUDIT_FAILED_C = '4',
}

export const AUDIT_STATE_LIST = [
  { value: AUDIT_RESULT_ENUM.AUDIT_PASSED, label: '审核通过' },
  { value: AUDIT_RESULT_ENUM.AUDIT_FAILED_A, label: '不符合画像' },
  { value: AUDIT_RESULT_ENUM.AUDIT_FAILED_B, label: '资料填写太少' },
  { value: AUDIT_RESULT_ENUM.AUDIT_FAILED_C, label: '其他原因' },
];

/**
 * 线索状态 1-待提交 2-待审核 3-审核通过 4-审核驳回
 */
export enum TRACK_STATE_ENUM {
  /**
   * 待提交
   */
  WAIT_COMMIT = '1',
  /**
   * 待审核
   */
  WAIT_AUDIT = '2',
  /**
   * 审核通过
   */
  AUDIT_PASSED = '3',
  /**
   * 审核驳回
   */
  AUDIT_FAILED = '4',
}

export const TRACK_STATE_LIST = [
  { value: TRACK_STATE_ENUM.WAIT_COMMIT, label: '待提交', color: GLOBAL_COLOR_TYPE_ENUM.WARNING },
  { value: TRACK_STATE_ENUM.WAIT_AUDIT, label: '待审核', color: GLOBAL_COLOR_TYPE_ENUM.PRIMARY },
  {
    value: TRACK_STATE_ENUM.AUDIT_PASSED,
    label: '审核通过',
    color: GLOBAL_COLOR_TYPE_ENUM.SUCCESS,
  },
  { value: TRACK_STATE_ENUM.AUDIT_FAILED, label: '审核驳回', color: GLOBAL_COLOR_TYPE_ENUM.ERROR },
];

/**
 * 审核日志类型
 */
export enum AUDIT_LOG_TYPE_ENUM {
  /**
   * 创建
   */
   ADD = 'ADD',
   /**
    * 编辑
    */
   UPDATE = 'UPDATE',
   /**
    * 审批
    */
   EXAMINE_AND_APPROVE = 'EXAMINE_AND_APPROVE',
   /**
    * 启用
    */
   ENABLE = 'ENABLE',
   /**
    * 禁用
    */
   DISABLE = 'DISABLE',
   /**
    * 删除
    */
   DELETE = 'DELETE',
   /**
    * BD认领
    */
   BD_CLAIM = 'BD_CLAIM',
   /**
    * 分配BD
    */
   BD_DISTRIBUTION = 'BD_DISTRIBUTION',
   /**
    * 转移BD
    */
   BD_CHANGE = 'BD_CHANGE',
   /**
    * 释放公海
    */
   RELEASE_PUBLIC = 'RELEASE_PUBLIC',
   /**
    * 开发反馈
    */
   DEV_FEEDBACK = 'DEV_FEEDBACK',
   /**
    * 提交结果-已转换
    */
   COMMIT_RESULT_CONVERTED = 'COMMIT_RESULT_CONVERTED',
   /**
    * 提交结果-无效
    */
   COMMIT_RESULT_INVALID = 'COMMIT_RESULT_INVALID',
   /**
    * 激活
    */
   ACTIVATION = 'ACTIVATION',
   /**
    * 新增线索-暂存
    */
   CREATE_TRACK_TEMPORARY = 'CREATE_TRACK_TEMPORARY',
   /**
    * 新增线索-提交
    */
   CREATE_TRACK_SUBMIT = 'CREATE_TRACK_SUBMIT',
   /**
    * 编辑线索
    */
   EDIT_TRACK_TEMPORARY = 'EDIT_TRACK_TEMPORARY',
   /**
    * 审核通过
    */
   AUDIT_PASSED = 'AUDIT_PASSED',
   /**
    * 审核驳回-不符合画像
    */
   AUDIT_FAILED_A = 'AUDIT_FAILED_A',
   /**
    * 审核驳回-资料填写太少
    */
   AUDIT_FAILED_B = 'AUDIT_FAILED_B',
   /**
    * 审核驳回-其他原因
    */
   AUDIT_FAILED_C = 'AUDIT_FAILED_C',
}

export const AUDIT_LOG_TYPE_LIST = [
  { value: AUDIT_LOG_TYPE_ENUM.ADD, label: '创建' },
  { value: AUDIT_LOG_TYPE_ENUM.UPDATE, label: '编辑' },
  { value: AUDIT_LOG_TYPE_ENUM.EXAMINE_AND_APPROVE, label: '审批' },
  { value: AUDIT_LOG_TYPE_ENUM.ENABLE, label: '启用' },
  { value: AUDIT_LOG_TYPE_ENUM.DISABLE, label: '禁用' },
  { value: AUDIT_LOG_TYPE_ENUM.DELETE, label: '删除' },
  { value: AUDIT_LOG_TYPE_ENUM.BD_CLAIM, label: 'BD认领' },
  { value: AUDIT_LOG_TYPE_ENUM.BD_DISTRIBUTION, label: '分配BD' },
  { value: AUDIT_LOG_TYPE_ENUM.BD_CHANGE, label: '转移BD' },
  { value: AUDIT_LOG_TYPE_ENUM.RELEASE_PUBLIC, label: '释放公海' },
  { value: AUDIT_LOG_TYPE_ENUM.DEV_FEEDBACK, label: '开发反馈' },
  { value: AUDIT_LOG_TYPE_ENUM.COMMIT_RESULT_CONVERTED, label: '提交结果-已转换' },
  { value: AUDIT_LOG_TYPE_ENUM.COMMIT_RESULT_INVALID, label: '提交结果-无效' },
  { value: AUDIT_LOG_TYPE_ENUM.ACTIVATION, label: '激活' },
  { value: AUDIT_LOG_TYPE_ENUM.CREATE_TRACK_TEMPORARY, label: '新增线索-暂存' },
  { value: AUDIT_LOG_TYPE_ENUM.CREATE_TRACK_SUBMIT, label: '新增线索-提交' },
  { value: AUDIT_LOG_TYPE_ENUM.EDIT_TRACK_TEMPORARY, label: '编辑线索' },
  { value: AUDIT_LOG_TYPE_ENUM.AUDIT_PASSED, label: '审核通过' },
  { value: AUDIT_LOG_TYPE_ENUM.AUDIT_FAILED_A, label: '审核驳回-不符合画像' },
  { value: AUDIT_LOG_TYPE_ENUM.AUDIT_FAILED_B, label: '审核驳回-资料填写太少' },
  { value: AUDIT_LOG_TYPE_ENUM.AUDIT_FAILED_C, label: '审核驳回-其他原因' },
];

/**
 * 操作日志类型
 */
export enum OPERATION_LOG_TYPE_ENUM {
  /**
   * 创建
   */
  ADD = 'ADD',
  /**
   * 编辑
   */
  UPDATE = 'UPDATE',
  /**
   * 审批
   */
  EXAMINE_AND_APPROVE = 'EXAMINE_AND_APPROVE',
  /**
   * 启用
   */
  ENABLE = 'ENABLE',
  /**
   * 禁用
   */
  DISABLE = 'DISABLE',
  /**
   * 删除
   */
  DELETE = 'DELETE',
  /**
   * 创建开发跟进
   */
  CREATE_CLUE_DEV = 'CREATE_CLUE_DEV',
  /**
   * BD认领
   */
  BD_CLAIM = 'BD_CLAIM',
  /**
   * 分配BD
   */
  BD_DISTRIBUTION = 'BD_DISTRIBUTION',
  /**
   * 转移BD
   */
  BD_CHANGE = 'BD_CHANGE',
  /**
   * 释放公海
   */
  RELEASE_PUBLIC = 'RELEASE_PUBLIC',
  /**
   * 开发反馈
   */
  DEV_FEEDBACK = 'DEV_FEEDBACK',
  /**
   * 提交结果-已转换
   */
  COMMIT_RESULT_CONVERTED = 'COMMIT_RESULT_CONVERTED',
  /**
   * 提交结果-无效
   */
  COMMIT_RESULT_INVALID = 'COMMIT_RESULT_INVALID',
  /**
   * 激活
   */
  ACTIVATION = 'ACTIVATION',
  /**
   * 新增线索-暂存
   */
  CREATE_TRACK_TEMPORARY = 'CREATE_TRACK_TEMPORARY',
  /**
   * 新增线索-提交
   */
  CREATE_TRACK_SUBMIT = 'CREATE_TRACK_SUBMIT',
  /**
   * 编辑线索
   */
  EDIT_TRACK_TEMPORARY = 'EDIT_TRACK_TEMPORARY',
  /**
   * 审核通过
   */
  AUDIT_PASSED = 'AUDIT_PASSED',
  /**
   * 审核驳回-不符合画像
   */
  AUDIT_FAILED_A = 'AUDIT_FAILED_A',
  /**
   * 审核驳回-资料填写太少
   */
  AUDIT_FAILED_B = 'AUDIT_FAILED_B',
  /**
   * 审核驳回-其他原因
   */
  AUDIT_FAILED_C = 'AUDIT_FAILED_C',
  /**
   * 提交线索审核
   */
  AUDIT_SUBMIT = 'AUDIT_SUBMIT',
}

export const OPERATION_LOG_TYPE_LIST = [
  { value: OPERATION_LOG_TYPE_ENUM.ADD, label: '创建' },
  { value: OPERATION_LOG_TYPE_ENUM.UPDATE, label: '编辑' },
  { value: OPERATION_LOG_TYPE_ENUM.EXAMINE_AND_APPROVE, label: '审批' },
  { value: OPERATION_LOG_TYPE_ENUM.ENABLE, label: '启用' },
  { value: OPERATION_LOG_TYPE_ENUM.DISABLE, label: '禁用' },
  { value: OPERATION_LOG_TYPE_ENUM.DELETE, label: '删除' },
  { value: OPERATION_LOG_TYPE_ENUM.CREATE_CLUE_DEV, label: '创建开发跟进' },
  { value: OPERATION_LOG_TYPE_ENUM.BD_CLAIM, label: 'BD认领' },
  { value: OPERATION_LOG_TYPE_ENUM.BD_DISTRIBUTION, label: '分配BD' },
  { value: OPERATION_LOG_TYPE_ENUM.BD_CHANGE, label: '转移BD' },
  { value: OPERATION_LOG_TYPE_ENUM.RELEASE_PUBLIC, label: '释放公海' },
  { value: OPERATION_LOG_TYPE_ENUM.DEV_FEEDBACK, label: '开发反馈' },
  { value: OPERATION_LOG_TYPE_ENUM.COMMIT_RESULT_CONVERTED, label: '提交结果-已转换' },
  { value: OPERATION_LOG_TYPE_ENUM.COMMIT_RESULT_INVALID, label: '提交结果-无效' },
  { value: OPERATION_LOG_TYPE_ENUM.ACTIVATION, label: '激活' },
  { value: OPERATION_LOG_TYPE_ENUM.CREATE_TRACK_TEMPORARY, label: '新增线索-暂存' },
  { value: OPERATION_LOG_TYPE_ENUM.CREATE_TRACK_SUBMIT, label: '新增线索-提交' },
  { value: OPERATION_LOG_TYPE_ENUM.EDIT_TRACK_TEMPORARY, label: '编辑线索' },
  { value: OPERATION_LOG_TYPE_ENUM.AUDIT_PASSED, label: '审核通过' },
  { value: OPERATION_LOG_TYPE_ENUM.AUDIT_FAILED_A, label: '审核驳回-不符合画像' },
  { value: OPERATION_LOG_TYPE_ENUM.AUDIT_FAILED_B, label: '审核驳回-资料填写太少' },
  { value: OPERATION_LOG_TYPE_ENUM.AUDIT_FAILED_C, label: '审核驳回-其他原因' },
  { value: OPERATION_LOG_TYPE_ENUM.AUDIT_SUBMIT, label: '提交线索审核' },
];
