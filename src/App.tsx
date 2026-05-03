/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera as CapCamera, CameraResultType } from '@capacitor/camera';
import { 
  Bell, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Home, 
  Film, 
  MessageSquare, 
  User,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Battery,
  Wifi,
  Signal,
  Camera,
  MoreVertical,
  Music,
  ChevronLeft,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  X,
  Settings,
  Type,
  Sparkles,
  Zap,
  Timer,
  Image as ImageIcon,
  RefreshCw,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

// --- Types ---

interface Story {
  id: string;
  username: string;
  avatar: string;
  backgroundImage: string;
  isMe?: boolean;
}

interface Post {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  views: string;
  time: string;
  thumbnail: string;
  duration: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  description: string;
  quality?: string;
}

interface Reel {
  id: string;
  username: string;
  avatar: string;
  videoUrl: string;
  caption: string;
  likes: string;
  comments: string;
  musicName: string;
}

interface ProfileResult {
  id: string;
  username: string;
  isVerified?: boolean;
  avatar: string;
}

interface VideoResult {
  id: string;
  thumbnail: string;
  title: string;
  views: string;
  time: string;
}

interface ReelResult {
  id: string;
  thumbnail: string;
}

interface Chat {
  id: string;
  username: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount?: number;
  initials?: string;
  isVerified?: boolean;
  status?: 'sent' | 'received';
}

type Tab = 'home' | 'reels' | 'add' | 'chats' | 'profile';
type HomeSubTab = 'Home' | 'Videos' | 'Photos' | 'Playlist';

const HOME_SUB_TABS: HomeSubTab[] = ['Home', 'Videos', 'Photos', 'Playlist'];

// --- Mock Data ---

const STORIES: Story[] = [
  { 
    id: '1', 
    username: 'Create Status', 
    avatar: 'https://picsum.photos/seed/user1/200', 
    backgroundImage: 'https://picsum.photos/seed/bg1/400/711',
    isMe: true 
  },
  { 
    id: '2', 
    username: 'Alex', 
    avatar: 'https://picsum.photos/seed/user2/200',
    backgroundImage: 'https://picsum.photos/seed/bg2/400/711'
  },
  { 
    id: '3', 
    username: 'Jordan', 
    avatar: 'https://picsum.photos/seed/user3/200',
    backgroundImage: 'https://picsum.photos/seed/bg3/400/711'
  },
  { 
    id: '4', 
    username: 'Sam', 
    avatar: 'https://picsum.photos/seed/user4/200',
    backgroundImage: 'https://picsum.photos/seed/bg4/400/711'
  },
  { 
    id: '5', 
    username: 'Casey', 
    avatar: 'https://picsum.photos/seed/user5/200',
    backgroundImage: 'https://picsum.photos/seed/bg5/400/711'
  },
  { 
    id: '6', 
    username: 'Taylor', 
    avatar: 'https://picsum.photos/seed/user6/200',
    backgroundImage: 'https://picsum.photos/seed/bg6/400/711'
  },
  { 
    id: '7', 
    username: 'Riley', 
    avatar: 'https://picsum.photos/seed/user7/200',
    backgroundImage: 'https://picsum.photos/seed/bg7/400/711'
  },
];

const POSTS: Post[] = [
  {
    id: 'p1',
    username: 'Sayansh Chauhan',
    handle: '@sayansh_c',
    avatar: 'https://picsum.photos/seed/avatar1/200',
    views: '986K',
    time: '8mo',
    thumbnail: 'https://picsum.photos/seed/post1/1280/720',
    duration: '18:19',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 45200,
    comments: 890,
    shares: 1200,
    description: 'The Cinematic Journey through the Alps. Experience nature like never before. #Nature #Travel #Cinematic',
    quality: '4K'
  },
  {
    id: 'p2',
    username: 'Nature Vibes',
    handle: '@naturevibes',
    avatar: 'https://picsum.photos/seed/avatar2/200',
    views: '1.2M',
    time: '2d',
    thumbnail: 'https://picsum.photos/seed/post2/1280/720',
    duration: '05:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    likes: 125000,
    comments: 2300,
    shares: 5400,
    description: 'Relaxing sounds of the ocean waves at sunset. Perfect for deep sleep and meditation.',
    quality: 'HD'
  }
];

const REELS: Reel[] = [
  {
    id: 'r1',
    username: 'travel_vlog',
    avatar: 'https://picsum.photos/seed/reel1/200',
    videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5305-183577382_tiny.mp4',
    caption: 'Dreamy sunset in Bali 🌅 #travel #bali #aesthetic',
    likes: '1.2M',
    comments: '8.4K',
    musicName: 'Lofi Beats - Chill Vibes'
  },
  {
    id: 'r2',
    username: 'chef_master',
    avatar: 'https://picsum.photos/seed/reel2/200',
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70876-538053676_tiny.mp4',
    caption: 'Best home-made pasta recipe 🍝 #cooking #foodie',
    likes: '850K',
    comments: '12K',
    musicName: 'Italian Street - Acoustic'
  },
  {
    id: 'r3',
    username: 'tech_insider',
    avatar: 'https://picsum.photos/seed/reel3/200',
    videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-424075193_tiny.mp4',
    caption: 'Unboxing the new futuristic glasses! 🕶️ #tech #gadget',
    likes: '2.1M',
    comments: '45K',
    musicName: 'Future World - Techno'
  }
];

const CHATS: Chat[] = [
  {
    id: 'c1',
    username: 'Alex Linderson',
    lastMessage: 'Let\'s catch up later tonight!',
    time: '23:45',
    avatar: 'https://picsum.photos/seed/chat1/200',
    unreadCount: 2,
    isVerified: true
  },
  {
    id: 'c2',
    username: 'Team Design',
    lastMessage: 'The new assets are ready.',
    time: '22:15',
    avatar: 'https://picsum.photos/seed/chat2/200',
    status: 'sent'
  },
  {
    id: 'c3',
    username: 'Jessica Snow',
    lastMessage: 'Where are you?',
    time: 'Yesterday',
    avatar: 'https://picsum.photos/seed/chat3/200',
    unreadCount: 5
  },
  {
    id: 'c4',
    username: 'John Wick',
    lastMessage: 'I am coming for you.',
    time: 'Sat, Feb 19',
    avatar: 'https://picsum.photos/seed/chat4/200',
    initials: 'JW'
  },
  {
    id: 'c5',
    username: 'Sarah Connor',
    lastMessage: 'No fate but what we make.',
    time: 'Feb 15',
    avatar: 'https://picsum.photos/seed/chat5/200',
    status: 'sent',
    isVerified: true
  }
];

const SEARCH_PROFILES: ProfileResult[] = [
  { id: 'sp1', username: 'alex_visuals', isVerified: true, avatar: 'https://picsum.photos/seed/sp1/100' },
  { id: 'sp2', username: 'nature_explorer', avatar: 'https://picsum.photos/seed/sp2/100' },
  { id: 'sp3', username: 'chef_mario', isVerified: true, avatar: 'https://picsum.photos/seed/sp3/100' },
  { id: 'sp4', username: 'tech_guru', avatar: 'https://picsum.photos/seed/sp4/100' },
];

const SEARCH_VIDEOS: VideoResult[] = [
  { id: 'sv1', thumbnail: 'https://picsum.photos/seed/sv1/600/400', title: 'Top 10 Locations in Iceland', views: '1.2M', time: '2 days ago' },
  { id: 'sv2', thumbnail: 'https://picsum.photos/seed/sv2/600/400', title: 'Ultimate Pasta Masterclass', views: '850K', time: '1 week ago' },
];

const SEARCH_REELS: ReelResult[] = [
  { id: 'sr1', thumbnail: 'https://picsum.photos/seed/sr1/300/500' },
  { id: 'sr2', thumbnail: 'https://picsum.photos/seed/sr2/300/500' },
  { id: 'sr3', thumbnail: 'https://picsum.photos/seed/sr3/300/500' },
  { id: 'sr4', thumbnail: 'https://picsum.photos/seed/sr4/300/500' },
  { id: 'sr5', thumbnail: 'https://picsum.photos/seed/sr5/300/500' },
  { id: 'sr6', thumbnail: 'https://picsum.photos/seed/sr6/300/500' },
];

const RECENT_SEARCHES = ['Abstract Photography', 'Bali Vlogs', 'Cooking Tips', 'iPhone 16 Pro'];

// --- Components ---

const StatusBar = ({ isDark }: { isDark?: boolean }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      style={{ 
        paddingTop: 'env(safe-area-inset-top, 24px)',
        height: 'calc(env(safe-area-inset-top, 24px) + 32px)'
      }}
      className={`transition-colors duration-300 px-6 flex items-center justify-between text-[11px] font-bold sticky top-0 z-50 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="flex-1">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
      <div className="w-16 h-5 bg-gray-900/5 dark:bg-white/10 rounded-full absolute left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top,10px)] hidden md:block" />
      <div className="flex items-center gap-2 justify-end flex-1">
        <div className="flex items-center gap-1">
          <Signal size={14} className="fill-current" />
          <Wifi size={14} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px]">85%</span>
          <Battery size={14} className="rotate-0" />
        </div>
      </div>
    </div>
  );
};

const NotificationsView = ({ onBack }: { onBack: () => void }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', user: 'alex_visuals', action: 'liked your video', time: '2m ago', avatar: 'https://picsum.photos/seed/n1/100', group: 'Today', unread: true },
    { id: 2, type: 'follow', user: 'stella_art', action: 'started following you', time: '15m ago', avatar: 'https://picsum.photos/seed/n2/100', group: 'Today', unread: true },
    { id: 3, type: 'comment', user: 'mike_codes', action: 'commented: "Great work! 🔥"', time: '1h ago', avatar: 'https://picsum.photos/seed/n3/100', group: 'Today', unread: false },
    { id: 4, type: 'like', user: 'jess_vlogger', action: 'liked your video', time: '5h ago', avatar: 'https://picsum.photos/seed/n4/100', group: 'Today', unread: false },
    { id: 5, type: 'follow', user: 'travel_bug', action: 'started following you', time: '1d ago', avatar: 'https://picsum.photos/seed/n5/100', group: 'Yesterday', unread: false },
    { id: 6, type: 'comment', user: 'foodie_jay', action: 'commented: "Yum! 😋"', time: '1d ago', avatar: 'https://picsum.photos/seed/n6/100', group: 'Yesterday', unread: false },
    { id: 7, type: 'like', user: 'tech_guru', action: 'liked your post', time: '3d ago', avatar: 'https://picsum.photos/seed/n7/100', group: 'Older', unread: false },
  ]);

  const groups = ['Today', 'Yesterday', 'Older'];

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-900" />
          </motion.button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Notifications</h2>
        </div>
        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No notifications yet</p>
          </div>
        ) : (
          <div className="pb-24">
            {groups.map(group => {
              const groupItems = notifications.filter(n => n.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="mb-6">
                  <h3 className="px-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{group}</h3>
                  <div className="divide-y divide-gray-50">
                    {groupItems.map(item => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-gray-50 overflow-hidden"
                      >
                        {/* Swipe Backgrounds */}
                        <div className="absolute inset-0 flex justify-between items-center px-6">
                          <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">✓</span>
                            Read
                          </div>
                          <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest">
                            Delete
                            <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">×</span>
                          </div>
                        </div>

                        <motion.div 
                          drag="x"
                          dragConstraints={{ left: -100, right: 100 }}
                          onDragEnd={(e, info) => {
                            if (info.offset.x > 80) {
                              // Mark as read
                              setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                            } else if (info.offset.x < -80) {
                              // Delete
                              setNotifications(prev => prev.filter(n => n.id !== item.id));
                            }
                          }}
                          className={`relative z-10 px-6 py-4 flex items-center gap-4 transition-colors bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${item.unread ? 'border-l-4 border-l-blue-500' : ''}`}
                        >
                          <div className="relative">
                            <img src={item.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" alt="avatar" />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                              item.type === 'like' ? 'bg-red-500' : 
                              item.type === 'follow' ? 'bg-blue-500' : 
                              'bg-green-500'
                            }`}>
                              {item.type === 'like' && <Heart size={10} fill="white" className="text-white" />}
                              {item.type === 'follow' && <Plus size={10} className="text-white" strokeWidth={3} />}
                              {item.type === 'comment' && <MessageSquare size={10} className="text-white" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">
                              {item.user} <span className="font-medium text-gray-500">{item.action}</span>
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.time}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Header = ({ onSearchClick, onNotificationsClick, hasUnread, activeSubTab, onSubTabChange, showTabs = true }: { 
  onSearchClick?: () => void, 
  onNotificationsClick?: () => void, 
  hasUnread?: boolean,
  activeSubTab?: HomeSubTab,
  onSubTabChange?: (tab: HomeSubTab) => void,
  showTabs?: boolean
}) => (
  <header className="z-40 bg-white flex-shrink-0">
    <div className="px-5 py-5 flex items-center justify-between">
      <motion.h1 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-[24px] font-bold tracking-[1px] text-transparent bg-clip-text bg-gradient-to-r from-[#6C3BFF] to-[#FF4D8D]"
      >
        FLUX
      </motion.h1>
      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onNotificationsClick}
          className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative bg-gray-50"
        >
          <Bell size={24} />
          {hasUnread && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onSearchClick}
          className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors bg-gray-50"
        >
          <Search size={24} />
        </motion.button>
      </div>
    </div>
    
    {/* Swipeable Sub-tabs */}
    {showTabs && activeSubTab && onSubTabChange && (
      <div className="flex px-4 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
        {HOME_SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onSubTabChange(tab)}
            className={`flex-shrink-0 px-6 py-4 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeSubTab === tab ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            {tab}
            {activeSubTab === tab && (
              <motion.div 
                layoutId="activeHomeTab"
                className="absolute bottom-0 left-4 right-4 h-1 bg-indigo-600 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>
    )}
  </header>
);

const Stories = () => (
  <div className="py-6 border-b border-gray-100 bg-white">
    <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar pb-4">
      {STORIES.map((story) => (
        <motion.div 
          key={story.id} 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center shrink-0 w-20"
        >
          <div className="relative mb-4 group cursor-pointer">
            {/* Main Rounded Rectangle Card */}
            <div className={`w-[72px] h-[92px] rounded-2xl p-[1.5px] ${story.isMe ? 'bg-gray-100' : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'}`}>
              <div className="w-full h-full rounded-[14.5px] border-2 border-white overflow-hidden bg-gray-50 shadow-sm relative">
                <img 
                  src={story.isMe ? story.avatar : (story.backgroundImage || story.avatar)} 
                  alt="Background" 
                  className={`w-full h-full object-cover transition-transform group-hover:scale-110 ${story.isMe ? 'opacity-40 grayscale' : ''}`}
                  referrerPolicy="no-referrer"
                />
                
                {story.isMe && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                      <Plus size={20} className="text-gray-900" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Overlapping Small Profile Circle */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10">
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                <img 
                  src={story.avatar} 
                  alt={story.username} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <span className={`text-[10px] font-bold truncate w-full text-center tracking-wide ${story.isMe ? 'text-gray-900' : 'text-gray-500'}`}>
            {story.isMe ? 'Create' : story.username}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  
  // Video States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Play when visible
          if (videoRef.current && !isPlaying) {
            videoRef.current.play().catch(() => {
              // Browser might block auto-play without user interaction
              setIsPlaying(false);
            });
            setIsPlaying(true);
          }
        } else {
          // Pause when not visible
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.6 } // Needs 60% visibility to trigger
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowPlayOverlay(true);
        setTimeout(() => setShowPlayOverlay(false), 800);
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white mb-6"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img 
            src={post.avatar} 
            alt={post.username} 
            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {post.username} <span className="text-gray-400 font-normal ml-0.5">{post.handle}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {post.views} Views • {post.time}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="relative group cursor-pointer overflow-hidden" onClick={togglePlay}>
        <div className="aspect-video bg-black overflow-hidden relative">
          {/* Skeleton/Placeholder while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <Film className="text-gray-300" size={48} />
            </div>
          )}

          <video
            ref={videoRef}
            src={post.videoUrl}
            poster={post.thumbnail}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            muted={isMuted}
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onTimeUpdate={handleTimeUpdate}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          />

          {/* Central Play/Pause Overlay */}
          <AnimatePresence>
            {showPlayOverlay && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-full border border-white/20">
                  {isPlaying ? <Play fill="white" className="text-white" size={48} /> : <Pause fill="white" className="text-white" size={48} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mute/Unmute toggle */}
          <button 
            className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition-colors z-20"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Progress Bar at bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
            <motion.div 
              className="h-full bg-red-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Quality/Duration Labels */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-wider flex items-center gap-1 z-20">
          {post.quality && <span className="text-yellow-400 border-r border-white/20 pr-1 mr-1">{post.quality}</span>}
          {post.duration}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <motion.button 
            whileTap={{ scale: 1.2 }}
            onClick={toggleLike}
            className="flex items-center gap-1.5"
          >
            <Heart 
              size={24} 
              className={`transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
            />
            <span className="text-xs font-semibold text-gray-700">{formatCount(likesCount)}</span>
          </motion.button>
          
          <button className="flex items-center gap-1.5">
            <MessageCircle size={24} className="text-gray-700" />
            <span className="text-xs font-semibold text-gray-700">{formatCount(post.comments)}</span>
          </button>
          
          <button className="flex items-center gap-1.5">
            <Send size={24} className="text-gray-700" />
            <span className="text-xs font-semibold text-gray-700">{formatCount(post.shares)}</span>
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setFollowed(!followed)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            followed 
              ? 'bg-gray-100 text-gray-900 border-gray-200' 
              : 'bg-gray-900 text-white'
          }`}
        >
          {followed ? 'Following' : 'Follow'}
        </motion.button>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-800 leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </div>
    </motion.div>
  );
};

const ReelItem: React.FC<{ reel: Reel }> = ({ reel }) => {
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
          if (videoRef.current) videoRef.current.currentTime = 0;
        }
      },
      { threshold: 0.8 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full w-full relative snap-start bg-black">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={false}
      />
      
      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setLiked(!liked)} className="flex flex-col items-center">
          <Heart size={30} className={liked ? "fill-red-500 text-red-500" : "text-white"} />
          <span className="text-white text-xs font-semibold mt-1">{reel.likes}</span>
        </motion.button>
        
        <button className="flex flex-col items-center">
          <MessageCircle size={30} className="text-white" />
          <span className="text-white text-xs font-semibold mt-1">{reel.comments}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <Send size={30} className="text-white" />
        </button>

        <button className="flex flex-col items-center" onClick={() => alert("More options")}>
          <MoreVertical size={30} className="text-white" />
        </button>
        
        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden animate-spin-slow">
          <img src={reel.avatar} alt="music" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-10 left-0 right-16 p-4 z-10 text-white">
        <div className="flex items-center gap-3 mb-3">
          <img src={reel.avatar} alt={reel.username} className="w-10 h-10 rounded-full border border-white" />
          <span className="font-bold text-sm">@{reel.username}</span>
          <button className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30">
            Follow
          </button>
        </div>
        <p className="text-sm mb-4 line-clamp-2">{reel.caption}</p>
        <div className="flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
          <Music size={14} />
          <span>{reel.musicName}</span>
        </div>
      </div>

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};

const ReelsView = () => (
  <div className="h-full w-full overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-smooth bg-black relative">
    {/* Reels Header */}
    <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between text-white bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
      <h2 className="text-xl font-bold tracking-tight">Reels</h2>
      <Camera size={24} className="pointer-events-auto cursor-pointer" />
    </div>
    
    {CHATS.length > 0 && REELS.map(reel => (
      <ReelItem key={reel.id} reel={reel} />
    ))}
  </div>
);

interface ChatMessage {
  id: string;
  text?: string;
  imageUrl?: string;
  time: string;
  isMe: boolean;
  status?: 'sent' | 'received';
}

const CONVERSATIONS: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1', text: 'Hey Alex! How is the new product launch going?', time: '10:30 AM', isMe: true, status: 'sent' },
    { id: 'm2', text: 'It\'s going great! We just hit 10k users.', time: '10:32 AM', isMe: false },
    { id: 'm3', imageUrl: 'https://picsum.photos/seed/chatimg1/400/300', time: '10:33 AM', isMe: false },
    { id: 'm4', text: 'That\'s amazing! Let\'s catch up later tonight!', time: '10:35 AM', isMe: true, status: 'sent' },
  ],
  'c2': [
    { id: 'm1', text: 'Team, are the new assets ready?', time: '09:00 AM', isMe: false },
    { id: 'm2', text: 'Yes, just uploaded them to the drive.', time: '09:05 AM', isMe: true, status: 'sent' },
  ]
};

const ChatConversation: React.FC<{ chat: Chat, onBack: () => void }> = ({ chat, onBack }) => {
  const messages = CONVERSATIONS[chat.id] || [
    { id: 'dm1', text: `Hi ${chat.username}!`, time: '12:00 PM', isMe: false },
    { id: 'dm2', text: chat.lastMessage, time: chat.time, isMe: chat.status === 'sent' }
  ];

  return (
    <div className="flex flex-col h-full bg-white z-[60]">
      {/* Top Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src={chat.avatar} 
              alt={chat.username} 
              className="w-10 h-10 rounded-full object-cover border border-gray-100" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {chat.username}
                {chat.isVerified && <span className="ml-1 text-blue-500 text-[10px]">✓</span>}
              </h3>
              <p className="text-[10px] text-green-500 font-bold">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-900">
          <button><Phone size={20} /></button>
          <button><Video size={22} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50/50">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                msg.isMe 
                  ? 'bg-gray-900 text-white rounded-tr-none' 
                  : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="attachment" 
                    className="rounded-lg mt-1 w-full max-h-60 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[9px] font-bold text-gray-400">{msg.time}</span>
                {msg.isMe && <span className="text-blue-500 text-[10px]">✓✓</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">
          <button className="text-gray-400"><Smile size={20} /></button>
          <input 
            type="text" 
            placeholder="Type here..." 
            className="flex-1 bg-transparent border-none outline-none text-sm py-1"
          />
          <button className="text-gray-400"><Paperclip size={20} className="rotate-45" /></button>
        </div>
        <div className="flex items-center justify-between mt-3 px-1 text-gray-400">
          <div className="flex items-center gap-6">
            <button><Mic size={20} /></button>
            <button><Camera size={20} /></button>
          </div>
          <button className="bg-gray-900 text-white p-2 rounded-full shadow-md">
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatsView = () => {
  const [activeChatTab, setActiveChatTab] = useState('Primary');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  if (selectedChat) {
    return <ChatConversation chat={selectedChat} onBack={() => setSelectedChat(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chats Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Chats</h2>
        <button className="text-gray-900">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Chats" 
            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-gray-200 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['Primary', 'Requests', 'General'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveChatTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeChatTab === tab 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        {CHATS.map((chat) => (
          <motion.div 
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 cursor-pointer active:bg-gray-50"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {chat.initials ? (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {chat.initials}
                </div>
              ) : (
                <img 
                  src={chat.avatar} 
                  alt={chat.username} 
                  className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-gray-900 truncate uppercase text-[13px] tracking-wide">{chat.username}</h3>
                {chat.isVerified && (
                  <div className="bg-blue-500 text-white rounded-full p-0.5">
                    <svg viewBox="0 0 24 24" className="w-2 h-2 fill-current">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {chat.status === 'sent' && <span className="text-blue-500 text-[10px]">✓✓</span>}
                <p className={`text-xs truncate ${chat.unreadCount ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
              {chat.unreadCount && (
                <div className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SearchView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Profiles' | 'Videos' | 'Reels'>('Profiles');

  return (
    <div className="flex flex-col h-full bg-white z-[70]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-1 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..." 
            className="w-full bg-gray-100 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-gray-200 outline-none"
          />
        </div>
        <button 
          className="text-gray-400 p-1 active:scale-95 transition-transform"
          onClick={() => alert("Voice search coming soon...")}
        >
          <Mic size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {query === '' ? (
          /* Recent Searches */
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Recent Searches</h3>
            <div className="space-y-4">
              {RECENT_SEARCHES.map((item, idx) => (
                <button key={idx} className="flex items-center justify-between w-full text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Search size={14} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{item}</span>
                  </div>
                  <Plus size={14} className="text-gray-300 rotate-45" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="flex flex-col h-full">
            {/* Search Tabs */}
            <div className="px-6 py-4 flex gap-8 border-b border-gray-50 overflow-x-auto no-scrollbar">
              {['Profiles', 'Videos', 'Reels'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors relative pb-1 ${
                    activeTab === tab ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="searchTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Lists */}
            <div className="p-6">
              {activeTab === 'Profiles' && (
                <div className="space-y-6">
                  {SEARCH_PROFILES.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={profile.avatar} alt={profile.username} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gray-900">@{profile.username}</span>
                          {profile.isVerified && <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white">✓</div>}
                        </div>
                      </div>
                      <button className="px-5 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-900 hover:bg-gray-200 uppercase tracking-widest transition-colors">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Videos' && (
                <div className="space-y-6">
                  {SEARCH_VIDEOS.map(video => (
                    <div key={video.id} className="flex flex-col gap-3 group">
                      <div className="aspect-video rounded-2xl overflow-hidden relative shadow-sm">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white">12:30</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{video.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">{video.views} • {video.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Reels' && (
                <div className="grid grid-cols-3 gap-2">
                  {SEARCH_REELS.map(reel => (
                    <div key={reel.id} className="aspect-[9/16] rounded-xl overflow-hidden relative shadow-sm">
                      <img src={reel.thumbnail} alt="reel" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] font-bold">
                        <Play size={10} fill="white" /> 12K
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CameraView = ({ onBack }: { onBack: () => void }) => {
  const [activeMode, setActiveMode] = useState('VIDEO');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const modes = ['PHOTO', 'VIDEO', 'SHORT', 'LIVE'];

  const takePicture = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        promptLabelHeader: 'Create Post',
        promptLabelPhoto: 'From Gallery',
        promptLabelPicture: 'Take Photo'
      });
      if (image.webPath) {
        setCapturedImage(image.webPath);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <div className="h-full w-full bg-black flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="text-white p-1"
        >
          <X size={28} />
        </motion.button>
        <span className="text-white text-sm font-bold uppercase tracking-[0.3em]">Create</span>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="text-white p-1"
        >
          <Settings size={24} />
        </motion.button>
      </div>

      {/* Side Tools (Left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-20">
        <motion.button whileTap={{ scale: 0.9 }} className="text-white flex flex-col items-center gap-1">
          <Type size={22} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Text</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="text-white flex flex-col items-center gap-1">
          <Sparkles size={22} className="text-purple-400" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Effects</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="text-white flex flex-col items-center gap-1">
          <Zap size={22} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Speed</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="text-white flex flex-col items-center gap-1">
          <Timer size={22} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Timer</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="text-white flex flex-col items-center gap-1">
          <Layout size={22} />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Grid</span>
        </motion.button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
        
        {capturedImage ? (
          <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
        ) : (
          <Camera icon={Camera} size={64} className="text-white/5 opacity-20" />
        )}
        
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex flex-col items-center gap-3 shadow-2xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Layout size={20} className="text-white" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Templates</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="pb-12 pt-6 px-8 flex flex-col items-center gap-10">
        <div className="w-full flex items-center justify-between">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 ring-1 ring-white/10 shadow-lg"
          >
            <img 
              src="https://picsum.photos/seed/gallery/100" 
              className="w-full h-full object-cover"
              alt="Gallery"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-24 h-24 rounded-full border-4 border-indigo-500/30" 
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={takePicture}
              className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center p-1.5 shadow-2xl z-10"
            >
              <div className="w-full h-full rounded-full border-[3px] border-black/5 flex items-center justify-center bg-white shadow-inner">
                 <div className={`w-8 h-8 rounded-full border-2 border-indigo-500 ${activeMode === 'VIDEO' ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`} />
              </div>
            </motion.button>
          </div>

          <motion.button 
            whileTap={{ rotate: 180 }}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
          >
            <RefreshCw size={24} />
          </motion.button>
        </div>

        <div className="flex gap-8 overflow-x-auto no-scrollbar w-full px-12 pb-2">
          {modes.map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`text-[11px] font-black tracking-[0.2em] transition-all whitespace-nowrap ${
                activeMode === mode ? 'text-white' : 'text-white/30'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const tabs = ['Home', 'Videos', 'Flux', 'Photos', 'Playlists'];
  const activeTabIndex = tabs.indexOf(activeTab);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeTabIndex < tabs.length - 1) {
      setActiveTab(tabs[activeTabIndex + 1]);
    } else if (info.offset.x > threshold && activeTabIndex > 0) {
      setActiveTab(tabs[activeTabIndex - 1]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="space-y-6">
            {POSTS.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        );
      case 'Videos':
        return (
          <div className="grid grid-cols-1 gap-6">
            {SEARCH_VIDEOS.map(video => (
              <div key={video.id} className="flex flex-col gap-3 group">
                <div className="aspect-video rounded-2xl overflow-hidden relative shadow-sm">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white">12:30</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{video.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">{video.views} • {video.time}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Flux':
        return (
          <div className="grid grid-cols-2 gap-3">
            {REELS.map(reel => (
              <div key={reel.id} className="aspect-[9/16] rounded-2xl overflow-hidden relative shadow-md">
                <img src={reel.avatar} alt="reel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-[10px] font-bold">
                  <Play size={10} fill="white" /> {reel.likes}
                </div>
              </div>
            ))}
          </div>
        );
      case 'Photos':
        return (
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm">
                <img src={`https://picsum.photos/seed/photo${i}/400`} alt="post" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
      case 'Playlists':
        return (
          <div className="space-y-4">
            {[
              { title: 'Travel Vlogs', count: 12, thumb: 'https://picsum.photos/seed/playlist1/400' },
              { title: 'Coding Tips', count: 45, thumb: 'https://picsum.photos/seed/playlist2/400' },
              { title: 'Daily Life', count: 8, thumb: 'https://picsum.photos/seed/playlist3/400' },
            ].map((playlist, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                <img src={playlist.thumb} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{playlist.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{playlist.count} Items</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar pb-20">
      {/* Profile Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-20">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">@myprofile</h2>
        <button className="p-1">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Profile Section (YouTube Style) */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <img 
              src="https://picsum.photos/seed/myprofile/200" 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border border-gray-100"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Sayansh Chauhan</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-gray-900">3.2M followers</span>
              <span className="text-gray-400 text-[10px] font-bold">•</span>
              <span className="text-xs font-bold text-gray-900">753 videos</span>
            </div>
          </div>
        </div>

        {/* Bio Below Stats */}
        <div className="mt-4 space-y-0.5">
          <p className="text-xs text-gray-500 leading-relaxed">
            🔥 Truth is Always Hidden... | Expose It ✊
          </p>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            ▶️ YouTube/Twitter: Sayansh Chauhan
          </p>
        </div>
      </div>

      {/* Action Buttons Content */}
      <div className="px-4 py-3 flex gap-2">
        <button className="flex-1 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold active:scale-95 transition-all">
          Edit profile
        </button>
        <button className="flex-1 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold active:scale-95 transition-all">
          Share profile
        </button>
        <button className="flex-1 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold active:scale-95 transition-all">
          Contact
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-gray-100 sticky top-[52px] bg-white z-10">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="profileTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Swipe */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="p-4 h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) => {
  const isDark = activeTab === 'reels';
  return (
    <nav className={`fixed bottom-0 left-0 right-0 transition-colors duration-300 pb-safe flex justify-around items-center z-50 shadow-[0_-1px_0_rgba(0,0,0,0.05)] ${
      isDark ? 'bg-black border-t border-white/10' : 'bg-white border-t border-gray-100'
    }`}
      style={{ height: 'calc(env(safe-area-inset-bottom, 16px) + 64px)' }}
    >
      <NavItem icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} isDark={isDark} />
      <NavItem icon={Play} active={activeTab === 'reels'} onClick={() => setActiveTab('reels')} isDark={isDark} />
      
      <div className="flex items-center justify-center">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('add')}
          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-none focus:outline-none transition-colors ${
            isDark ? 'bg-white text-black' : 'bg-[#111827] text-white'
          }`}
        >
          <Camera size={22} strokeWidth={2} />
        </motion.button>
      </div>

      <NavItem icon={MessageSquare} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} isDark={isDark} />
      
      <motion.button 
        whileTap={{ scale: 0.8 }}
        onClick={() => setActiveTab('profile')}
        className="p-2 relative flex items-center justify-center focus:outline-none"
      >
        <div className={`w-[22px] h-[22px] rounded-full border overflow-hidden ring-1 ring-gray-50 transition-colors ${
          activeTab === 'profile' 
            ? (isDark ? 'border-white' : 'border-black') 
            : (isDark ? 'border-white/20' : 'border-gray-300')
        }`}>
          <img 
            src="https://picsum.photos/seed/myprofile/100" 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      </motion.button>
    </nav>
  );
};

const NavItem = ({ icon: Icon, active, onClick, isDark }: { icon: any, active?: boolean, onClick?: () => void, isDark?: boolean }) => (
  <motion.button 
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`p-2 transition-colors focus:outline-none ${
      active 
        ? (isDark ? 'text-white' : 'text-black') 
        : (isDark ? 'text-gray-500' : 'text-[#6b7280]')
    }`}
  >
    <Icon size={22} strokeWidth={1.5} />
  </motion.button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [homeSubTab, setHomeSubTab] = useState<HomeSubTab>('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const isDark = activeTab === 'reels' || activeTab === 'add';

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setHasUnreadNotifications(false);
  };

  // Swipe handlers for home sub-tabs
  const handleSwipe = (direction: number) => {
    const currentIndex = HOME_SUB_TABS.indexOf(homeSubTab);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < HOME_SUB_TABS.length) {
      setHomeSubTab(HOME_SUB_TABS[nextIndex]);
    }
  };

  return (
    <div className={`h-screen transition-colors duration-300 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <StatusBar isDark={isDark} />
      
      {isNotificationsOpen ? (
        <main className="flex-1 overflow-hidden">
          <NotificationsView onBack={() => setIsNotificationsOpen(false)} />
        </main>
      ) : isSearchOpen ? (
        <main className="flex-1 overflow-hidden">
          <SearchView onBack={() => setIsSearchOpen(false)} />
        </main>
      ) : (
        <>
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header 
                onSearchClick={() => setIsSearchOpen(true)} 
                onNotificationsClick={openNotifications}
                hasUnread={hasUnreadNotifications}
                showTabs={false}
              />
              <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto pb-24 scroll-smooth no-scrollbar"
              >
                <Stories />
                <div className="mt-0">
                  {POSTS.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                <div className="py-8 flex justify-center opacity-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-1" />
                </div>
              </motion.main>
            </div>
          )}

          {activeTab === 'reels' && (
            <main className="flex-1 overflow-hidden">
              <ReelsView />
            </main>
          )}

          {activeTab === 'chats' && (
            <main className="flex-1 overflow-hidden">
              <ChatsView />
            </main>
          )}

          {activeTab === 'profile' && (
            <main className="flex-1 overflow-hidden text-gray-900 leading-relaxed font-medium">
              <ProfileView />
            </main>
          )}

          {activeTab === 'add' && (
            <main className="flex-1 overflow-hidden">
              <CameraView onBack={() => setActiveTab('home')} />
            </main>
          )}

          {activeTab !== 'home' && activeTab !== 'reels' && activeTab !== 'chats' && activeTab !== 'profile' && activeTab !== 'add' && (
            <main className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  {activeTab === 'add' && <Camera size={32} />}
                </div>
                <p className="font-bold uppercase tracking-widest text-[11px] leading-relaxed">
                  {activeTab} view<br/>is being processed
                </p>
              </div>
            </main>
          )}
        </>
      )}

      {!isSearchOpen && !isNotificationsOpen && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* Global CSS for hiding scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe-area {
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
