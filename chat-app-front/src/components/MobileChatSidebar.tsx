import { Users, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileChatSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { chats, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!isOpen) return null;
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="fixed z-50 inset-0 bg-black/50 lg:hidden">
      <div className="absolute left-0 top-0 h-full w-72 bg-base-100 animate-slide-left overflow-y-auto">
        {/* Header */}
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium">Contacts</span>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <X className="size-5" />
            </button>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            {onlineUsers.length - 1} online
          </div>
        </div>

        {/* Users list */}
        <div className="overflow-y-auto w-full py-3">
          {chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => {
                setSelectedUser(chat);
                onClose();
              }}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === chat._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative">
                <img
                  src={chat.profilePicture || "/avatar.png"}
                  alt={chat.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(chat._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="text-left min-w-0">
                <div className="font-medium truncate">{chat.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(chat._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {chats.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No chats found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileChatSidebar;