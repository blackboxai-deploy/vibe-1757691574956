'use client';

import { GeneratedVideo, VideoGenerationSettings } from './types';

const STORAGE_KEYS = {
  VIDEOS: 'videoai_generated_videos',
  SETTINGS: 'videoai_settings',
  RECENT_PROMPTS: 'videoai_recent_prompts'
};

// Default settings
const DEFAULT_SETTINGS: VideoGenerationSettings = {
  defaultDuration: 5,
  defaultAspectRatio: '16:9',
  defaultStyle: 'realistic',
  systemPrompt: 'Create a high-quality video with smooth motion and professional cinematography.',
  maxConcurrentGenerations: 3
};

export class StorageManager {
  // Video Management
  static saveVideo(video: GeneratedVideo): void {
    try {
      const videos = this.getVideos();
      const updatedVideos = [video, ...videos.filter(v => v.id !== video.id)];
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Failed to save video:', error);
    }
  }

  static getVideos(): GeneratedVideo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load videos:', error);
      return [];
    }
  }

  static deleteVideo(videoId: string): void {
    try {
      const videos = this.getVideos();
      const updatedVideos = videos.filter(v => v.id !== videoId);
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  }

  static getVideo(videoId: string): GeneratedVideo | null {
    try {
      const videos = this.getVideos();
      return videos.find(v => v.id === videoId) || null;
    } catch (error) {
      console.error('Failed to get video:', error);
      return null;
    }
  }

  // Settings Management
  static saveSettings(settings: Partial<VideoGenerationSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static getSettings(): VideoGenerationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  // Recent Prompts Management
  static saveRecentPrompt(prompt: string): void {
    try {
      const recentPrompts = this.getRecentPrompts();
      const updatedPrompts = [
        prompt,
        ...recentPrompts.filter(p => p !== prompt).slice(0, 9) // Keep last 10 unique prompts
      ];
      localStorage.setItem(STORAGE_KEYS.RECENT_PROMPTS, JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('Failed to save recent prompt:', error);
    }
  }

  static getRecentPrompts(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_PROMPTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recent prompts:', error);
      return [];
    }
  }

  static clearRecentPrompts(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_PROMPTS);
    } catch (error) {
      console.error('Failed to clear recent prompts:', error);
    }
  }

  // Utility functions
  static getStorageStats(): {
    totalVideos: number;
    totalStorageSize: string;
    oldestVideo?: string;
    newestVideo?: string;
  } {
    try {
      const videos = this.getVideos();
      
      // Calculate approximate storage size
      const storageSize = videos.reduce((size, video) => {
        return size + JSON.stringify(video).length;
      }, 0);

      const oldestVideo = videos.length > 0 
        ? videos[videos.length - 1].createdAt 
        : undefined;
      
      const newestVideo = videos.length > 0 
        ? videos[0].createdAt 
        : undefined;

      return {
        totalVideos: videos.length,
        totalStorageSize: this.formatBytes(storageSize),
        oldestVideo,
        newestVideo
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalVideos: 0,
        totalStorageSize: '0 B'
      };
    }
  }

  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  static exportData(): string {
    try {
      const data = {
        videos: this.getVideos(),
        settings: this.getSettings(),
        recentPrompts: this.getRecentPrompts(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '{}';
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.videos) {
        localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(data.videos));
      }
      
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      
      if (data.recentPrompts) {
        localStorage.setItem(STORAGE_KEYS.RECENT_PROMPTS, JSON.stringify(data.recentPrompts));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Hook for React components
export function useVideoStorage() {
  return {
    saveVideo: StorageManager.saveVideo,
    getVideos: StorageManager.getVideos,
    deleteVideo: StorageManager.deleteVideo,
    getVideo: StorageManager.getVideo
  };
}

export function useSettingsStorage() {
  return {
    saveSettings: StorageManager.saveSettings,
    getSettings: StorageManager.getSettings
  };
}

export function useRecentPrompts() {
  return {
    saveRecentPrompt: StorageManager.saveRecentPrompt,
    getRecentPrompts: StorageManager.getRecentPrompts,
    clearRecentPrompts: StorageManager.clearRecentPrompts
  };
}