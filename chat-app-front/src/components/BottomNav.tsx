import { User } from "lucide-react";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";

export const BottomNav = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div className="z-50 fixed bottom-0 left-0 right-0 border-t bg-base-100 lg:hidden">
      <nav className="flex justify-around items-center h-16">

      <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
            <User className="size-6" /> Usuarios
        </button>
      </nav>

      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
    </div>
  );
};
