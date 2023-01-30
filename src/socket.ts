import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import log from "./logger";

module.exports = {
  start: function (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    io.on("connection", function (socket) {
      socket.on("message", function (message) {
        log.log("info", message.value);
      });
    });
  },
};
