import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  ICustomerTenantPageListItem,
  IUserPageResListItem,
} from '@/modules/tenant-manage/tenant-manage/api/types';
import { filters } from '@/core/plugins/filter';
import {
  ENABLE_DISABLE_LIST,
  BUSINESS_MODE_LIST,
  YES_NO_ENUM,
  DESENSITIZE_DECRYPT_TYPE_ENUM,
  ENABLE_DISABLE_NO_LIST,
  YES_OR_NO_NUMBER_ENUM,
  YES_OR_NO_NUMBER_LIST,
  BUSINESS_MODE_NO_LIST,
} from '@/constant';
import { IDesensitizeData } from '@/components/encryption/package/types';
import { ENABLE_DISABLE_ENUM, CREATE_EDIT_ENUM } from '../types/index';

// 租户管理列表
export const renderColumns = (
  handleCreateTenant: (
    tenantId: string,
    type: string) => void,
  handleTenantEnableOrDisable: (
    row: ICustomerTenantPageListItem,
    type: ENABLE_DISABLE_ENUM) => void,
  handleOperation: (customerId: string) => void,
  CAN_EDIT: boolean,
  CAN_DISABLED: boolean,
  CAN_ENABLE: boolean,
  CAN_VIEW_LOG: boolean,
): IColumnsItem<ICustomerTenantPageListItem>[] => {
  return [
    {
      label: '客户名称',
      minWidth: '240',
      render: row => (
        <div>
          <div>{row?.customerName}</div>
        </div>
      ),
    },
    {
      label: '业务模式',
      minWidth: '150',
      render: row => (
        <div>{filters.getEnumLabel(BUSINESS_MODE_LIST, row?.businessType)}</div>
      ),
    },
    {
      label: '管理员账号信息',
      minWidth: '200',
      render: row => (
        <el-row>
          <encryption
            key={row?.tenantId}
            data={{
              businessId: row?.tenantId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: row?.userName,
              dateColumn: 'managerUserName',
            }}
            onUpdateContent={(result: IDesensitizeData[]) => {
              row.userName = result?.[0]?.content;
            }}
          ></encryption>
          {row?.phone
            && <el-row>
              [<encryption
                key={row?.tenantId}
                data={{
                  businessId: row?.tenantId,
                  dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                  content: row?.phone,
                  dateColumn: 'phone',
                }}
                onUpdateContent={(result: IDesensitizeData[]) => {
                  row.phone = result?.[0]?.content;
                }}
              >
              </encryption>]
            </el-row>}
        </el-row>
      ),
    },
    {
      label: '创建人',
      minWidth: '120',
      render: row => (
        <div>{row?.creatorName}</div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '180',
      render: row => (
        <div>{filters.formatTime(row?.createdTime)}</div>
      ),
    },
    {
      label: '用户状态',
      minWidth: '100',
      render: row => (
        <div>{filters.getEnumLabel(ENABLE_DISABLE_LIST, row.isEnable)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '250',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_EDIT && (
            <el-button
              type="text"
              onClick={() => handleCreateTenant(
                row?.tenantId,
                CREATE_EDIT_ENUM.EDIT,
              )}>
              编辑管理员账号</el-button>
          )}
          {YES_NO_ENUM.YES === row?.isEnable
            && CAN_DISABLED
            && (
              <el-button
                style={{ color: 'red' }}
                type="text"
                onClick={() => handleTenantEnableOrDisable(row, ENABLE_DISABLE_ENUM.DISABLE)}
              >
                停用
              </el-button>
            )}
          {YES_NO_ENUM.NO === row?.isEnable && CAN_ENABLE
            && (
              <el-button
                type="text"
                onClick={() => handleTenantEnableOrDisable(row, ENABLE_DISABLE_ENUM.ENABLE)}
              >
                启用
              </el-button>
            )}
          {CAN_VIEW_LOG
            && <el-button
              type="text"
              onClick={() => handleOperation(row?.tenantId)}
            >
              操作日志
            </el-button>}
        </div>
      ),
    },
  ];
};

// 账号管理列表
export const accountRenderColumns = (
  handleCreateAccount: (
    userId: string,
    type: string) => void,
  handleEnableOrDisable: (row: IUserPageResListItem, type: ENABLE_DISABLE_ENUM) => void,
  handleOperation: (customerId: string) => void,
  CAN_EDIT_ACCOUNT: boolean,
  CAN_ACCOUNT_DISABLED: boolean,
  CAN_ACCOUNT_ENABLE: boolean,
  CAN_VIEW__ACCOUNT_LOG: boolean,
): IColumnsItem<IUserPageResListItem>[] => {
  return [
    {
      label: '账号信息',
      minWidth: '240',
      render: row => (
        <div>
          <div class='flex'>
            名称：<encryption
              key={row?.userId}
              data={{
                businessId: row?.userId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
                content: row?.userName,
                dateColumn: 'userName',
              }}
              onUpdateContent={(result: IDesensitizeData[]) => {
                row.userName = result?.[0]?.content;
              }}
            ></encryption>
          </div>
          {row?.phone
          && <div class="flex margin-top-5">
            账号：<encryption
              data={{
                businessId: row?.userId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                content: row?.phone,
                dateColumn: 'phone',
              }}
              onUpdateContent={(result: IDesensitizeData[]) => {
                row.phone = result?.[0]?.content;
              }}
            >
            </encryption>
          </div>}
          <div class="margin-top-5">
            {row?.isPersonalCertificate === YES_OR_NO_NUMBER_ENUM.YES
              && <el-tag type="success" class="margin-right-5">个人已认证</el-tag>}
            {row?.isEnterpriseCertificate === YES_OR_NO_NUMBER_ENUM.YES
              && <el-tag type="danger">企业已认证</el-tag>}
          </div>
        </div>
      ),
    },
    {
      label: '客户品牌',
      minWidth: '200',
      render: row => (
        <div>
          {row?.brandNameList?.join('，')}
        </div>
      ),
    },
    {
      label: '角色',
      minWidth: '180',
      render: row => (
        <div>
          {row.isManager === YES_OR_NO_NUMBER_ENUM.YES
            ? <div>超管</div>
            : <div>
              <div>小程序：{row?.miniAppRoleName || '--'}</div>
              <div class='margin-top-5'>APP：{row?.appRoleName || '--'}</div>
            </div>
          }
        </div>
      ),
    },
    {
      label: '是否超管',
      minWidth: '120',
      render: row => (
        <div
          style={{
            color: row.isManager === YES_OR_NO_NUMBER_ENUM.YES ? 'red' : '',
          }
          }>
          {filters.getEnumLabel(YES_OR_NO_NUMBER_LIST, row.isManager!)}
        </div>
      ),
    },
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div>{row?.customerName}</div>
      ),
    },
    {
      label: '业务模式',
      minWidth: '150',
      render: row => (
        <div>{filters.getEnumLabel(BUSINESS_MODE_NO_LIST, row.businessType!)}</div>
      ),
    },
    {
      label: '创建人',
      minWidth: '120',
      render: row => (
        <div>{row?.creatorName}</div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '180',
      render: row => (
        <div>{filters.formatTime(row.createdTime! || '')}</div>
      ),
    },
    {
      label: '账号状态',
      minWidth: '100',
      render: row => (
        <div>{filters.getEnumLabel(ENABLE_DISABLE_NO_LIST, row.enableState!)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '250',
      fixed: 'right',
      render: row => (
        <div>
          {/* 超管不能编辑 */}
          {CAN_EDIT_ACCOUNT
            && row.isManager !== YES_OR_NO_NUMBER_ENUM.YES
            && <el-button
              type="text"
              onClick={() => handleCreateAccount(
                row.userId!,
                CREATE_EDIT_ENUM.EDIT,
              )}>
              编辑账号</el-button>}
          {YES_OR_NO_NUMBER_ENUM.YES === row?.enableState
            && CAN_ACCOUNT_DISABLED
            && <el-button
              style={{ color: 'red' }}
              type="text"
              onClick={() => handleEnableOrDisable(row, ENABLE_DISABLE_ENUM.DISABLE)}
            >停用</el-button>}
          {YES_OR_NO_NUMBER_ENUM.NO === row?.enableState && CAN_ACCOUNT_ENABLE
            && <el-button
              type="text"
              onClick={() => handleEnableOrDisable(row, ENABLE_DISABLE_ENUM.ENABLE)}>
              启用
            </el-button>}
          {CAN_VIEW__ACCOUNT_LOG
            && <el-button
              type="text"
              onClick={() => handleOperation(row.userId!)}>
              操作日志
            </el-button>}
        </div>
      ),
    },
  ];
};
