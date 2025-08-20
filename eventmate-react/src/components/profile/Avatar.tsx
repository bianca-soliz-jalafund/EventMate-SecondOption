import { useMemo } from "react";

interface AvatarProps {
  avatarPlaceholder: string;
  onClick?: () => void;
}

const Avatar = ({ avatarPlaceholder, onClick }: AvatarProps) => {
  const avatarInitials = useMemo(() => {
    const words = avatarPlaceholder.trim().split(" ");
    if (words.length > 1) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    } else {
      return words[0].slice(0, 2).toUpperCase();
    }
  }, [avatarPlaceholder]);

  return (
    <div
      className="w-10 h-10 rounded-full bg-pink-700 text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-pink-600 transition-colors"
      onClick={onClick}
      title={avatarPlaceholder} 
    >
      {avatarInitials}
    </div>
  );
};

export default Avatar;
