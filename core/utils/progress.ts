import ProgressBar from 'progress';


class Progress {
  progress: ProgressBar|null = null

  total = 0;
  curCount = 0;
  setTotal(count: number) {
    this.total = count;
    this.progress = new ProgressBar('代码转换中 [:bar] :current/:total :percent', {
      total: count,
      width: 20,
    })
  }
  add() {
    this.curCount += 1;
    this.progress?.tick();
  }
}

export const progress = new Progress();

