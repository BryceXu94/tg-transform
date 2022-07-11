// 获取审批实例详情
export interface IInstanceGetFormItem {
  /**
   * 控件 ID，也可以使用自定义 ID custom_id 的值
   */
  id: string;
  /**
   * 控件类型
   * 单行文本 input
   * 多行文本 textarea
   * 单选   radio/radioV2
   * 多选   checkbox/checkboxV2
   * 数字 number
   * 金额 amount
   * 日期 date
   * 日期区间 dateInterval
   * 附件 attachement/attachementV2
   * 图片 image/imageV2
   */
  type: string;
  /**
   * 控件名称
   */
  name: string;
  /**
   * 控件值，不同类型的值格式不一样
   * type=input,textarea      value="普通文本"
   * type=date                value=2019-10-01T08:12:01+08:00  //满足 RFC3339 格式
   * type=dateInterval
   * value={"start":"2019-10-01T08:12:01+08:00","end":"2019-10-01T08:12:01+08:00"，"interval":1} //满足 RFC3339 格式
   * type=radio,radioV2       value="k2b8mkx0-h71x5gljn3i-1"   通过查看审批定义接口获取 option.value
   * type=checkbox,checkboxV2 value=["k2b8mkx0-h71x5gljn3i-1"]   通过查看审批定义接口获取 option.value
   * type=number,amount       value=1234.56    数字类型
   * type=attachmentV2,image,imageV2    value=[{"name":"aaa.doc","fileUrl":"http://oss.ybf.cn/aaa.doc"}]
   * type=fieldList(明细)      value=[[{"id":"","type":"","value":""},{"id":"","type":"","value":""}]]
   */
  value: unknown;
}

export interface IInstanceGetProcessNodeListItem {
  /**
   * 动态类型，不同类型 ext 内的 user_id_list 含义不一样
   * START - 审批开始
   * PASS - 通过
   * REJECT - 拒绝
   * AUTO_PASS - 自动通过
   * AUTO_REJECT - 自动拒绝
   * REMOVE_REPEAT - 去重
   * TRANSFER - 转交
   * ADD_APPROVER_BEFORE - 前加签
   * ADD_APPROVER - 并加签
   * ADD_APPROVER_AFTER - 后加签
   * DELETE_APPROVER - 减签
   * ROLLBACK_SELECTED - 指定回退
   * ROLLBACK - 全部回退
   * CANCEL - 撤回
   * DELETE - 删除
   * CC - 抄送
   * PENDING - 审批中
   */
  type?: string;
  /**
   * 发生时间，示发生为 0
   */
  createTime: string;
  /**
   * 动态产生用户
   */
  userName: string;
  /**
   * 被抄送人列表
   */
  userNameList: string[];
  /**
   * 产生动态关联的task_id
   */
  taskId: string;
  /**
   * 理由
   */
  comment: string;
}

export interface IInstanceGetRes {
  /**
   * 主键
   */
  instanceId?: string;
  /**
   * 审批编号
   */
  serialNumber: string;
  /**
   * 审批类型
   */
  approvalType: string;
  /**
   * 业务code
   */
  bizCode: string;
  /**
   * 审批完成时间
   */
  finishTime: string;
  /**
   * 审批实例状态 PENDING- 审批中 APPROVED- 通过  REJECTED- 拒绝  CANCELED- 撤回  DELETED- 删除
   */
  instanceStatus: string;
  /**
   * 申请人id
   */
  creatorId: string;
  /**
   * 申请人名称
   */
  creatorName: string;
  /**
   * 申请人时间
   */
  createdTime: string;
  /**
   * 飞书审批表单
   */
  form: IInstanceGetFormItem[];
  /**
   * 审批流程
   */
  processNodeList: IInstanceGetProcessNodeListItem[];
}
