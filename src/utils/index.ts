import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export function sendDataSocket(
  event: string,
  data: any,
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): any {
  io.sockets.emit(event, data);
}
