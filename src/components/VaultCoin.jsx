import { motion } from 'framer-motion';

export default function VaultCoin() {
  return (
    <motion.div
      className="vault-coin-scene"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="vault-coin" aria-hidden="true">
        <div className="vault-coin-face vault-coin-front">V</div>
        <div className="vault-coin-face vault-coin-back">$</div>
      </div>
    </motion.div>
  );
}
