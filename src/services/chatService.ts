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
    // First, check if a conversation already exists with both users as participants
    const { data: existingConversations, error: existingError } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants!inner(user_id)
      `)
      .or(`and(conversation_participants.user_id.eq.${user1Id},conversation_participants.user_id.eq.${user2Id})`)
      .limit(1);

    if (existingError) throw existingError;

    if (existingConversations && existingConversations.length > 0) {
      return existingConversations[0].id;
    }

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
      
    // Create a notification for the recipient
    try {
      await supabase.from('notifications').insert({
        recipient_id: receiverId,
        sender_id: senderId,
        type: 'new_message',
        content: content.length > 50 ? `${content.substring(0, 50)}...` : content,
        conversation_id: conversationId
      });
    } catch (notifError) {
      console.error("Failed to create message notification:", notifError);
    }

    return data;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data;
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        created_by,
        created_at,
        updated_at,
        last_message,
        last_message_at,
        conversation_participants!inner(user_id),
        conversation_participants(
          user_id
        )
      `)
      .contains('conversation_participants.user_id', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Get all participant IDs except the current user
    const participantIds = data
      .flatMap(conv => conv.conversation_participants)
      .map(p => p.user_id)
      .filter(id => id !== userId);

    // Fetch all profiles for these participants in a single query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, job_title, company')
      .in('id', [...new Set(participantIds)]);

    if (profilesError) throw profilesError;

    // Create a map of profiles by ID for quick lookup
    const profilesMap = (profilesData || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});

    // Format the conversations data to match the Conversation interface
    const conversations = data.map(conv => {
      // Get all participants except the current user
      const participants = conv.conversation_participants
        .filter(p => p.user_id !== userId)
        .map(p => profilesMap[p.user_id] || null)
        .filter(Boolean);

      return {
        id: conv.id,
        created_by: conv.created_by,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        last_message: conv.last_message,
        last_message_at: conv.last_message_at,
        participants: participants
      };
    });

    return conversations;
  }

  /**
   * Mark all messages in a conversation as read for a specific user
   */
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', userId)
      .is('read_at', null);

    if (error) throw error;
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

  /**
   * Subscribe to all new messages for a user
   */
  subscribeToMessages(
    userId: string,
    onMessageReceived: (message: ChatMessage) => void
  ) {
    const channel = supabase
      .channel(`user_messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
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

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .is('read_at', null);

    if (error) throw error;

    return count || 0;
  }
}

export const chatService = new ChatService();
