import { ApiError, RequestError } from "./error.js";
import type {
  CategoryList,
  Category,
  ChatChannelsResponse,
  ChatMessagesResponse,
  CreateMessageResponse,
  CreatePostResponse,
  DirectoryResponse,
  ErrorResponse,
  LatestResponse,
  NotificationsResponse,
  Post,
  SearchResponse,
  TopicResponse,
  TopicStatusResponse,
  UserActionsResponse,
  UserResponse,
} from "./types.js";

type AuthType =
  | { kind: "none" }
  | { kind: "admin"; apiKey: string; apiUsername: string }
  | { kind: "user"; userApiKey: string; userApiClientId?: string };

export class DiscourseClient {
  private baseUrl: string;
  private auth: AuthType;

  constructor(baseUrl: string, auth: AuthType = { kind: "none" }) {
    // Strip trailing slash
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.auth = auth;
  }

  static withApiKey(
    baseUrl: string,
    apiKey: string,
    apiUsername: string,
  ): DiscourseClient {
    return new DiscourseClient(baseUrl, {
      kind: "admin",
      apiKey,
      apiUsername,
    });
  }

  static withUserApiKey(
    baseUrl: string,
    userApiKey: string,
    userApiClientId?: string,
  ): DiscourseClient {
    return new DiscourseClient(baseUrl, {
      kind: "user",
      userApiKey,
      userApiClientId,
    });
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    switch (this.auth.kind) {
      case "admin":
        headers["Api-Key"] = this.auth.apiKey;
        headers["Api-Username"] = this.auth.apiUsername;
        break;
      case "user":
        headers["User-Api-Key"] = this.auth.userApiKey;
        if (this.auth.userApiClientId) {
          headers["User-Api-Client-Id"] = this.auth.userApiClientId;
        }
        break;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      try {
        const errorBody = (await response.json()) as ErrorResponse;
        if (errorBody.errors) {
          throw new ApiError(
            response.status,
            errorBody.errors,
            errorBody.error_type,
          );
        }
      } catch (e) {
        if (e instanceof ApiError) throw e;
      }
      throw new ApiError(response.status, [`HTTP ${response.status}`]);
    }
    return (await response.json()) as T;
  }

  private async get<T>(path: string): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(path), {
        method: "GET",
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new RequestError(String(e));
    }
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(path), {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new RequestError(String(e));
    }
  }

  private async put<T>(path: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(this.buildUrl(path), {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new RequestError(String(e));
    }
  }

  private async delete(path: string): Promise<void> {
    try {
      const response = await fetch(this.buildUrl(path), {
        method: "DELETE",
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        try {
          const errorBody = (await response.json()) as ErrorResponse;
          if (errorBody.errors) {
            throw new ApiError(
              response.status,
              errorBody.errors,
              errorBody.error_type,
            );
          }
        } catch (e) {
          if (e instanceof ApiError) throw e;
        }
        throw new ApiError(response.status, [`HTTP ${response.status}`]);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new RequestError(String(e));
    }
  }

  // Topics

  async getLatest(): Promise<LatestResponse> {
    return this.getLatestPage(0);
  }

  async getLatestPage(page: number): Promise<LatestResponse> {
    return this.get<LatestResponse>(`/latest.json?page=${page}`);
  }

  async getTopic(topicId: number): Promise<TopicResponse> {
    return this.getTopicFromPost(topicId);
  }

  async getTopicFromPost(
    topicId: number,
    afterPostNumber?: number,
  ): Promise<TopicResponse> {
    const path =
      afterPostNumber !== undefined
        ? `/t/${topicId}/${afterPostNumber}.json?include_raw=1`
        : `/t/${topicId}.json?include_raw=1`;
    return this.get<TopicResponse>(path);
  }

  async getTopicPosts(
    topicId: number,
    postIds?: number[],
  ): Promise<TopicResponse> {
    let path = `/t/${topicId}/posts.json?include_raw=1`;
    if (postIds) {
      for (const id of postIds) {
        path += `&post_ids[]=${id}`;
      }
    }
    return this.get<TopicResponse>(path);
  }

  async getPost(postId: number): Promise<Post> {
    return this.get<Post>(`/posts/${postId}.json`);
  }

  // Categories

  async getCategories(): Promise<Category[]> {
    const data = await this.get<CategoryList>("/categories.json");
    return data.category_list.categories;
  }

  async getCategoryTopics(categoryId: number): Promise<LatestResponse> {
    return this.get<LatestResponse>(`/c/${categoryId}/l/latest.json`);
  }

  // Posts

  async createTopic(
    title: string,
    raw: string,
    categoryId?: number,
  ): Promise<CreatePostResponse> {
    const body: Record<string, unknown> = { title, raw };
    if (categoryId !== undefined) {
      body.category = categoryId;
    }
    return this.post<CreatePostResponse>("/posts.json", body);
  }

  async createPost(
    topicId: number,
    raw: string,
    replyToPostNumber?: number,
  ): Promise<CreatePostResponse> {
    const body: Record<string, unknown> = { raw, topic_id: topicId };
    if (replyToPostNumber !== undefined) {
      body.reply_to_post_number = replyToPostNumber;
    }
    return this.post<CreatePostResponse>("/posts.json", body);
  }

  async updatePost(postId: number, raw: string): Promise<void> {
    await this.put<unknown>(`/posts/${postId}.json`, {
      post: { raw },
    });
  }

  async deletePost(postId: number): Promise<void> {
    await this.delete(`/posts/${postId}.json`);
  }

  // Likes

  async likePost(postId: number): Promise<void> {
    await this.post<unknown>("/post_actions", {
      id: postId,
      post_action_type_id: 2,
    });
  }

  async unlikePost(postId: number): Promise<void> {
    await this.delete(
      `/post_actions/${postId}?post_action_type_id=2`,
    );
  }

  // Chat

  async getUserChannels(): Promise<ChatChannelsResponse> {
    return this.get<ChatChannelsResponse>("/chat/api/me/channels");
  }

  async getChannelMessages(
    channelId: number,
  ): Promise<ChatMessagesResponse> {
    return this.get<ChatMessagesResponse>(
      `/chat/api/channels/${channelId}/messages`,
    );
  }

  async sendChatMessage(
    channelId: number,
    message: string,
  ): Promise<CreateMessageResponse> {
    return this.post<CreateMessageResponse>(`/chat/${channelId}`, {
      message,
    });
  }

  // Notifications

  async getNotifications(): Promise<NotificationsResponse> {
    return this.get<NotificationsResponse>("/notifications.json");
  }

  // Search

  async search(term: string, options?: {
    page?: number;
  }): Promise<SearchResponse> {
    let path = `/search.json?q=${encodeURIComponent(term)}`;
    if (options?.page !== undefined) {
      path += `&page=${options.page}`;
    }
    return this.get<SearchResponse>(path);
  }

  // Users

  async getUser(username: string): Promise<UserResponse> {
    return this.get<UserResponse>(`/u/${encodeURIComponent(username)}.json`);
  }

  async getUserActions(username: string, options?: {
    offset?: number;
    filter?: number;
  }): Promise<UserActionsResponse> {
    let path = `/user_actions.json?username=${encodeURIComponent(username)}`;
    if (options?.offset !== undefined) {
      path += `&offset=${options.offset}`;
    }
    if (options?.filter !== undefined) {
      path += `&filter=${options.filter}`;
    }
    return this.get<UserActionsResponse>(path);
  }

  async getUserDirectory(options?: {
    period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "all";
    order?: string;
    page?: number;
  }): Promise<DirectoryResponse> {
    let path = `/directory_items.json?period=${options?.period || "weekly"}`;
    if (options?.order) {
      path += `&order=${encodeURIComponent(options.order)}`;
    }
    if (options?.page !== undefined) {
      path += `&page=${options.page}`;
    }
    return this.get<DirectoryResponse>(path);
  }

  // Topic management

  async updateTopic(topicId: number, changes: {
    title?: string;
    category_id?: number;
    tags?: string[];
  }): Promise<TopicResponse> {
    const body: Record<string, unknown> = {};
    if (changes.title !== undefined) body.title = changes.title;
    if (changes.category_id !== undefined) body.category_id = changes.category_id;
    if (changes.tags !== undefined) body.tags = changes.tags;
    return this.put<TopicResponse>(`/t/-/${topicId}.json`, body);
  }

  async deleteTopic(topicId: number): Promise<void> {
    await this.delete(`/t/${topicId}.json`);
  }

  async setTopicStatus(topicId: number, status: {
    status: "closed" | "pinned" | "archived" | "visible";
    enabled: boolean;
    until?: string;
  }): Promise<TopicStatusResponse> {
    return this.put<TopicStatusResponse>(`/t/${topicId}/status.json`, status);
  }
}
