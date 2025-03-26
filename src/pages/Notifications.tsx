import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Briefcase, Check, FileSpreadsheet, MessageSquare, User } from "lucide-react";
import { notificationService, Notification, NotificationFilter } from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationFilter>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationSubscriptionRef = useRef<() => void>();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedNotifications = await notificationService.getNotifications(user.id, activeTab);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user, activeTab, toast]);
  
  // Subscribe to new notifications
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to new notifications
    const unsubscribe = notificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Add the new notification to our state
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        
        // Show toast for the new notification
        toast({
          title: getNotificationTypeTitle(newNotification),
          description: newNotification.content.length > 100 
            ? `${newNotification.content.substring(0, 100)}...` 
            : newNotification.content,
        });
      }
    );
    
    notificationSubscriptionRef.current = unsubscribe;
    
    return () => {
      // Cleanup subscription on unmount
      if (notificationSubscriptionRef.current) {
        notificationSubscriptionRef.current();
      }
    };
  }, [user, toast]);

  const getUnreadCount = (filter: NotificationFilter) => {
    return notifications.filter(notification => 
      !notification.is_read && (
        filter === 'all' || 
        (filter === 'referral' && (notification.type === 'referral_request' || notification.type === 'referral_update')) ||
        (filter === 'message' && notification.type === 'new_message') ||
        (filter === 'system' && notification.type === 'system')
      )
    ).length;
  };

  const renderBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <Badge variant="secondary" className="ml-2">
        {count}
      </Badge>
    );
  };
  
  const getNotificationTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'referral_request':
      case 'referral_update':
        return <FileSpreadsheet className="h-5 w-5 text-primary" />;
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-primary" />;
      case 'system':
        return <Bell className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };
  
  const getNotificationTypeTitle = (notification: Notification) => {
    switch (notification.type) {
      case 'referral_request':
        return 'New Referral Request';
      case 'referral_update':
        return 'Referral Update';
      case 'new_message':
        return 'New Message';
      case 'system':
        return 'System Notification';
      default:
        return 'Notification';
    }
  };
  
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id);
        
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Navigate based on notification type
    if (notification.type === 'new_message' && notification.conversation_id) {
      navigate(`/app/chat/${notification.conversation_id}`);
    } else if ((notification.type === 'referral_request' || notification.type === 'referral_update') && notification.referral_id) {
      navigate(`/app/referrals?id=${notification.referral_id}`);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, is_read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        {getUnreadCount('all') > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationFilter)}>
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <TabsList className="mb-6 flex w-auto min-w-full justify-start sm:justify-center">
            <TabsTrigger value="all" className="flex-shrink-0">
              All {renderBadge(getUnreadCount("all"))}
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex-shrink-0">
              Referrals {renderBadge(getUnreadCount("referral"))}
            </TabsTrigger>
            <TabsTrigger value="message" className="flex-shrink-0">
              Messages {renderBadge(getUnreadCount("message"))}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex-shrink-0">
              System {renderBadge(getUnreadCount("system"))}
            </TabsTrigger>
            {getUnreadCount('all') > 0 && (
              <TabsTrigger value="unread" className="flex-shrink-0">
                Unread {renderBadge(getUnreadCount("all"))}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg border">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : notifications.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/20 transition-colors ${notification.is_read ? '' : 'bg-muted/30 border-primary/20'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`bg-primary/10 p-2 h-10 w-10 rounded-full flex items-center justify-center ${notification.is_read ? 'opacity-70' : ''}`}>
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm ${notification.is_read ? '' : 'font-medium'}`}>{notification.content}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</p>
                      </div>
                      {!notification.is_read && (
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20">New</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-6">
                  <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You don't have any {activeTab === "all" ? "" : activeTab} notifications at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
