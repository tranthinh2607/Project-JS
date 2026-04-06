export const formatAvatar = (avatar: string | undefined | null) => {
  if (!avatar) return "/assets/images/logo/favicon.png";
  
  // If it's a full URL (Google avatar)
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  
  // If it's a local path
  const baseUrl = import.meta.env.VITE_API_TASK_FLOW_URL || "";
  // Ensure we don't have double slashes
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanAvatarPath = avatar.startsWith("/") ? avatar : `/${avatar}`;
  
  return `${cleanBaseUrl}${cleanAvatarPath}`;
};
