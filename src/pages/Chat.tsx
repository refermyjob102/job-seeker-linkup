
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { chatService, ChatMessage, Conversation } from "@/services/chatService";
import { Skeleton } from "@/components/ui/skeleton";

const formatInitials = (name?: string) => {
  if (!name) return "??";
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Chat = () => {
  const { id: contactId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSubscriptionRef = useRef<() => void>();
  const otherParticipant = currentConversation?.participants.find(
    p => p.user_id !== user?.id
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const loadedConversations = await chatService.getConversations(user.id);
        setConversations(loadedConversations);
        
        // If we have a contact ID from the URL, find or create a conversation with them
        if (contactId && contactId !== 'inbox') {
          try {
            // Get or create conversation with this contact
            const conversationId = await chatService.getOrCreateConversation(user.id, contactId);
            
            // Find this conversation in our loaded conversations or reload it
            let targetConversation = loadedConversations.find(c => c.id === conversationId);
            
            if (!targetConversation) {
              // If we just created a new conversation, reload all conversations
              const updatedConversations = await chatService.getConversations(user.id);
              setConversations(updatedConversations);
              targetConversation = updatedConversations.find(c => c.id === conversationId);
            }
            
            if (targetConversation) {
              setCurrentConversation(targetConversation);
              // Load messages for this conversation
              const conversationMessages = await chatService.getMessages(conversationId);
              setMessages(conversationMessages);
              
              // Mark messages as read
              await chatService.markConversationAsRead(conversationId, user.id);
            }
          } catch (error) {
            console.error('Error initializing conversation with contact:', error);
            toast({
              title: "Error",
              description: "Failed to open conversation with this contact.",
              variant: "destructive",
            });
          }
        } else if (loadedConversations.length > 0) {
          // If no contact ID but we have conversations, open the first one
          setCurrentConversation(loadedConversations[0]);
          const conversationMessages = await chatService.getMessages(loadedConversations[0].id);
          setMessages(conversationMessages);
          
          // Mark messages as read
          await chatService.markConversationAsRead(loadedConversations[0].id, user.id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load your conversations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [user, contactId, toast]);
  
  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to new messages
    const unsubscribe = chatService.subscribeToMessages(
      user.id,
      (newMessage) => {
        // If this message is for our current conversation, add it to the messages list
        if (currentConversation && newMessage.conversation_id === currentConversation.id) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Mark message as read
          chatService.markConversationAsRead(currentConversation.id, user.id);
        }
        
        // Update the conversations list with the new message
        setConversations(prevConversations => 
          prevConversations.map(conv => {
            if (conv.id === newMessage.conversation_id) {
              return {
                ...conv,
                last_message: newMessage.content,
                last_message_at: newMessage.created_at,
                updated_at: newMessage.created_at
              };
            }
            return conv;
          }).sort((a, b) => {
            // Sort by updated_at (most recent first)
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA;
          })
        );
        
        // Show notification for new message if not from the current conversation
        if (currentConversation && newMessage.conversation_id !== currentConversation.id) {
          // Find the conversation to get the sender's name
          const conversation = conversations.find(c => c.id === newMessage.conversation_id);
          const sender = conversation?.participants.find(p => p.user_id === newMessage.sender_id);
          const senderName = sender ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim() : 'Someone';
          
          toast({
            title: `New message from ${senderName}`,
            description: newMessage.content.length > 50 
              ? `${newMessage.content.substring(0, 50)}...` 
              : newMessage.content,
          });
        }
      }
    );
    
    chatSubscriptionRef.current = unsubscribe;
    
    return () => {
      // Cleanup subscription on unmount
      if (chatSubscriptionRef.current) {
        chatSubscriptionRef.current();
      }
    };
  }, [user, conversations, currentConversation, toast]);
  
  // Handle switching conversations
  const handleSelectConversation = async (conversation: Conversation) => {
    if (!user) return;
    
    setCurrentConversation(conversation);
    setLoading(true);
    
    try {
      // Load messages for this conversation
      const conversationMessages = await chatService.getMessages(conversation.id);
      setMessages(conversationMessages);
      
      // Mark messages as read
      await chatService.markConversationAsRead(conversation.id, user.id);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages for this conversation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation || !user || !otherParticipant) return;
    
    const trimmedMessage = message.trim();
    setMessage("");
    setSendingMessage(true);
    
    try {
      const newMessage = await chatService.sendMessage(
        currentConversation.id,
        user.id,
        otherParticipant.user_id,
        trimmedMessage
      );
      
      // Add the new message to our messages array
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Update the conversation in our list
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === currentConversation.id) {
            return {
              ...conv,
              last_message: trimmedMessage,
              last_message_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          return conv;
        }).sort((a, b) => {
          // Sort by updated_at (most recent first)
          const dateA = new Date(a.updated_at).getTime();
          const dateB = new Date(b.updated_at).getTime();
          return dateB - dateA;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const getParticipantName = (participant: typeof otherParticipant) => {
    if (!participant) return "Unknown";
    return `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || "Unknown";
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat list */}
        <div className="col-span-1 bg-card rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Recent Conversations</h2>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full mr-2 bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          </div>
          
          {loading && !conversations.length ? (
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Info className="mx-auto h-8 w-8 mb-2 text-muted-foreground/70" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a chat with someone to begin</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const participant = conv.participants.find(p => p.user_id !== user?.id);
                  return (
                    <div 
                      key={conv.id}
                      className={`p-4 hover:bg-muted cursor-pointer ${currentConversation?.id === conv.id ? 'bg-muted' : ''}`}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={participant?.avatar_url} alt={getParticipantName(participant)} />
                          <AvatarFallback>{formatInitials(getParticipantName(participant))}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h3 className="font-medium truncate">{getParticipantName(participant)}</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {conv.last_message_at ? formatDate(conv.last_message_at) : formatDate(conv.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {participant?.job_title}{participant?.company ? ` • ${participant.company}` : ''}
                          </p>
                          <p className="text-sm truncate">{conv.last_message || 'Start a conversation'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="col-span-1 md:col-span-2">
          {currentConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={otherParticipant?.avatar_url} alt={getParticipantName(otherParticipant)} />
                    <AvatarFallback>{formatInitials(getParticipantName(otherParticipant))}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{getParticipantName(otherParticipant)}</CardTitle>
                    <CardDescription>
                      {otherParticipant?.job_title}{otherParticipant?.company ? ` • ${otherParticipant.company}` : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto space-y-4 pt-0 pb-4 mb-auto">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <Skeleton className={`h-16 w-2/3 rounded-lg ${i % 2 === 0 ? 'rounded-br-none' : 'rounded-bl-none'}`} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <div>
                      <Info className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
                      <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                      <p className="text-muted-foreground">Send a message to start the conversation</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user?.id;
                    
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
                          <p>{msg.content}</p>
                          <div className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
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
                    disabled={sendingMessage}
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || sendingMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center text-muted-foreground p-8">
                <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p>Select a conversation from the list to start chatting</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
