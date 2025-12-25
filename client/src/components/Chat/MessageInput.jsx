import React, { useState } from 'react';
import axios from 'axios';
import { AttachmentIcon, EmojiIcon, SendIcon } from '../UI/Icons';

const ENDPOINT = 'http://localhost:5000';

const MessageInput = ({ activeChat, currentUser, socket, setMessages }) => {
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (!newMessage || loading) return;

            setLoading(true);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                };

                const body = {
                    content: newMessage,
                    chatId: activeChat.id,
                };

                setNewMessage(''); 

                const { data } = await axios.post(`${ENDPOINT}/api/message`, body, config);

                socket.emit("new message", data);

                setMessages(prevMessages => [...prevMessages, {
                    id: data._id,
                    content: data.content,
                    isSender: data.sender._id === currentUser._id,
                    time: new Date(data.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                }]);

            } catch (error) {
                console.error("Failed to send message:", error);
                setNewMessage(newMessage); 
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl shadow-inner">
                <AttachmentIcon className="w-6 h-6 text-gray-400 hover:text-purple-600 cursor-pointer" />
                <input
                    type="text"
                    placeholder="Type a message here..."
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={sendMessage} 
                    disabled={loading}
                />
                <EmojiIcon className="w-6 h-6 text-gray-400 hover:text-purple-600 cursor-pointer" />
                <button
                    className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || loading}
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;

