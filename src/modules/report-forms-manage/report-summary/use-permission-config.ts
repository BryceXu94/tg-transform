const usePermissionConfig = () => {
  return {
    /**
     * 查看报表
     * 控制：报表管理-报表汇总-查看报表
     */
    CKBB: 'CCS-BBGL-BBHZ-CKBB',
    /**
     * CSV导出
     * 控制：报表管理-报表汇总-CSV导出
     */
    CSVDC: 'CCS-BBGL-BBHZ-CSVDC',
  };
};

export default usePermissionConfig;
