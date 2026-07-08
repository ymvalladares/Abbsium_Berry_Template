import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDealerSetup } from '../contexts/DealerSetupContext';
import DealerSetupModal from '../ui-component/DealerSetupModal';

const DealerRoute = ({ children }) => {
  const { user } = useAuth();
  const { hasDealer, dealerLoading, isDealer, handleDealerCreated, checkDealerStatus } = useDealerSetup();
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (!dealerLoading && isDealer && !hasDealer) {
      setShowSetupModal(true);
    }
  }, [dealerLoading, isDealer, hasDealer]);

  if (dealerLoading) return null;

  if (isDealer && !hasDealer) {
    return (
      <DealerSetupModal
        open={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={(dealer) => {
          handleDealerCreated(dealer);
          setShowSetupModal(false);
          checkDealerStatus();
        }}
      />
    );
  }

  return children;
};

export default DealerRoute;
