<!--
 * @Descripttion: 详情基础块-模版
 * @Author: weitongxue
-->
<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { IEncryptionData } from '@/components/encryption';

interface IItem {
  label: string;
  value: string;
  type?: string;
  isHidden?: boolean; // 是否隐藏
  imgList?: {url: string;}[];
  isRow?: boolean; // 是否单独一行
  encryption?: IEncryptionData;
}

export default defineComponent({
  name: 'DetailTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array as PropType<IItem[]>,
      default: () => [],
    },
  },

  render() {
    return (
      <div>
        {/** 标题 */}
        <div class="basic-title">{this.title}</div>
        {/** 主体 */}
        <el-form
          labelWidth={140}
          class="margin-top-20"
        >
          {this.data.filter(info => info.isHidden !== true).map((item) => {
            return item.type === 'image' && (
              <el-form-item label={`${item.label}：`}>
                {item.imgList?.[0]?.url && <el-image
                  style="width: 100px; height: 100px"
                  src={item.imgList?.[0]?.url}
                  preview-src-list={item.imgList?.map(info => info.url)}
                >
                </el-image>}
              </el-form-item>
            );
          })}
          <responsive-row
            class="basic-content"
            col={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}>
            {this.data.filter(info => info.isHidden !== true).map((item) => {
              return item.type !== 'image' && !item?.isRow && (
                <el-form-item label={`${item.label}：`}>
                  {item?.encryption ? (
                    <encryption
                      data={item.encryption}
                    ></encryption>
                  ) : item.value}
                </el-form-item>
              );
            })}
          </responsive-row>
          {this.data.filter(info => info.isHidden !== true).map((item) => {
            return item?.isRow && (
                <el-form-item label={`${item.label}：`}>
                  <div>{item.value}</div>
                </el-form-item>
            );
          })}
        </el-form>
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.basic-title{
  display: flex;
  align-items: center;
  position: relative;
  font-weight: bold;
  padding-left: 10px;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 3px;
    height: 16px;
    background-color: var(--el-color-primary);
    transform: translateY(-50%);
  }
}
.basic-content {
  padding: 20px 0px 0px;
}
</style>
