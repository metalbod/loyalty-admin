// Re-export from common/RateConfigModal for backward compatibility
// This was previously defined here but has been unified into a generic component
import RateConfigModal from '../common/RateConfigModal.jsx';

// Export as PartnerRateConfigModal for any remaining imports
export function PartnerRateConfigModal(props) {
  return <RateConfigModal {...props} entityType="partner" entity={props.partner} />;
}

export default RateConfigModal;
