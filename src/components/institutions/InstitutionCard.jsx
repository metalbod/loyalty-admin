import React from 'react';
import PropTypes from 'prop-types';
import { Ban, Building2, PlayCircle } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime } from '../../utils/dateUtils.js';

export function InstitutionCard({ institution, onToggleStatus, isUpdating = false }) {
  const isActive = institution.status === 'ACTIVE';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
            <Building2 size={16} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{institution.name}</h3>
            <p className="text-xs text-slate-500">{institution.slug}</p>
          </div>
        </div>
        <Badge variant={isActive ? 'emerald' : 'rose'}>{institution.status}</Badge>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Created {formatDateTime(institution.createdAt)}
      </p>

      <Button
        variant={isActive ? 'danger' : 'secondary'}
        icon={isActive ? Ban : PlayCircle}
        fullWidth
        className="mt-4"
        isLoading={isUpdating}
        onClick={() => onToggleStatus(institution, isActive ? 'SUSPENDED' : 'ACTIVE')}
      >
        {isActive ? 'Suspend' : 'Reactivate'}
      </Button>
    </Card>
  );
}

InstitutionCard.propTypes = {
  institution: PropTypes.shape({
    institutionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default InstitutionCard;
