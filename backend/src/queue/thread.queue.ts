type ThreadImageQueueItem = {
  source: "thread" | "reply";
  sourceId: string;
  imageFileName: string;
};

const imageQueue: ThreadImageQueueItem[] = [];

export const enqueueThreadImage = (item: ThreadImageQueueItem) => {
  imageQueue.push(item);
};

export const startThreadQueueWorker = () => {
  setInterval(() => {
    const nextItem = imageQueue.shift();
    if (!nextItem) return;

    // Simulasi background processing image.
    console.log(
      `[queue] processing image for ${nextItem.source} ${nextItem.sourceId}: ${nextItem.imageFileName}`,
    );
  }, 1500);
};
