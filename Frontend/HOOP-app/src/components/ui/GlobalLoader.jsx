import { useLoader } from "@/context/LoaderContext";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader() {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium text-lg animate-pulse">Loading Hoop...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
