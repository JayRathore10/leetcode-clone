import { motion } from "framer-motion";
import "../styles/MaintenanceAlert.css";

interface Props {
  message: string;
  onClose: () => void;
}

export const MaintenanceAlert = ({ message, onClose }: Props) => {
  return (
    <motion.div
      className="maintenance-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="maintenance-alert"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Under Maintenance</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </motion.div>
    </motion.div>
  );
};
