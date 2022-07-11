class Queue {
  max = 50;
  curConnection = 0;
  queues: any = [];
  // 进队列
  enqueue(queue: any) {
    if (this.curConnection >= this.max) {
      this.queues.push(queue);
    } else {
      queue();
    }
  }
  // 出队列
  dequeue() {
    this.queues.shift();
  }
  peek() {
    return this.queues[0];
  }
  run(cb: (...args: unknown[]) => any) {
    return new Promise(async (resolve, reject) => {
      const curQueueCb = async () => {
        this.curConnection++;
        setTimeout(async () => {
          // 10
          await cb()
          this.curConnection--;
          resolve(true);
          if (this.curConnection < this.max && this.queues.length) {
            const queue = this.peek();
            this.dequeue();
            queue();
          }
        }, 1000);
      }
      this.enqueue(curQueueCb);
    })
  }
}

export const queue = new Queue();