function delay(delayInMilliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
}

export default delay;
