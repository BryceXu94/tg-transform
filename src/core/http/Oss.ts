import { ISystemDomainMap } from '@/core/http/type';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';

interface FileUploadResponseItem {
  url: string;
}

class Oss {
  private domainMap: ISystemDomainMap | null;

  // oss 域名（oss 资源服务地址）
  public staticServer: typeof DOMAIN_SYSTEM_ENUM.tiangongOssServer;

  /**
   * 校验是否是url
   * @param {string} url
   * @return {boolean}
  */
  static isURI(url: string) {
    return /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/
      .test(url);
  }

  constructor(_domainMap?: ISystemDomainMap) {
    this.domainMap = _domainMap || null;
    this.staticServer = DOMAIN_SYSTEM_ENUM.tiangongOssServer;
  }

  setDomainMap(_domainMap: ISystemDomainMap) {
    this.domainMap = _domainMap;
  }

  get ossDomain() {
    if (!this.domainMap) {
      return null;
    }
    return this.domainMap[this.staticServer];
  }

  /**
   * 静态资源路径，追加 oss域名地址
   * @param {string} assetsPath
   * @return {string}
  */
  ossPrefix(assetsPath: string) {
    if (!this.ossDomain || !assetsPath || Oss.isURI(assetsPath)) return assetsPath;
    return `${this.ossDomain}${assetsPath[0] === '/' ? '' : '/'}${assetsPath}`;
  }

  removeOssPrefix(assetsPath: string = '') {
    if (!this.ossDomain || !assetsPath || !Oss.isURI(assetsPath)) return assetsPath;

    const path = assetsPath.replace(`${this.ossDomain}`, '');
    return path[0] === '/' ? path : `/${path}`;
  }

  mapFileUrl<T extends FileUploadResponseItem>(data: T[]) {
    if (Array.isArray(data)) {
      return data.map((item: T) => {
        return {
          ...item,
          ossPath: item.url,
          url: this.ossPrefix(item.url),
        };
      });
    }

    return data;
  }

  removeMapFileUrl<T extends FileUploadResponseItem>(data: T[]) {
    if (Array.isArray(data)) {
      return data.map((item: FileUploadResponseItem) => {
        item.url = this.removeOssPrefix(item.url);
        return item;
      });
    }

    return data;
  }

  deleteOssDomainAll<T>(content: T) {
    if (!this.ossDomain || !content) return content;

    try {
      const reg = new RegExp(`${this.ossDomain}`, 'g');
      const contentStr = JSON.stringify(content);
      return JSON.parse(contentStr.replace(reg, ''));
    } catch (e) {
      console.error('去除 oss 域名 error', e);
    }

    return content;
  }
}

export default Oss;
