
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";

export interface ChatMessage {
  id?: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
  read_at?: string | null;
}

export interface Conversation {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  participants?: Profile[];
}

class ChatService {
  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(user1Id: string, user2Id: string): Promise<string> {
    // First, check if a conversation already exists
    const { data: existingConversations, error: existingError } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants!inner(user_id)
      `)
      .eq('conversation_participants.user_id', user1Id)
      .eq('conversation_participants.user_id', user2Id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') throw existingError;

    if (existingConversations?.id) return existingConversations.id;

    // If no conversation exists, create a new one
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({ created_by: user1Id })
      .select('id')
      .single();

    if (conversationError) throw conversationError;

    // Add participants to the conversation
    const participants = [
      { conversation_id: newConversation.id, user_id: user1Id },
      { conversation_id: newConversation.id, user_id: user2Id }
    ];

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return newConversation.id;
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string, 
    senderId: string, 
    receiverId: string, 
    content: string
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation last message
    await supabase
      .from('conversations')
      .update({
        last_message: content,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    return data;
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
  }

  /**
   * Subscribe to real-time messages in a conversation
   */
  subscribeToConversation(
    conversationId: string, 
    onMessageReceived: (message: ChatMessage) => void
  ) {
    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          onMessageReceived(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const chatService = new ChatService();
