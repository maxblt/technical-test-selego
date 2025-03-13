import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";

import api from "../../services/api";
import Loader from "../../components/loader";
import toast from "react-hot-toast";
import { formatDateWithTime } from "../../utils";

export default function ProjectChat({ project }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    if (project?._id) {
      fetchMessages();
    }
  }, [project]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) return <Loader />;

  return (
    <div className="w-full bg-[#ffffff] border border-[#E5EAEF] rounded-[16px] overflow-hidden p-4">
      <div className="flex justify-between px-3 pb-2 border-b border-[#E5EAEF] mb-4">
        <span className="text-[18px] text-[#212325] font-semibold">Project chat</span>
      </div>

      <div className="chat-messages h-[400px] overflow-y-auto mb-4 p-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className={`mb-4 flex ${message.userId === user._id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${message.userId === user._id ? "bg-[#0560FD] text-white" : "bg-[#F5F7F9] text-[#212325]"} rounded-[16px] p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <img src={message.userAvatar} alt={message.userName} className="w-6 h-6 rounded-full" />
                  <span className="font-medium text-sm">{message.userName}</span>
                  <span className="text-xs opacity-70">{formatDateWithTime(message.created_at)}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                {message.userId === user._id && (
                  <div className="text-right mt-1">
                    <button onClick={() => handleDeleteMessage(message._id)} className="text-xl hover:text-red-500">
                      <MdDeleteForever />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 border border-[#E5EAEF] rounded-[16px] px-4 py-2 focus:outline-none focus:border-[#0560FD]"
        />
        <button type="submit" disabled={!newMessage.trim()} className="bg-[#0560FD] text-white rounded-[16px] px-4 py-2 disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function fetchMessages() {
    try {
      const { data, ok } = await api.get(`/message/project/${project._id}`);
      if (ok) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat messages");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { ok, data } = await api.post("/message", {
        projectId: project._id,
        content: newMessage.trim(),
      });

      if (ok) {
        setMessages([...messages, data]);
        setNewMessage("");
        toast.success("Message sent!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  }

  async function handleDeleteMessage(messageId) {
    try {
      const response = await api.remove(`/message/${messageId}`);
      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== messageId));
        toast.success("Message deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  }
}
