
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/contexts/AuthContext";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  participants: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    job_title?: string;
    company?: string;
  }[];
}

class ChatService {
  /**
   * Initialize and subscribe to real-time chat updates
   * @param userId The current user's ID
   * @param onMessageReceived Callback function when a new message is received
   * @returns Cleanup function
   */
  subscribeToMessages(userId: string, onMessageReceived: (message: ChatMessage) => void) {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          // Format the payload into a ChatMessage object
          const message = payload.new as ChatMessage;
          onMessageReceived(message);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<string> {
    try {
      // First check if a conversation already exists between these users
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      if (fetchError) throw fetchError;

      if (existingConversations && existingConversations.length > 0) {
        const conversationIds = existingConversations.map(c => c.conversation_id);
        
        // Find conversations where the other user is also a participant
        const { data: sharedConversations, error: sharedError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', otherUserId)
          .in('conversation_id', conversationIds);
          
        if (sharedError) throw sharedError;
        
        // If a shared conversation exists, return its ID
        if (sharedConversations && sharedConversations.length > 0) {
          return sharedConversations[0].conversation_id;
        }
      }
      
      // No existing conversation found, create a new one
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert([{ created_by: currentUserId }])
        .select()
        .single();
        
      if (createError) throw createError;
      
      // Add both users as participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, user_id: currentUserId },
          { conversation_id: newConversation.id, user_id: otherUserId }
        ]);
        
      if (participantsError) throw participantsError;
      
      return newConversation.id;
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error);
      throw error;
    }
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, senderId: string, receiverId: string, content: string): Promise<ChatMessage> {
    try {
      // Insert the message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          { 
            conversation_id: conversationId, 
            sender_id: senderId,
            receiver_id: receiverId,
            content
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the conversation with the last message
      await supabase
        .from('conversations')
        .update({ 
          last_message: content, 
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
        
      // Create a notification for the recipient
      await supabase.from('notifications').insert([{
        recipient_id: receiverId,
        sender_id: senderId,
        type: 'new_message',
        content: content.length > 50 ? `${content.substring(0, 50)}...` : content,
        conversation_id: conversationId,
        is_read: false
      }]);
      
      return data as ChatMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      // Get all conversation IDs the user is part of
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);
        
      if (participationsError) throw participationsError;
      
      if (!participations || participations.length === 0) {
        return [];
      }
      
      const conversationIds = participations.map(p => p.conversation_id);
      
      // Get the actual conversations with their last messages
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id, created_at, updated_at, last_message, last_message_at')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
        
      if (conversationsError) throw conversationsError;
      
      if (!conversations) {
        return [];
      }
      
      // For each conversation, get the other participants
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const { data: participants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles:user_id (
                first_name,
                last_name,
                avatar_url,
                job_title,
                company
              )
            `)
            .eq('conversation_id', conversation.id);
            
          if (participantsError) throw participantsError;
          
          const formattedParticipants = participants?.map(p => ({
            user_id: p.user_id,
            first_name: p.profiles?.first_name,
            last_name: p.profiles?.last_name,
            avatar_url: p.profiles?.avatar_url,
            job_title: p.profiles?.job_title,
            company: p.profiles?.company
          })) || [];
          
          return {
            ...conversation,
            participants: formattedParticipants
          };
        })
      );
      
      return enrichedConversations as Conversation[];
    } catch (error) {
      console.error('Error in getConversations:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      // Get messages with sender information
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          created_at,
          senders:sender_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at');
        
      if (error) throw error;
      
      // Format the data to match the ChatMessage interface
      const formattedMessages = data?.map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
        sender: {
          first_name: msg.senders?.first_name,
          last_name: msg.senders?.last_name,
          avatar_url: msg.senders?.avatar_url
        }
      })) || [];
      
      return formattedMessages;
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      // Mark all messages from other users as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('read_at', null);
        
      // Mark related notifications as read
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('conversation_id', conversationId);
    } catch (error) {
      console.error('Error in markConversationAsRead:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
