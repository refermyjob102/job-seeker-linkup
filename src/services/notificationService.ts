import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string;
  type: 'referral_request' | 'referral_update' | 'new_message' | 'system';
  content: string;
  is_read: boolean;
  created_at: string;
  referral_id?: string;
  conversation_id?: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export type NotificationFilter = 'all' | 'referral' | 'message' | 'system' | 'unread';

class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(
    recipientId: string, 
    senderId: string, 
    type: Notification['type'], 
    content: string,
    additionalData?: { referral_id?: string; conversation_id?: string }
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        sender_id: senderId,
        type,
        content,
        ...additionalData
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  }

  /**
   * Subscribe to new notifications
   */
  subscribeToNotifications(
    userId: string, 
    onNotificationReceived: (notification: Notification) => void
  ) {
    const channel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          onNotificationReceived(notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(userId: string, filter: NotificationFilter = 'all'): Promise<Notification[]> {
    try {
      // Start building the query
      let query = supabase
        .from('notifications')
        .select(`
          id,
          recipient_id,
          sender_id,
          type,
          content,
          is_read,
          created_at,
          referral_id,
          conversation_id,
          senders:sender_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      // Apply filter if not 'all'
      if (filter === 'referral') {
        query = query.or('type.eq.referral_request,type.eq.referral_update');
      } else if (filter === 'message') {
        query = query.eq('type', 'new_message');
      } else if (filter === 'system') {
        query = query.eq('type', 'system');
      } else if (filter === 'unread') {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format the data to match the Notification interface
      const formattedNotifications = data?.map(notif => ({
        id: notif.id,
        recipient_id: notif.recipient_id,
        sender_id: notif.sender_id,
        type: notif.type as any,
        content: notif.content,
        is_read: notif.is_read,
        created_at: notif.created_at,
        referral_id: notif.referral_id,
        conversation_id: notif.conversation_id,
        sender: notif.senders ? {
          first_name: notif.senders.first_name,
          last_name: notif.senders.last_name,
          avatar_url: notif.senders.avatar_url
        } : undefined
      })) || [];
      
      return formattedNotifications;
    } catch (error) {
      console.error('Error in getNotifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      throw error;
    }
  }

  /**
   * Get the count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
