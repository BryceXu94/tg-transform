import fsPromise from 'fs/promise';
import path from 'path';
import { vueParser } from '../parser/vue';
async function readFiles(path) {
    const files = await fsPromise.readdir(path);
    files.forEach(async (fileName) => {
        const suffix = fileName.split('.').pop();
        let parser = '';
        switch (suffix) {
            case 'ts':
                parser = 'babel-ts';
                break;
            case 'js':
                parser = 'babel';
                break;
            case 'vue':
                {
                    const code = await fsPromise.readFile(`${path}/${fileName}`, {
                        encoding: 'utf-8'
                    });
                    const outputCode = vueParser.parse(code);
                    console.log(outputCode);
                    parser = 'vue';
                }
                break;
            default:
                break;
        }
    });
}
readFiles(path.join(__dirname, '../../template'));
//# sourceMappingURL=index.js.map