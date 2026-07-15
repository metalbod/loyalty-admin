import React from 'react';
import PropTypes from 'prop-types';
import { Ban, Building2, Palette, PencilLine, PlayCircle, ToggleLeft } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime } from '../../utils/dateUtils.js';

export function InstitutionCard({
  institution, onToggleStatus, onEditBranding, onEditDetails, onEditFeatures, isUpdating = false,
}) {
  const isActive = institution.status === 'ACTIVE';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sky-50 text-sky-600">
            {institution.logoDataUrl ? (
              <img src={institution.logoDataUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <Building2 size={16} />
            )}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{institution.name}</h3>
            <p className="text-xs text-slate-500">{institution.slug}</p>
          </div>
        </div>
        <Badge variant={isActive ? 'emerald' : 'rose'}>{institution.status}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">Created {formatDateTime(institution.createdAt)}</p>
        {institution.primaryColor && (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-300"
            style={{ backgroundColor: institution.primaryColor }}
            title={`Accent color: ${institution.primaryColor}`}
          />
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" icon={PencilLine} fullWidth onClick={() => onEditDetails(institution)}>
          Edit
        </Button>
        <Button variant="secondary" icon={Palette} fullWidth onClick={() => onEditBranding(institution)}>
          Branding
        </Button>
        <Button variant="secondary" icon={ToggleLeft} fullWidth onClick={() => onEditFeatures(institution)}>
          Features
        </Button>
        <Button
          variant={isActive ? 'danger' : 'secondary'}
          icon={isActive ? Ban : PlayCircle}
          fullWidth
          isLoading={isUpdating}
          onClick={() => onToggleStatus(institution, isActive ? 'SUSPENDED' : 'ACTIVE')}
        >
          {isActive ? 'Suspend' : 'Reactivate'}
        </Button>
      </div>
    </Card>
  );
}

InstitutionCard.propTypes = {
  institution: PropTypes.shape({
    institutionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    logoDataUrl: PropTypes.string,
    primaryColor: PropTypes.string,
    adminEmail: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onEditBranding: PropTypes.func.isRequired,
  onEditDetails: PropTypes.func.isRequired,
  onEditFeatures: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default InstitutionCard;
