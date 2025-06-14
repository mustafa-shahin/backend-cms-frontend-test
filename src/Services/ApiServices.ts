import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { API_CONFIG, ENV } from "../config";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log the request for debugging in development
        if (ENV.IS_DEVELOPMENT) {
          console.log(
            `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }

        return config;
      },
      (error) => {
        console.error("🔴 Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors globally
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (ENV.IS_DEVELOPMENT) {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${
              response.config.url
            } - ${response.status}`
          );
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (ENV.IS_DEVELOPMENT) {
          console.error(
            `❌ API Error: ${originalRequest?.method?.toUpperCase()} ${
              originalRequest?.url
            } - ${error.response?.status}`,
            error.response?.data
          );
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = localStorage.getItem("accessToken");
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("🔴 Token refresh failed, redirecting to login");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Show error toast for non-401 errors (but not for 404s in development)
        if (error.response?.status !== 401) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "An error occurred";

          // Only show toast for non-404 errors or in production
          if (error.response?.status !== 404 || ENV.IS_PRODUCTION) {
            toast.error(message);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.client.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Add detailed logging for product creation requests
    if (url.includes("/product") && ENV.IS_DEVELOPMENT) {
      console.log(`🌐 POST Request Details:`, {
        url: `${this.client.defaults.baseURL}${url}`,
        data: JSON.stringify(data, null, 2),
        headers: {
          ...this.client.defaults.headers,
          ...config?.headers,
        },
      });

      // Validate the data structure
      if (data) {
        console.log(`📊 Data validation:`, {
          hasName: !!data.name,
          hasSku: !!data.sku,
          hasSlug: !!data.slug,
          hasPrice: data.price !== undefined && data.price !== null,
          priceType: typeof data.price,
          compareAtPriceType: typeof data.compareAtPrice,
          isValidJSON: (() => {
            try {
              JSON.stringify(data);
              return true;
            } catch {
              return false;
            }
          })(),
        });
      }
    }

    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    // Add any additional form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };

    const response = await this.client.post<T>(url, formData, config);
    return response.data;
  }

  // Helper method to build download URLs with auth token
  getDownloadUrl(path: string): string {
    const token = localStorage.getItem("accessToken");
    const baseUrl = API_CONFIG.BASE_URL;
    // Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}?token=${encodeURIComponent(token || "")}`;
  }

  // Helper method to build image URLs for entities
  getImageUrl(
    fileId: number | null | undefined,
    type: "download" | "thumbnail" = "download"
  ): string | null {
    if (!fileId || fileId <= 0) return null;
    const endpoint =
      type === "thumbnail"
        ? `/file/${fileId}/thumbnail`
        : `/file/${fileId}/download`;
    return this.getDownloadUrl(endpoint);
  }

  // Helper method to build avatar URL for users
  getAvatarUrl(user: {
    avatarFileId?: number | null;
    firstName?: string;
    lastName?: string;
  }): string | null {
    if (user.avatarFileId && user.avatarFileId > 0) {
      return this.getImageUrl(user.avatarFileId, "download");
    }
    return null;
  }

  // Helper method to build featured image URL for products/categories
  getFeaturedImageUrl(
    images: Array<{ fileId: number; isFeatured?: boolean; position?: number }>
  ): string | null {
    if (!images || images.length === 0) return null;

    // Find featured image or first image
    const featuredImage =
      images.find((img) => img.isFeatured) ||
      images.sort((a, b) => (a.position || 0) - (b.position || 0))[0];

    if (featuredImage && featuredImage.fileId > 0) {
      return this.getImageUrl(featuredImage.fileId, "download");
    }

    return null;
  }
}

export const apiService = new ApiService();
