export interface ErrorResponse {
  errors: string[];
  error_type?: string;
}

export interface Topic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  views: number;
  like_count: number;
  created_at: string;
  last_posted_at?: string;
  pinned: boolean;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  has_summary: boolean;
  category_id?: number;
  posters: Poster[];
}

export interface Poster {
  user_id: number;
  description: string;
  extras?: string;
  primary_group_id?: number;
  flair_group_id?: number;
}

export interface LatestResponse {
  topic_list: TopicList;
  users: User[];
}

export interface TopicList {
  topics: Topic[];
}

export interface TopicResponse {
  post_stream: PostStream;
  id: number;
  title?: string;
  posts_count?: number;
  category_id?: number;
}

export interface PostStream {
  posts: Post[];
  stream: number[];
}

export interface Post {
  id: number;
  username: string;
  created_at: string;
  cooked: string;
  raw?: string;
  post_number: number;
  post_type: number;
  reply_count: number;
  quote_count: number;
  reads: number;
  score: number;
  topic_id: number;
  yours?: boolean;
  like_count?: number;
  actions_summary?: ActionSummary[];
}

export interface ActionSummary {
  id: number;
  count?: number;
  acted?: boolean;
  can_act?: boolean;
}

export interface User {
  id: number;
  username: string;
  name?: string;
  avatar_template: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  text_color: string;
  slug: string;
  topic_count: number;
  description?: string;
  description_text?: string;
  has_children?: boolean;
  parent_category_id?: number;
}

export interface CategoryList {
  category_list: CategoryListData;
}

export interface CategoryListData {
  categories: Category[];
}

export interface ChatChannel {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  chatable_id?: number;
  chatable_type?: string;
  memberships_count?: number;
  status?: string;
  allow_channel_wide_mentions?: boolean;
  chatable?: unknown;
  chatable_url?: string;
  current_user_membership?: unknown;
  icon_upload_url?: string;
  last_message?: unknown;
  meta?: unknown;
  threading_enabled?: boolean;
  unicode_title?: string;
}

export interface ChatChannelsResponse {
  public_channels?: ChatChannel[];
  direct_message_channels?: ChatChannel[];
  channels: ChatChannel[];
  meta?: unknown;
  tracking?: unknown;
  global_presence_channel_state?: unknown;
  unread_thread_overview?: unknown;
}

export interface ChatMessage {
  id: number;
  message: string;
  cooked: string;
  created_at: string;
  user: User;
  chat_channel_id: number;
  deleted_at?: string;
  excerpt?: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  meta: ChatMessagesMeta;
}

export interface ChatMessagesMeta {
  can_load_more_past?: boolean;
  can_load_more_future?: boolean;
}

export interface CreateMessageResponse {
  success: string;
  message_id: number;
}

export interface CreatePostResponse {
  id: number;
  name?: string;
  username: string;
  avatar_template: string;
  created_at: string;
  cooked: string;
  post_number: number;
  post_type: number;
  updated_at: string;
  reply_count: number;
  reply_to_post_number?: number;
  quote_count: number;
  topic_id: number;
  topic_slug: string;
}

export interface Notification {
  id: number;
  user_id: number;
  notification_type: number;
  read: boolean;
  high_priority: boolean;
  created_at: string;
  post_number?: number;
  topic_id?: number;
  slug?: string;
  fancy_title?: string;
  data: NotificationData;
  acting_user_avatar_template?: string;
  acting_user_name?: string;
}

export interface NotificationData {
  topic_title?: string;
  original_username?: string;
  display_username?: string;
  display_name?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}
