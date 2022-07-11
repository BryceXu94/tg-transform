<script lang="tsx">
import { plus } from 'number-precision';
// import { saveAs } from 'file-saver';
import { computed, defineComponent, ref, Teleport, PropType } from 'vue';
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';
import { printHtml, formatFloat } from '@tiangong/utils';

import { filters } from '@/core/plugins/filter';
import { exportByBlob } from '@/core/utils/file-download';
import { IGetCustomerStatementDetailRes } from '@/modules/financial-manage/customer-statement/api/types';
import { IStatementListItem } from './type';

export default defineComponent({
  components: {
  },
  props: {
    data: {
      type: Object as PropType<IGetCustomerStatementDetailRes>,
      required: true,
      default: () => {},
    },
    list: {
      type: Array as PropType<IStatementListItem[]>,
      required: true,
      default: () => [],
    },
  },
  setup(props) {
    const $route = useRoute();
    const el = ref<HTMLElement>();

    const exportExcel = async () => {
      try {
        await exportByBlob({
          method: 'get',
          url: `/crm-finance/web/v1/bill/export-excel/${$route.params.id as string}`,
          filename: '客户对账单.xlsx',
          loading: true,
        });
      } catch (error) {
        console.log(error);
      }
      // 下载的表格模板数据 若前端生成，Numberbs软件无法打开
      // const template = `
      //   <html
      //     xmlns:o="urn:schemas-microsoft-com:office:office"
      //     xmlns:x="urn:schemas-microsoft-com:office:excel"
      //     xmlns="http://www.w3.org/TR/REC-html40"
      //   >
      //     <head>
      //       <meta charset='UTF-8'>
      //       <!--[if gte mso 9]>
      //       <xml>
      //         <x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      //         <x:Name>Sheet1</x:Name>
      //         <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      //         </x:ExcelWorksheets></x:ExcelWorkbook>
      //     </xml><![endif]-->
      //     </head><body>${el.value?.innerHTML}</body>
      //   </html>
      // `.replaceAll('<br', '<br style="mso-data-placement:same-cell;"');
      // saveAs(
      //   new Blob([template], {
      //     type: 'text/vnd.ms-excel;charset=utf-8',
      //   }),
      //   '客户对账单121',
      //   {
      //     autoBom: true,
      //   },
      // );
    };

    const exportImage = async () => {
      // 获取设备的像素比
      const scale = window.devicePixelRatio && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
      const html = el.value!;
      const contentWidth = html.clientWidth; // 获得该容器的宽
      const contentHeight = html.clientHeight; // 获得该容器的高
      const canvas = document.createElement('canvas');
      canvas.width = contentWidth * scale;
      canvas.height = contentHeight * scale;

      canvas.getContext('2d');

      const canvasOptions = {
        canvas,
        scale,
        useCORS: true,
      };
      const _canvas = await html2canvas(html, canvasOptions);
      const file = _canvas.toDataURL('jpeg', 1);
      const a = document.createElement('a');
      a.href = file;
      a.download = '客户对账单.jpeg';
      a.click();
      document.body.removeChild(a);
    };

    const print = () => {
      printHtml(el.value?.innerHTML);
    };

    const orderTotal = computed(() => {
      return props.list.reduce((total, current) => plus(total, current.orderCount), 0);
    });
    const deliveryTotal = computed(() => {
      return props.list.reduce((total, current) => plus(total, current.deliveryCount), 0);
    });
    const loanTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.goodsAmount), 0),
        { round: false },
      );
    });
    const deductionsTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.deductAmount), 0),
        { round: false },
      );
    });
    const otherTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.otherReceiptAmount), 0),
        { round: false },
      );
    });
    const settlementTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.actualSettleGoodsAmount), 0),
        { round: false },
      );
    });
    const frontPayTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.preReceiptAmount), 0),
        { round: false },
      );
    });
    const frecallLoansTotal = computed(() => {
      return formatFloat(
        props.list.reduce((total, current) => plus(total, current.receiptedAmount), 0),
        { round: false },
      );
    });
    return {
      exportExcel,
      exportImage,
      print,
      el,
      orderTotal,
      deliveryTotal,
      loanTotal,
      deductionsTotal,
      otherTotal,
      settlementTotal,
      frontPayTotal,
      frecallLoansTotal,
    };
  },
  render() {
    const Table: any = <table/>;
    const Td: any = <td
      style={{
        lineHeight: '18pt',
        borderTop: '0.5pt solid #333',
        borderLeft: '0.5pt solid #333',
        textAlign: 'center',
      }}
    />;
    return (
      <Teleport to="body">
        <div class="export_layout" ref='el'>
          <Table
            // border="true"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            style={{
              textAlign: 'center',
              border: 'none',
              fontSize: '12pt',
              // border: '0.5pt solid #333',
            }}
          >
            <colgroup style="width:50pt;"/>
            <colgroup style="width:100pt"/>
            <colgroup style="width:100pt"/>
            <colgroup style="width:50pt"/>
            <colgroup style="width:50pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:100pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:100pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <colgroup style="width:80pt"/>
            <thead>
              <tr>
                <th
                  style={{
                    border: 'none',
                    fontSize: '16pt',
                    fontWeight: 'normal',
                  }}
                  colspan={16}
                  rowspan={2}
                >{this.data.collectingAccount}</th>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <th
                  style={{
                    border: 'none',
                    textAlign: 'left',
                    lineHeight: '28pt',
                    fontWeight: 'normal',
                  }}
                  colspan={16}
                >客户名称：{this.data.customerName}</th>
              </tr>
              <tr>
                <th
                  style={{
                    border: 'none',
                    textAlign: 'left',
                    lineHeight: '28pt',
                    fontWeight: 'normal',
                  }}
                  colspan={16}
                >
                  对账周期：
                  {filters.formatTime(this.data.billStartTime, 'YYYY/MM/DD')}
                  -{filters.formatTime(this.data.billEndTime, 'YYYY/MM/DD')}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  账单金额：{this.data.billAmount}
                </th>
              </tr>
              <tr>
                <th colspan={16}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>序号</Td>
                <Td>制单号</Td>
                <Td>客户款号</Td>
                <Td>批次</Td>
                <Td>颜色</Td>
                <Td>订单数量</Td>
                <Td>发货数量</Td>
                <Td>结算单价</Td>
                <Td>总货款</Td>
                <Td>实际收货日期</Td>
                <Td>扣款明细</Td>
                <Td>其他收款</Td>
                <Td>实际结算贷款</Td>
                <Td>已收定金</Td>
                <Td>已回货款</Td>
                <Td
                  style={{
                    borderRight: '0.5pt solid #333',
                  }}
                >备注</Td>
              </tr>
              {this.list && this.list.map((v, i) => (
                <tr>
                  <Td>{i + 1}</Td>
                  <Td>{v.manufacturingOrderCode}</Td>
                  <Td>{v.customerStyleNumber}</Td>
                  <Td>{v.batchNo}</Td>
                  <Td>{v.color}</Td>
                  <Td>{v.orderCount}</Td>
                  <Td>{v.deliveryCount}</Td>
                  <Td>{v.settlePrice}</Td>
                  <Td>{v.goodsAmount}</Td>
                  <Td>{filters.formatTime(v.realReceiptDate, 'YYYY-MM-DD')}</Td>
                  {v.groupSize > 0 && <Td rowspan={ v.groupSize}>{v.deductAmount}</Td>}
                  {v.groupSize > 0 && <Td rowspan={ v.groupSize}>{v.otherReceiptAmount}</Td>}
                  {v.groupSize > 0 && <Td rowspan={ v.groupSize}>{v.actualSettleGoodsAmount}</Td>}
                  {v.groupSize > 0 && <Td rowspan={ v.groupSize}>{v.preReceiptAmount}</Td>}
                  {v.groupSize > 0 && <Td rowspan={ v.groupSize}>{v.receiptedAmount}</Td>}
                  <Td
                    style={{
                      borderRight: '0.5pt solid #333',
                    }}
                  >{v.remark}</Td>
                </tr>
              ))}
              <tr class="total">
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >合计</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.orderTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.deliveryTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.loanTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                ></Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.deductionsTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.otherTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.settlementTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.frontPayTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                  }}
                >{this.frecallLoansTotal}</Td>
                <Td
                  style={{
                    borderBottom: '0.5pt solid #333',
                    borderRight: '0.5pt solid #333',
                  }}
                ></Td>
              </tr>
              <tr>
                <Td
                  style="border:none;padding-top:10pt;"
                  colspan={16}
                ></Td>
              </tr>
              <tr>
                <Td
                  colspan={16}
                  style="border:none;text-align:right;padding-right: 200pt"
                >客户确认签字（盖章）：</Td>
              </tr>
              <tr>
                <Td
                  colspan={16}
                  style="border:none;text-align:right;padding-right: 200pt"
                >日期：</Td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Teleport>
    );
  },
});
</script>
<style lang="scss" scoped>
.export_layout{
  position: fixed;
  left: 10000px;
  top: 10000px;
  padding: 20px;
  width: 1400px;
}
</style>
