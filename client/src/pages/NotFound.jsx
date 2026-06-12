import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

/**
 * NotFound — fun 404 page with emoji art and Go Home button
 */
function NotFound() {
  return (
    <div className="page-transition" id="not-found-page">
      <div className="not-found">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="not-found-code">404</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '1rem', fontSize: '4rem' }}
        >
          🛸
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Lost in Space?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ color: 'var(--text-secondary)' }}
        >
          The page you're looking for has drifted into another dimension. 
          Let's get you back to familiar territory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/" className="btn btn-primary btn-lg" id="go-home-btn">
            <FiHome size={18} /> Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
