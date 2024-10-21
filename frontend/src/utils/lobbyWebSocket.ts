// import { Stomp } from '@stomp/stompjs';
// import { LobbyResponse } from '../types/lobby.type';
// import { CommentResponse } from '../types/comment.type';

// export const createLobbyUpdateWebSocket = (
//     lobbyId: number,
//     onLobbyUpdate: (updatedLobby: LobbyResponse) => void,
//     onNewComment: (comment: CommentResponse) => void
// ) => {
//     let client: any;

//     const connect = () => {
//         console.log('Attempting to connect to WebSocket...');
//         const socket = new WebSocket('ws://localhost:8080/ws'); 
//         client = Stomp.over(socket);

//         client.connect({}, () => {
//             console.log('Connected to WebSocket!');
//             const token = localStorage.getItem('accessToken');

//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             };

//             client.subscribe(`/topic/lobby/${lobbyId}`, (message: any) => {
//                 const updatedLobby = JSON.parse(message.body);
//                 onLobbyUpdate(updatedLobby);
//             });

//             client.subscribe(`/topic/lobby/${lobbyId}/comments`, (message: any) => {
//                 const newComment = JSON.parse(message.body);
//                 onNewComment(newComment);
//             });
//         }, (error: any) => {
//             console.error('WebSocket error:', error);
//             console.log('WebSocket error, reconnecting in 5 seconds...', error);
//             setTimeout(connect, 5000);  
//         });
//     };

//     connect();

//     return {
//         disconnect: () => {
//             if (client && client.connected) {
//                 client.disconnect(() => {
//                     console.log('Disconnected from WebSocket');
//                 });
//             }
//         }
//     };
// };
