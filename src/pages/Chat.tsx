
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock chat data
const mockChats = [
  {
    id: "1",
    userId: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    company: "Google",
    jobTitle: "Senior Developer",
    lastMessage: "Thanks for reaching out! I'd be happy to refer you.",
    timestamp: new Date(2023, 5, 15, 14, 30),
    messages: [
      {
        id: "m1",
        sender: "2",
        text: "Hi there! I noticed you're interested in a referral at Google?",
        timestamp: new Date(2023, 5, 15, 12, 15),
      },
      {
        id: "m2",
        sender: "1",
        text: "Yes, I've been learning React for a while and saw you're a Senior Developer there. Would you consider referring me?",
        timestamp: new Date(2023, 5, 15, 12, 20),
      },
      {
        id: "m3",
        sender: "2",
        text: "I'd be happy to look at your profile. Have you applied to any specific positions?",
        timestamp: new Date(2023, 5, 15, 12, 30),
      },
      {
        id: "m4",
        sender: "1",
        text: "I'm interested in the Frontend Developer role in the Cloud division.",
        timestamp: new Date(2023, 5, 15, 12, 35),
      },
      {
        id: "m5",
        sender: "2",
        text: "Thanks for reaching out! I'd be happy to refer you.",
        timestamp: new Date(2023, 5, 15, 14, 30),
      },
    ],
  },
  {
    id: "2",
    userId: "3",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    company: "Meta",
    jobTitle: "Product Manager",
    lastMessage: "I'll submit your referral this week.",
    timestamp: new Date(2023, 5, 14, 9, 15),
    messages: [
      {
        id: "m1",
        sender: "3",
        text: "Hello! I saw your request for a Meta referral.",
        timestamp: new Date(2023, 5, 14, 8, 45),
      },
      {
        id: "m2",
        sender: "1",
        text: "Hi Alex! Yes, I'm very interested in the Product Designer role at Meta.",
        timestamp: new Date(2023, 5, 14, 8, 50),
      },
      {
        id: "m3",
        sender: "3",
        text: "I'll submit your referral this week.",
        timestamp: new Date(2023, 5, 14, 9, 15),
      },
    ],
  },
  {
    id: "3",
    userId: "4",
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    company: "Apple",
    jobTitle: "UX Designer",
    lastMessage: "Could you share your portfolio with me?",
    timestamp: new Date(2023, 5, 10, 15, 45),
    messages: [
      {
        id: "m1",
        sender: "4",
        text: "Thanks for reaching out about a referral at Apple.",
        timestamp: new Date(2023, 5, 10, 15, 30),
      },
      {
        id: "m2",
        sender: "1",
        text: "I appreciate you responding! I'm really interested in joining the UX team at Apple.",
        timestamp: new Date(2023, 5, 10, 15, 40),
      },
      {
        id: "m3",
        sender: "4",
        text: "Could you share your portfolio with me?",
        timestamp: new Date(2023, 5, 10, 15, 45),
      },
    ],
  },
];

const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [chats, setChats] = useState(mockChats);
  const [currentChat, setCurrentChat] = useState<typeof mockChats[0] | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      const chat = mockChats.find(chat => chat.id === id);
      if (chat) {
        setCurrentChat(chat);
      }
    } else if (mockChats.length > 0) {
      setCurrentChat(mockChats[0]);
    }
  }, [id]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentChat || !user) return;
    
    const newMessage = {
      id: `m${currentChat.messages.length + 1}`,
      sender: user.id,
      text: message,
      timestamp: new Date(),
    };
    
    const updatedChat = {
      ...currentChat,
      lastMessage: message,
      timestamp: new Date(),
      messages: [...currentChat.messages, newMessage],
    };
    
    setChats(chats.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ));
    setCurrentChat(updatedChat);
    setMessage("");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat list */}
        <div className="col-span-1 bg-card rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Recent Conversations</h2>
          </div>
          <div className="divide-y">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-4 hover:bg-muted cursor-pointer ${currentChat?.id === chat.id ? 'bg-muted' : ''}`}
                onClick={() => setCurrentChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{formatDate(chat.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.company} • {chat.jobTitle}</p>
                    <p className="text-sm truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="col-span-1 md:col-span-2">
          {currentChat ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
                    <AvatarFallback>{currentChat.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{currentChat.name}</CardTitle>
                    <CardDescription>{currentChat.company} • {currentChat.jobTitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto space-y-4 pt-0 pb-4 mb-auto">
                {currentChat.messages.map((msg) => {
                  const isCurrentUser = msg.sender === user?.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-lg p-3 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              
              <CardFooter className="p-3 border-t">
                <form 
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center text-muted-foreground">
                <p>Select a conversation to start chatting</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
