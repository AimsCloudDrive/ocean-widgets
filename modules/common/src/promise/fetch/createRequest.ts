import { OcPromise } from "../OcPromise";
export function createRequest(
  url: string,
  option: Parameters<typeof fetch>[1]
) {
  const controller = new AbortController();
  option = option || {};
  if (option.signal) {
    option.signal.addEventListener("abort", () => controller.abort());
  }
  option.signal = controller.signal;
  const promise = new OcPromise<Response>((resolve, reject) => {
    fetch(url, option).then(resolve, reject);
  });
  promise.canceled(() => controller.abort());
  return promise;
}
