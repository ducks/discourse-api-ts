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

// Search

export interface SearchResponse {
  posts: SearchPost[];
  topics: SearchTopic[];
  users: SearchUser[];
  categories: Category[];
  grouped_search_result: GroupedSearchResult;
}

export interface SearchPost {
  id: number;
  username: string;
  avatar_template: string;
  created_at: string;
  like_count: number;
  blurb: string;
  post_number: number;
  topic_title_headline: string;
  topic_id: number;
}

export interface SearchTopic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  views: number;
  like_count: number;
  created_at: string;
  category_id?: number;
  tags?: string[];
  has_accepted_answer?: boolean;
}

export interface SearchUser {
  id: number;
  username: string;
  name?: string;
  avatar_template: string;
}

export interface GroupedSearchResult {
  more_posts?: boolean;
  more_users?: boolean;
  more_categories?: boolean;
  term: string;
  search_log_id?: number;
  more_full_page_results?: boolean;
  can_create_topic?: boolean;
  post_ids: number[];
  user_ids: number[];
  category_ids: number[];
}

// Users

export interface UserResponse {
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  username: string;
  name?: string;
  avatar_template: string;
  title?: string;
  created_at: string;
  last_posted_at?: string;
  last_seen_at?: string;
  trust_level: number;
  moderator: boolean;
  admin: boolean;
  post_count: number;
  topics_entered: number;
  posts_read_count: number;
  days_visited: number;
  time_read: number;
  likes_given: number;
  likes_received: number;
  badge_count: number;
  bio_raw?: string;
  bio_cooked?: string;
  bio_excerpt?: string;
  website?: string;
  website_name?: string;
  location?: string;
  groups?: UserGroup[];
  featured_user_badge_ids?: number[];
  invited_by?: User;
}

export interface UserGroup {
  id: number;
  name: string;
  display_name: string;
  automatic: boolean;
  primary: boolean;
  title?: string;
  flair_url?: string;
  flair_bg_color?: string;
  flair_color?: string;
}

export interface UserActionsResponse {
  user_actions: UserAction[];
}

export interface UserAction {
  action_type: number;
  created_at: string;
  excerpt: string;
  acting_username: string;
  post_id?: number;
  post_number?: number;
  topic_id: number;
  slug: string;
  title: string;
  category_id?: number;
  username: string;
  name?: string;
  avatar_template: string;
}

export interface DirectoryResponse {
  directory_items: DirectoryItem[];
  meta: DirectoryMeta;
}

export interface DirectoryItem {
  id: number;
  likes_received: number;
  likes_given: number;
  topics_entered: number;
  topic_count: number;
  post_count: number;
  posts_read: number;
  days_visited: number;
  user: User;
}

export interface DirectoryMeta {
  last_updated_at: string;
  total_rows_directory_items: number;
}

// Topic management

export interface TopicStatusResponse {
  success: string;
  topic_status_update?: unknown;
}
