import { Users, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!isOpen) return null;
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="fixed z-10 inset-0 bg-black/50 z-50 lg:hidden">
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
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                onClose();
              }}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              <div className="text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {users.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;