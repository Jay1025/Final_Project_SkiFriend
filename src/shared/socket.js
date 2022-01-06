import SockJS from "sockjs-client";
import Stomp from "stompjs";

const accessToken = document.cookie.split("=")[1];
const token = { Authorization: `${accessToken}` };

const sock = new SockJS("http://3.34.52.2:8080/ws-stomp");
const stomp = Stomp.over(sock);

export const socket = {
  chatConnect: (token) => stomp.connect(token),
  chatDisconnect: () => stomp.disconnect(),
  chatRoomSubscribe: (roomId) =>
    stomp.subscribe(`/sub/chat/room/${roomId}`, token),

  chatSendMSG: (content) => stomp.send("/pub/chat/message", token, content),
};
